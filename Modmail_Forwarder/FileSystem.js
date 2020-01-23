"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
var FileSystem;
(function (FileSystem) {
    function readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data.toString());
            });
        });
    }
    FileSystem.readFile = readFile;
})(FileSystem = exports.FileSystem || (exports.FileSystem = {}));
//# sourceMappingURL=FileSystem.js.map