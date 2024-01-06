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
    http.post(`${data.server}/sign-in`, { hostname: os.hostname(), username: data.username, password: data.password })
    .then(response => {
        stopSpinner('Session saved successfully', '✔');
        config.addSession({ url: data.server, username: data.username, authentication: response.data });
    })
    .catch((err: Response) => {
        let message: string = '';
        if (err.status == 404) message = 'The route entered was wrong';
        if (err.status == 400) message = 'Incorrect credentials'
        stopSpinner(message, '✘');
    })
}