"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xregexp_1 = __importDefault(require("xregexp"));
var keywords_1 = __importDefault(require("./keywords"));
var Token_1 = require("./Token");
exports.TokenType = Token_1.TokenType;
var charIsLetter = xregexp_1.default("^\\pL+$");
var charIsNumber = xregexp_1.default("^\\pN+$");
var Tokenizer = /** @class */ (function () {
    function Tokenizer(source) {
        if (!source)
            throw new Error("É necessário informar um comando SQL");
        this.currentCharIndex = 0;
        this.source = source;
        this.result = [];
    }
    Object.defineProperty(Tokenizer.prototype, "currentChar", {
        get: function () {
            return this.source[this.currentCharIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tokenizer.prototype, "eof", {
        get: function () {
            return this.currentCharIndex >= this.source.length;
        },
        enumerable: true,
        configurable: true
    });
    Tokenizer.prototype.get = function () {
        // Parse the entire source
        while (!this.eof) {
            // read the next token
            var token = this.readToken();
            // If the token exists, append to the result
            if (token)
                this.result.push(token);
        }
        return this.result;
    };
    Tokenizer.prototype.readNextChar = function () {
        this.currentCharIndex++;
    };
    Tokenizer.prototype.readToken = function () {
        if (charIsLetter.test(this.currentChar))
            return this.readWord();
        if (charIsNumber.test(this.currentChar))
            return this.readNumber();
        if (this.currentChar == "\'")
            return this.readString();
        if (this.currentChar == "@")
            return this.readVariable();
        return this.readSymbol();
    };
    Tokenizer.prototype.readWord = function () {
        var buffer = "";
        while ((charIsLetter.test(this.currentChar) || charIsNumber.test(this.currentChar) || this.currentChar == '_' || this.currentChar == '.') && !this.eof) {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }
        var type = Token_1.TokenType.Word;
        if (keywords_1.default.indexOf(buffer) > -1)
            type = Token_1.TokenType.Keyword;
        return new Token_1.Token(buffer, type);
    };
    Tokenizer.prototype.readNumber = function () {
        var buffer = "";
        while ((charIsNumber.test(this.currentChar) || this.currentChar == '.') && !this.eof) {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }
        return new Token_1.Token(buffer, Token_1.TokenType.Number);
    };
    Tokenizer.prototype.readString = function () {
        var buffer = this.currentChar;
        this.readNextChar();
        while (this.currentChar != '\'') {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }
        buffer = buffer.concat(this.currentChar);
        this.readNextChar();
        return new Token_1.Token(buffer, Token_1.TokenType.String);
    };
    Tokenizer.prototype.readVariable = function () {
        var buffer = "";
        while ((charIsLetter.test(this.currentChar) || charIsNumber.test(this.currentChar) || this.currentChar == '_' || this.currentChar == '@') && !this.eof) {
            buffer = buffer.concat(this.currentChar);
            this.readNextChar();
        }
        return new Token_1.Token(buffer, Token_1.TokenType.Variable);
    };
    Tokenizer.prototype.readSymbol = function () {
        switch (this.currentChar) {
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
                var token = new Token_1.Token(this.currentChar, Token_1.TokenType.Symbol);
                this.readNextChar();
                return token;
            default:
                this.readNextChar();
                break;
        }
        return null;
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
