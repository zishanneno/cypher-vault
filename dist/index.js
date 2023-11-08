"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.readdirAsync = (dirPath, arrayOfFiles = []) => __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield fs_1.default.promises.readdir(dirPath);
                const filePromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const filePath = path_1.default.join(dirPath, file);
                    const stat = yield fs_1.default.promises.stat(filePath);
                    if (stat.isDirectory()) {
                        return this.readdirAsync(filePath, arrayOfFiles);
                    }
                    else {
                        const extension = path_1.default.extname(file);
                        if (SUPPORTED_EXTENSIONS.includes(extension)) {
                            arrayOfFiles.push(filePath);
                        }
                        return [];
                    }
                }));
                const filesInDirectories = yield Promise.all(filePromises);
                filesInDirectories.forEach((files) => {
                    arrayOfFiles.push(...files);
                });
                return arrayOfFiles;
            }
            catch (error) {
                throw error;
            }
        });
        this.queryPath = queryPath;
        this.queries = {};
    }
    loadQueries() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield this.readdirAsync(this.queryPath);
                const extensionPattern = new RegExp(`(${SUPPORTED_EXTENSIONS.map((ext) => `\\${ext}`).join("|")})$`);
                const readPromises = files.map((filePath) => {
                    const relativePath = path_1.default.relative(this.queryPath, filePath);
                    const queryKey = relativePath.split(path_1.default.sep).join("/");
                    return fs_1.default.promises.readFile(filePath, "utf8").then((query) => ({
                        key: queryKey.replace(extensionPattern, ""),
                        query,
                    }));
                });
                const results = yield Promise.all(readPromises);
                this.queries = results.reduce((qs, { key, query }) => {
                    qs[key] = query;
                    return qs;
                }, {});
                return this.queries;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.CypherVault = CypherVault;
