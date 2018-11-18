"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
console.log(new _1.Tokenizer("SELECT * FROM CS_Teste WHERE Nome = 'Rony' AND Idade > 18 AND Email = @TXT_EMAIL").get());
