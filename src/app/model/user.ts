export class User {
    private _name: string;
    private _karma: number;

    constructor(name?: string , karma?: number) {
        if (name) {
            this._name = name;
        }

        if (karma) {
            this._karma = karma;
        }
    }

    set name(name: string) {
        this._name = name; 
    }

    set karma(karma: number) {
        this._karma = karma;
    }

    get name() {
        return this._name;
    }

    get karma() {
        return this._karma;
    }

    public static getKarma(userObject: any): number {
        return userObject['comment_karma'] + userObject['link_karma'];
    }
}