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

  public loadQueries(): Record<string, string> {
    const files = this.readdirSync(this.queryPath);
    const extensionPattern = new RegExp(
      `(${SUPPORTED_EXTENSIONS.map((ext) => `\\${ext}`).join("|")})$`
    );

    this.queries = files.reduce<Record<string, string>>((qs, filePath) => {
      const relativePath = path.relative(this.queryPath, filePath);
      const queryKey = relativePath.split(path.sep).join("/"); // Ensure forward slashes for all OS
      const query = fs.readFileSync(filePath, "utf8");
      qs[queryKey.replace(extensionPattern, "")] = query;
      return qs;
    }, {});

    return this.queries;
  }

  private readdirSync = (
    dirPath: string,
    arrayOfFiles?: string[]
  ): string[] => {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
      if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
        arrayOfFiles = this.readdirSync(path.join(dirPath, file), arrayOfFiles);
      } else {
        const extension = path.extname(file);
        if (arrayOfFiles && SUPPORTED_EXTENSIONS.includes(extension)) {
          arrayOfFiles.push(path.join(dirPath, file));
        }
      }
    });

    return arrayOfFiles;
  };
}
