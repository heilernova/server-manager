import cliSpinners from "cli-spinners";
import logUpdate from "log-update";
import chalk from "chalk";

let interval: NodeJS.Timeout | undefined;

export const startSpinner = (message: string) => {
    const spinner = cliSpinners.dots5;
    let i = 0;
    let intervalTimer = setInterval(() => {
        const { frames } = spinner;
        logUpdate(chalk.blueBright(frames[i = ++i % frames.length]) + ` ${message}`);
    }, spinner.interval);

    interval = intervalTimer;

    return (message: string, icon: '✔' | '✘') => {
        if (interval){
            clearInterval(interval);
            interval = undefined;
            let iconstr = '';
            if (icon == '✘') iconstr = chalk.redBright(icon) + ' ';
            if (icon == '✔') iconstr = chalk.greenBright(icon) + ' ';
            logUpdate(`${iconstr}${message}`);
        }
    }
}

export const stopSpinner = (message: string, icon?: '✔' | '✘') => {
    if (interval){
        clearInterval(interval);
        interval = undefined;
        let iconstr = '';
        if (icon == '✘') iconstr = chalk.redBright(icon) + ' ';
        if (icon == '✔') iconstr = chalk.greenBright(icon) + ' ';
        logUpdate(`${iconstr}${message}`);
    }
}