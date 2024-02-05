import os from "node:os";
import inquirer from "inquirer"
import { inject } from "../core.js";
import { startSpinner, stopSpinner } from "../common/spinner.js";
import { Response } from "../common/http.js";

export const login = async () => {
    const cache = inject.cache();
    const http = inject.httpClient();
    const config = inject.config();
    let data: { server: string, username: string, password: string } = await inquirer.prompt([
        { name: 'server', message: 'Server', type: 'input', default: cache.login?.server },
        { name: 'username', message: 'Username', type: 'input', default: cache.login?.username },
        { name: 'password', message: 'Password', type: 'password', mask: '*' }
    ]);
    data.server = data.server.replace(/\/$/, '');
    startSpinner('Verifying credentials');

    http.post<ILoginResponse>(`${data.server}/sign-in`, { hostname: os.hostname(), username: data.username, password: data.password })
    .then(response => {
        config.addServer({
            url: data.server,
            username: response.data.username,
            authorization: response.data.authorization
        });
        stopSpinner('Session saved successfully', '✔');
    })
    .catch((err: Response) => {
        let message: string = '';
        if (err.status == 404) message = 'The route entered was wrong';
        if (err.status == 400) message = 'Incorrect credentials'
        stopSpinner(message, '✘');
    })
}

export interface ILoginResponse  {
        username: string,
        name: string,
        lastName: string,
        role: "admin" | "collaborator",
        authorization: {
            type: "key",
            name: string,
            value: string
        }
}