import { Forwarder } from './Forwarder';
import { FileSystem } from './FileSystem';
import { Utils } from './Utils';
import { Request } from './Request';

module Main {
    export async function run() {
        try {
            let config = JSON.parse(await FileSystem.readFile("config.json")) as Forwarder.Config;
            if (process.execArgv.find(x => x.includes("inspect"))) //Debug mode
                Object.assign(config, JSON.parse(await FileSystem.readFile("config.debug.json")));

            console.log("Loaded configuration:");
            console.log(config);

            Request.defaultUserAgent = `script:${config.credentials.client_id}: ${config.version}(by /u/daxianj)`;

            const forwarderInstance = new Forwarder(config);
            forwarderInstance.checkMessages();
        }
        catch (err) {
            console.error(err);
        }
        finally {
            (function noExit() {
                setTimeout(() => noExit(), 5000);
            })();
        }
    }

}

Utils.utils(null);

process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
})

Main.run();