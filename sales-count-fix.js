// Contagem oficial de vendas — base até 21/09/2026.
// Regra: cada ocorrência de ATIVO em Status do contrato conta como uma venda.
(() => {
  const salesByPerson = {
  "Paulo": 4,
  "Ricardo": 2,
  "Renan": 5,
  "André": 1,
  "Otávio": 2,
  "Clacion": 7,
  "Manara": 9,
  "Pedro": 3,
  "Márcio": 3,
  "Ana Caroline": 6,
  "Larissa": 17,
  "Matheus Esley": 1,
  "Jéssica": 3,
  "Josyene": 3,
  "Tainá": 0,
  "Suene": 2,
  "Adriano": 1,
  "Cássio": 0,
  "Weena": 8,
  "Letícia": 0,
  "Matheus Domingos": 0,
  "Barbara": 0,
  "Felipe": 0
};
  const weekSalesByPerson = {
  "Adriano": 1
};
  if (typeof S !== 'undefined') S.sales = 77;
  if (typeof P !== 'undefined') {
    P.forEach((person) => {
      if (Object.prototype.hasOwnProperty.call(salesByPerson, person.n)) person.s = salesByPerson[person.n];
      person.ws = weekSalesByPerson[person.n] || 0;
    });
  }
  if (typeof cinema === 'function') cinema();
  if (typeof radar === 'function') radar();
  if (typeof dash === 'function') dash();
  if (typeof rank === 'function') rank();
  if (typeof individual === 'function') individual();
  if (typeof profile === 'function') profile();
  if (typeof projection === 'function') projection();
  if (typeof costs === 'function') costs();
})();
