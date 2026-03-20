//Receber uma palavra
//Comparar o primeiro e o ultimo caractere sejam iguais
//Comparar o segundo com o último
//Continuar até o meio da palavra
//Se todos forem iguais, é um palindromo
function verificarPalindromo(palindromo) {
  palindromo = palindromo.toLowerCase().replace(/\s/g, '');
  console.log;
  let inicio = 0;
  let fim = palindromo.length - 1; //O -1 é para pegar o final do texto
  debugger;
  for (inicio = 0; inicio < fim; inicio++) {
    //o for executa uma instrução se atender a condição passada
    if (palindromo[inicio] != palindromo[fim]) {
      return false;
    } //acessar uma letra por indice usando colchete
    fim--;
  }
  return true;
}

module.exports = { verificarPalindromo };

//decodeURIComponent
