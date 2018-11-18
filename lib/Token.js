"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Token = /** @class */ (function () {
    function Token(value, type) {
        this.value = value;
        this.type = type;
    }
    return Token;
}());
exports.Token = Token;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Keyword"] = 0] = "Keyword";
    TokenType[TokenType["Word"] = 1] = "Word";
    TokenType[TokenType["Number"] = 2] = "Number";
    TokenType[TokenType["Symbol"] = 3] = "Symbol";
    TokenType[TokenType["String"] = 4] = "String";
    TokenType[TokenType["Variable"] = 5] = "Variable";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
