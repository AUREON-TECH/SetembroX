// Correção da contagem de vendas — base oficial até 16/09/2026.
// Regra: cada ocorrência de ATIVO em Status do contrato conta como uma venda.
(() => {
  const salesByPerson = {
    'Ricardo': 1,
    'Paulo': 2,
    'Renan': 5,
    'Otávio': 2,
    'André': 1,
    'Clacion': 4,
    'Manara': 9,
    'Pedro': 3,
    'Larissa': 15,
    'Márcio': 2,
    'Ana Caroline': 3,
    'Jéssica': 3,
    'Matheus Esley': 1,
    'Josyene': 2,
    'Suene': 1,
    'Tainá': 0,
    'Cássio': 0,
    'Weena': 8,
    'Adriano': 0,
    'Letícia': 0,
    'Barbara': 0,
    'Felipe': 0,
    'Matheus Domingos': 0
  };

  const weekSalesByPerson = {
    'Paulo': 1,
    'Clacion': 1,
    'Manara': 7,
    'Márcio': 1,
    'Ana Caroline': 1,
    'Suene': 1
  };

  if (typeof S !== 'undefined') S.sales = 62;

  if (typeof P !== 'undefined') {
    P.forEach((person) => {
      if (Object.prototype.hasOwnProperty.call(salesByPerson, person.n)) person.s = salesByPerson[person.n];
      person.ws = weekSalesByPerson[person.n] || 0;
    });
  }

  // Recalcula as telas que dependem de vendas/conversão/ticket.
  if (typeof cinema === 'function') cinema();
  if (typeof radar === 'function') radar();
  if (typeof dash === 'function') dash();
  if (typeof rank === 'function') rank();
  if (typeof individual === 'function') individual();
  if (typeof profile === 'function') profile();
  if (typeof projection === 'function') projection();
  if (typeof costs === 'function') costs();
})();
