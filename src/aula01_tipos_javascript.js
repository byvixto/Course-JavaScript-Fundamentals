/* function identificarTipo(tipoRecebido) {
    if (tipoRecebido == null) {
        return "null";
    } if (Array.isArray(tipoRecebido)) {
        return "isso aqui é um array, eu to verificando"
    } if (tipoRecebido instanceof Date) {
        return "isso aqui é uma Date, não precisa verificar"
    } if (typeof tipoRecebido == "bigint") {
        return "bigint"
    }
    return typeof tipoRecebido
} */
function identificarTipo(tipoRecebido) {
  console.log(tipoRecebido);

  console.log(typeof tipoRecebido);
  const valorConvertido = JSON.parse(tipoRecebido);
  if (Array.isArray(valorConvertido)) {
    return 'isso aqui é um array, eu to verificando';
  } else {
    return 'nenhum desses tipos é um array';
  }
}
module.exports = { identificarTipo };
