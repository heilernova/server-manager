import { ReadStream, createReadStream, createWriteStream, existsSync } from "node:fs";
import inquirer from "inquirer";
import chalk from "chalk";
import { IProject, IServer } from "../config/config.interfaces.js";
import { inject } from "../core.js"
import { startSpinner, stopSpinner } from "../common/spinner.js";
import archiver from "archiver";
import { basename } from "node:path";
import FormData from "form-data";
import { HttpClient, Response } from "../common/http.js";

export const deploy = async () => {
    let config = inject.config();
    let http: HttpClient;
    let project: IProject;
    let formData: FormData;

    if (config.projects.length == 0) {
        console.log('No projects have been configured to deploy');
        process.exit();
    }

    if (config.projects.length == 1) {
        project = config.projects[0];
    } else {
        project = (await inquirer.prompt({ name: 'project', message: 'Select project', type: 'list', choices: config.projects.map(x => { return { value: x, name: `${x.domina} ${x.name}` }}) })).project;
    }

    if (!(await inquirer.prompt({ name: 'confirm', message: `Deploy [${chalk.greenBright(`${project.domina} ${project.name}`)}] in ${chalk.cyan(project.deployIn)}`, type: 'confirm' })).confirm){
        process.exit();
    }

    // Verificamos si la sección esta activa para el proyecto
    let session: IServer | undefined = config.servers.find(x => x.url == project.deployIn);
    if (!session){
        console.log(chalk.redBright(`There is no session for ${project.deployIn}`));
        process.exit();
    }
    http = inject.httpClient().server(session);
    // Generamos el archivo ZIP
    let stream = await generareZip(project);
    formData = new FormData();
    formData.append('id', project.id);
    formData.append('zip', stream);

    startSpinner('Deploying application to the server');
    http.post(`deploy`, formData)
    .then(response => {
        if (response.data.status == 'online'){
            stopSpinner('Deployment completed', '✔');
        } else {
            stopSpinner('The application does not work correctly', '✘');
        }
        console.log(response.data);
    })
    .catch((err: Response) => {
        stopSpinner(`[${err.status}] Error: ${err.data.message}`, '✘');
    })
}

const generareZip = (project: IProject) => {
    return new Promise<ReadStream>((resolve, reject) => {
        const zipName: string = `deploy.zip`;
        startSpinner('Compressing files');
        try {
            if (!existsSync(project.location)){
                stopSpinner(`Directory not found ${project.location}`, '✘');
                process.exit(0);
            }
            const ouPut = createWriteStream(zipName);
            const archive = archiver('zip');
            archive.pipe(ouPut);
            archive.directory(project.location, false);
            project.include.forEach((filename: string) => {
                archive.file(filename, { name: basename(filename) });
            });
            archive.on('error', ()   => {
                stopSpinner('Error compressing files', '✘');
                process.exit();
            });
            archive.finalize().then(() => {
                setTimeout(() => {
                    stopSpinner('Compressed file', '✔');
                    resolve(createReadStream(zipName));
                }, 500);
            })
        } catch (error) {
            stopSpinner('Unexpected error when compressing files', '✘');
            process.exit();
        }
    })
}