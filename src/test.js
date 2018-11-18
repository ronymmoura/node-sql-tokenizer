import { Tokenizer } from ".";

console.log(new Tokenizer("SELECT * FROM CS_Teste WHERE Nome = 'Rony' AND Idade > 18 AND Email = @TXT_EMAIL").get());