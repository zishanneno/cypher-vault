"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypherVault = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const SUPPORTED_EXTENSIONS = [".cypher", ".cql", ".cyp"];
class CypherVault {
    constructor(queryPath) {
        this.readdirSync = (dirPath, arrayOfFiles) => {
            const files = fs_1.default.readdirSync(dirPath);
            arrayOfFiles = arrayOfFiles || [];
            files.forEach((file) => {
                if (fs_1.default.statSync(path_1.default.join(dirPath, file)).isDirectory()) {
                    arrayOfFiles = this.readdirSync(path_1.default.join(dirPath, file), arrayOfFiles);
                }
                else {
                    const extension = path_1.default.extname(file);
                    if (arrayOfFiles && SUPPORTED_EXTENSIONS.includes(extension)) {
                        arrayOfFiles.push(path_1.default.join(dirPath, file));
                    }
                }
            });
            return arrayOfFiles;
        };
        this.queryPath = queryPath;
        this.queries = {};
    }
    loadQueries() {
        const files = this.readdirSync(this.queryPath);
        const extensionPattern = new RegExp(`(${SUPPORTED_EXTENSIONS.map((ext) => `\\${ext}`).join("|")})$`);
        this.queries = files.reduce((qs, filePath) => {
            const relativePath = path_1.default.relative(this.queryPath, filePath);
            const queryKey = relativePath.split(path_1.default.sep).join("/"); // Ensure forward slashes for all OS
            const query = fs_1.default.readFileSync(filePath, "utf8");
            qs[queryKey.replace(extensionPattern, "")] = query;
            return qs;
        }, {});
        return this.queries;
    }
}
exports.CypherVault = CypherVault;
