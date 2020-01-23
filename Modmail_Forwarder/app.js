"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { Forwarder } from './Forwarder';
const FileSystem_1 = require("./FileSystem");
const Utils_1 = require("./Utils");
var Main;
(function (Main) {
    async function run() {
        try {
            let content = JSON.parse(await FileSystem_1.FileSystem.readFile("config.json"));
            if (process.execArgv.find(x => x.includes("inspect"))) //Debug mode
                Object.assign(content, JSON.parse(await FileSystem_1.FileSystem.readFile("config.debug.json")));
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
    Main.run = run;
})(Main || (Main = {}));
Utils_1.Utils.utils(null);
process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err);
    process.exit(1); //mandatory (as per the Node.js docs)
});
Main.run();
//# sourceMappingURL=app.js.map