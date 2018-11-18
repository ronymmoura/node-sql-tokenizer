"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tokenizer = void 0;

var _xregexp = _interopRequireDefault(require("xregexp"));

var _keywords = _interopRequireDefault(require("./keywords"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var charIsLetter = (0, _xregexp.default)("^\\pL+$");
var charIsNumber = (0, _xregexp.default)("^\\pN+$");

var Tokenizer =
/*#__PURE__*/
function () {
  function Tokenizer(source) {
    _classCallCheck(this, Tokenizer);

    if (!source) throw new Error("É necessário informar um comando SQL");
    this.currentCharIndex = 0;
    this.source = source;
    this.result = [];
  }

  _createClass(Tokenizer, [{
    key: "get",
    value: function get() {
      // Parse the entire source
      while (!this.eof) {
        // read the next token
        var token = this.readToken(); // If the token exists, append to the result

        if (token) this.result = this.result.concat(token); //this.readNextChar();
      }

      return this.result;
    }
  }, {
    key: "readNextChar",
    value: function readNextChar() {
      this.currentCharIndex++;
    }
  }, {
    key: "readToken",
    value: function readToken() {
      if (charIsLetter.test(this.currentChar)) return this.readWord();
      if (charIsNumber.test(this.currentChar)) return this.readNumber();
      if (this.currentChar == "\'") return this.readString();
      if (this.currentChar == "@") return this.readVariable();
      return this.readSymbol();
    }
  }, {
    key: "readWord",
    value: function readWord() {
      var buffer = "";

      while ((charIsLetter.test(this.currentChar) || charIsNumber.test(this.currentChar) || this.currentChar == '_' || this.currentChar == '.') && !this.eof) {
        buffer = buffer.concat(this.currentChar);
        this.readNextChar();
      }

      var type = "word";
      if (_keywords.default.indexOf(buffer) > -1) type = "keyword";
      return {
        value: buffer,
        type: type
      };
    }
  }, {
    key: "readNumber",
    value: function readNumber() {
      var buffer = "";

      while ((charIsNumber.test(this.currentChar) || this.currentChar == '.') && !this.eof) {
        buffer = buffer.concat(this.currentChar);
        this.readNextChar();
      }

      return {
        value: buffer,
        type: "number"
      };
    }
  }, {
    key: "readString",
    value: function readString() {
      var buffer = this.currentChar;
      this.readNextChar();

      while (this.currentChar != '\'') {
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
  }, {
    key: "readVariable",
    value: function readVariable() {
      var buffer = "";

      while ((charIsLetter.test(this.currentChar) || charIsNumber.test(this.currentChar) || this.currentChar == '_' || this.currentChar == '@') && !this.eof) {
        buffer = buffer.concat(this.currentChar);
        this.readNextChar();
      }

      return {
        value: buffer,
        type: "variable"
      };
    }
  }, {
    key: "readSymbol",
    value: function readSymbol() {
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
          var token = {
            value: this.currentChar,
            type: "symbol"
          };
          this.readNextChar();
          return token;

        default:
          this.readNextChar();
          break;
      }

      return null;
    }
  }, {
    key: "currentChar",
    get: function get() {
      return this.source[this.currentCharIndex];
    }
  }, {
    key: "eof",
    get: function get() {
      return this.currentCharIndex >= this.source.length;
    }
  }]);

  return Tokenizer;
}();

exports.Tokenizer = Tokenizer;