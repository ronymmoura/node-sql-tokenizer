export class Token {
    value: string;
    type: TokenType;

    constructor(value: string, type: TokenType) {
        this.value = value;
        this.type = type;
    }

}

export enum TokenType {
    Keyword,
    Word,
    Number,
    Symbol,
    String,
    Variable
}