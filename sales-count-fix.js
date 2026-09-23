// Contagem oficial de vendas — base até 22/09/2026.
// Regra: cada ocorrência de ATIVO em Status do contrato conta como uma venda.
(() => {
  const salesByPerson = {
  "Paulo": 4,
  "Ricardo": 2,
  "Renan": 5,
  "Otávio": 2,
  "André": 1,
  "Manara": 9,
  "Clacion": 7,
  "Pedro": 3,
  "Márcio": 4,
  "Jéssica": 3,
  "Larissa": 17,
  "Ana Caroline": 6,
  "Matheus Esley": 1,
  "Josyene": 3,
  "Tainá": 0,
  "Suene": 2,
  "Adriano": 1,
  "Weena": 8,
  "Cássio": 0,
  "Letícia": 0,
  "Matheus Domingos": 0,
  "Barbara": 0,
  "Felipe": 0
};
  const weekSalesByPerson = {
  "Márcio": 1,
  "Adriano": 1
};
  if (typeof S !== 'undefined') S.sales = 78;
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
  if (typeof renderDiagnosis === 'function') renderDiagnosis();\n  if (typeof renderFX === 'function') renderFX();
  if (typeof profile === 'function') profile();
  if (typeof projection === 'function') projection();
  if (typeof costs === 'function') costs();
})();
