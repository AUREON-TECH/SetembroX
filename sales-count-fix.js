// Contagem oficial de vendas — base até 18/09/2026.
// Regra: cada ocorrência de ATIVO em Status do contrato conta como uma venda.
(() => {
  const salesByPerson = {
  "Ricardo": 1,
  "Renan": 5,
  "Paulo": 3,
  "André": 1,
  "Otávio": 2,
  "Pedro": 3,
  "Clacion": 4,
  "Manara": 9,
  "Márcio": 3,
  "Larissa": 15,
  "Ana Caroline": 3,
  "Jéssica": 3,
  "Matheus Esley": 1,
  "Josyene": 2,
  "Suene": 1,
  "Tainá": 0,
  "Cássio": 0,
  "Weena": 8,
  "Adriano": 0,
  "Letícia": 0,
  "Barbara": 0,
  "Matheus Domingos": 0,
  "Felipe": 0
};
  const weekSalesByPerson = {
  "Paulo": 2,
  "Pedro": 2,
  "Clacion": 1,
  "Manara": 7,
  "Márcio": 2,
  "Ana Caroline": 1,
  "Suene": 1
};
  if (typeof S !== 'undefined') S.sales = 64;
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
