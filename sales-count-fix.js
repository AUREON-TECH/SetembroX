// Contagem oficial de vendas — base até 20/09/2026.
// Regra: cada ocorrência de ATIVO em Status do contrato conta como uma venda.
(() => {
  const salesByPerson = {
  "Ricardo": 2,
  "Paulo": 4,
  "Renan": 5,
  "André": 1,
  "Otávio": 2,
  "Manara": 9,
  "Clacion": 7,
  "Pedro": 3,
  "Larissa": 17,
  "Ana Caroline": 6,
  "Márcio": 3,
  "Jéssica": 3,
  "Matheus Esley": 1,
  "Josyene": 3,
  "Suene": 2,
  "Tainá": 0,
  "Weena": 8,
  "Cássio": 0,
  "Adriano": 0,
  "Letícia": 0,
  "Matheus Domingos": 0,
  "Barbara": 0,
  "Felipe": 0
};
  const weekSalesByPerson = {
  "Ricardo": 1,
  "Paulo": 3,
  "Manara": 7,
  "Clacion": 4,
  "Pedro": 2,
  "Larissa": 2,
  "Ana Caroline": 4,
  "Márcio": 2,
  "Josyene": 1,
  "Suene": 2
};
  if (typeof S !== 'undefined') S.sales = 76;
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
