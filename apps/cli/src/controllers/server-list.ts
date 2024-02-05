import { inject } from "../core.js";

export const serverListController = () => {
    const config = inject.config();
    if (config.servers.length > 0){
        console.table(config.servers.map(x => {
            return {
                url: x.url,
                username: x.username,
                authentication: x.authorization.type
            }
        }))
    } else {
        console.log("No servers");
    }
}