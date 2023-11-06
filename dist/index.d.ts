export declare class CypherVault {
    private queryPath;
    private queries;
    constructor(queryPath: string);
    loadQueries(): Record<string, string>;
    private readdirSync;
}
