const {identificarTipo} = require("./aula01_tipos_javascript")
const {verificarPalindromo}= require("./aula02_algoritimos_classicos")
const express = require("express");
const app = express();
const PORT = 3000;
//aqui tem três variáveis
app.get("/tipo", (req, res) => {

    let valor = req.query.valor;
console.log(valor);

    const tipo = identificarTipo(valor);
    console.log(tipo);
/* console.log(identificarTipo([1,2,3,4,5]));
console.log(identificarTipo(true));
console.log(identificarTipo(null));
console.log(identificarTipo({}));
console.log(identificarTipo(()=>{}));
console.log(identificarTipo(new Date())); */
    res.json({
        valor,
        tipo
    });

});
app.get("/algoritimo", (req, res) => {

    let valor = req.query.valor;
console.log(valor);
let verificacao = verificarPalindromo(valor)
res.json({
        valor:verificacao,
    });

});
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
//as variaveis no javascript aplicam o tipo automaticamente
//eu tenho os seguintes tipos: string(texto),number,booleano,object,array(estrutura de lista ordenada),function(são objetos de primeira classe),date,regexp
//próxima aula:for, foreach, while, *if, else*