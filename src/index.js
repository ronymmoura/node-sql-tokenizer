import XRegExp from "xregexp";
import keywords from "./keywords";

var charIsLetter = XRegExp("^\\pL+$");
var charIsNumber = XRegExp("^\\pN+$");

export class Tokenizer {

    constructor(source) {
        if(!source)
            throw new Error("É necessário informar um comando SQL");

        this.currentCharIndex = 0;
        this.source = source;
        this.result = [];
    }
    
    get currentChar() {
        return this.source[this.currentCharIndex];
    }

    get eof() {
        return this.currentCharIndex >= this.source.length;
    }

    get() {
        // Parse the entire source
        while(!this.eof) {

            // read the next token
            const token = this.readToken();

            // If the token exists, append to the result
            if(token)
                this.result = this.result.concat(token);
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
        var buffer = "";

        while((charIsLetter.test(this.currentChar) || charIsNumber.test(this.currentChar) || this.currentChar == '_' || this.currentChar == '.') && !this.eof) {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }

        var type = "word";

        if(keywords.indexOf(buffer) > -1)
            type = "keyword";

        return {
            value: buffer,
            type: type
        };
    }

    readNumber() {
        var buffer = "";

        while((charIsNumber.test(this.currentChar) || this.currentChar == '.') && !this.eof) {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }

        return {
            value: buffer,
            type: "number"
        };
    }

    readString() {
        var buffer = this.currentChar;
        this.readNextChar();

        while(this.currentChar != '\'') {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }

        buffer = buffer.concat(this.currentChar);
        this.readNextChar();

        return {
            value: buffer,
            type: "string"
        };
    }

    readVariable() {
        var buffer = "";

        while((charIsLetter.test(this.currentChar) || charIsNumber.test(this.currentChar) || this.currentChar == '_' || this.currentChar == '@') && !this.eof) {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }

        return {
            value: buffer,
            type: "variable"
        };
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
                var token = { value: this.currentChar, type: "symbol" };
                this.readNextChar();
                return token;
            default:
                this.readNextChar();
                break;
        }

        return null;
    }
    
}