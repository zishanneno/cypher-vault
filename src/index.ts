import fs from "fs";
import path from "path";

const SUPPORTED_EXTENSIONS = [".cypher", ".cql", ".cyp"];

export class CypherVault {
  private queryPath: string;
  private queries: Record<string, string>;

  constructor(queryPath: string) {
    this.queryPath = queryPath;
    this.queries = {};
  }

  public async loadQueries(): Promise<Record<string, string>> {
    try {
      const files = await this.readdirAsync(this.queryPath);
      const extensionPattern = new RegExp(
        `(${SUPPORTED_EXTENSIONS.map((ext) => `\\${ext}`).join("|")})$`
      );

      const readPromises = files.map((filePath) => {
        const relativePath = path.relative(this.queryPath, filePath);
        const queryKey = relativePath.split(path.sep).join("/");
        return fs.promises.readFile(filePath, "utf8").then((query) => ({
          key: queryKey.replace(extensionPattern, ""),
          query,
        }));
      });

      const results = await Promise.all(readPromises);
      this.queries = results.reduce<Record<string, string>>(
        (qs, { key, query }) => {
          qs[key] = query;
          return qs;
        },
        {}
      );

      return this.queries;
    } catch (error) {
      throw error;
    }
  }

  private readdirAsync = async (
    dirPath: string,
    arrayOfFiles: string[] = []
  ): Promise<string[]> => {
    try {
      const files = await fs.promises.readdir(dirPath);

      const filePromises = files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
          return this.readdirAsync(filePath, arrayOfFiles);
        } else {
          const extension = path.extname(file);
          if (SUPPORTED_EXTENSIONS.includes(extension)) {
            arrayOfFiles.push(filePath);
          }
          return [];
        }
      });

      const filesInDirectories = await Promise.all(filePromises);
      filesInDirectories.forEach((files) => {
        arrayOfFiles.push(...files);
      });

      return arrayOfFiles;
    } catch (error) {
      throw error;
    }
  };
}
