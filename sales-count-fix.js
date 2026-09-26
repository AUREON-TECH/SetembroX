// Contagem oficial de vendas — base até 25/09/2026.
// Regra: cada ocorrência de ATIVO em Status do contrato conta como uma venda.
(() => {
  const salesByPerson = {
  "Paulo": 5,
  "Ricardo": 2,
  "Renan": 4,
  "Otávio": 3,
  "André": 1,
  "Manara": 9,
  "Clacion": 8,
  "Pedro": 2,
  "Márcio": 4,
  "Jéssica": 5,
  "Larissa": 17,
  "Ana Caroline": 7,
  "Matheus Esley": 1,
  "Josyene": 4,
  "Tainá": 0,
  "Suene": 3,
  "Adriano": 1,
  "Weena": 8,
  "Cássio": 0,
  "Letícia": 0,
  "Matheus Domingos": 0,
  "Barbara": 0,
  "Felipe": 0,
  "Gabriel": 0
};
  const weekSalesByPerson = {
  "Paulo": 1,
  "Otávio": 1,
  "Clacion": 1,
  "Márcio": 1,
  "Jéssica": 2,
  "Ana Caroline": 1,
  "Josyene": 1,
  "Suene": 1,
  "Adriano": 1
};
  if (typeof S !== 'undefined') S.sales = 84;
  if (typeof P !== 'undefined') {
    P.forEach((person) => {
      if (Object.prototype.hasOwnProperty.call(salesByPerson, person.n)) person.s = salesByPerson[person.n];
      person.ws = weekSalesByPerson[person.n] || 0;
    });
  }
  if (typeof cinema === 'function') cinema();
  if (typeof radar === 'function') radar();
  if (typeof dash === 'function') dash();
  if (typeof renderTodayOps === 'function') renderTodayOps();
  if (typeof renderMetaPace === 'function') renderMetaPace();
  if (typeof renderDailyEvolution === 'function') renderDailyEvolution();
  if (typeof rank === 'function') rank();
  if (typeof individual === 'function') individual();
  if (typeof renderDiagnosis === 'function') renderDiagnosis();
  if (typeof renderFX === 'function') renderFX();
  if (typeof profile === 'function') profile();
  if (typeof projection === 'function') projection();
  if (typeof costs === 'function') costs();
})();
