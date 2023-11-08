export declare class CypherVault {
    private queryPath;
    private queries;
    constructor(queryPath: string);
    loadQueries(): Promise<Record<string, string>>;
    private readdirAsync;
}
