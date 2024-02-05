#!/usr/bin/env node
import { Command } from "commander";
import { login } from "./controllers/login.js";
import { factory, inject } from "./core.js";
import { addProject } from "./controllers/add-project.js";
import { deploy } from "./controllers/deploy.js";
import { serverListController } from "./controllers/server-list.js";

const program = new Command();

await factory();

program.action(() => deploy());
program.version(inject.config().version, '-v, --version', 'Output the current version.');
program.command('servers').action(() => serverListController());
program.command('login').action(() => login());
program.command('add').action(() => addProject());
program.parse(process.argv);