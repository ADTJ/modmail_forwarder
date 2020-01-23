//import { Forwarder } from './Forwarder';
import { FileSystem } from './FileSystem';
import { Request } from './Request';
import { Utils } from './Utils';

module Main {
    export async function run() {
        try {
            let content = JSON.parse(await FileSystem.readFile("config.json"));
            if (process.execArgv.find(x => x.includes("inspect"))) //Debug mode
                Object.assign(content, JSON.parse(await FileSystem.readFile("config.debug.json")));

            console.log(content);
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