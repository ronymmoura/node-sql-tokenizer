import XRegExp from "xregexp";
import keywords from "./keywords";
import { Token, TokenType } from "./Token";

var charIsLetter = XRegExp("^\\pL+$");
var charIsNumber = XRegExp("^\\pN+$");

export { TokenType };

export class Tokenizer {

    source: string;
    currentCharIndex: number;
    result: Array<Token>;
    
    get currentChar() {
        return this.source[this.currentCharIndex];
    }

    get eof() {
        return this.currentCharIndex >= this.source.length;
    }

    constructor(source: string) {
        if(!source)
            throw new Error("É necessário informar um comando SQL");

        this.currentCharIndex = 0;
        this.source = source;
        this.result = [];
    }

    get() {
        // Parse the entire source
        while(!this.eof) {

            // read the next token
            const token = this.readToken();

            // If the token exists, append to the result
            if(token)
                this.result.push(token);
        }

        return this.result;
    }

    readNextChar() {
        this.currentCharIndex++;
    }

    readToken() {
        if(charIsLetter.test(this.currentChar))
            return this.readWord();

        if(charIsNumber.test(this.currentChar))
            return this.readNumber();

        if(this.currentChar == "\'")
            return this.readString();

        if(this.currentChar == "@")
            return this.readVariable();

        return this.readSymbol();
    }

    readWord() {
        let buffer: string = "";

        while((charIsLetter.test(this.currentChar) || charIsNumber.test(this.currentChar) || this.currentChar == '_' || this.currentChar == '.') && !this.eof) {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }

        var type = TokenType.Word;

        if(keywords.indexOf(buffer) > -1)
            type = TokenType.Keyword;

        return new Token(buffer, type);
    }

    readNumber() {
        let buffer: string = "";

        while((charIsNumber.test(this.currentChar) || this.currentChar == '.') && !this.eof) {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }

        return new Token(buffer, TokenType.Number);
    }

    readString() {
        let buffer: string = this.currentChar;
        this.readNextChar();

        while(this.currentChar != '\'') {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }

        buffer = buffer.concat(this.currentChar);
        this.readNextChar();

        return new Token(buffer, TokenType.String);
    }

    readVariable() {
        let buffer: string = "";

        while((charIsLetter.test(this.currentChar) || charIsNumber.test(this.currentChar) || this.currentChar == '_' || this.currentChar == '@') && !this.eof) {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }

        return new Token(buffer, TokenType.Variable);
    }

    readSymbol() {
        switch (this.currentChar)
        {
            case '+':
            case '-':
            case '*':
            case '/':
            case '^':
            case '(':
            case ')':
            case '[':
            case ']':
            case ';':
            case ':':
            case '=':
            case '.':
            case ',':
            case '!':
            case '<':
            case '>':
                var token = new Token(this.currentChar, TokenType.Symbol);
                this.readNextChar();
                return token;
            default:
                this.readNextChar();
                break;
        }

        return null;
    }
    
}