// SETEMBRO X — atualização visual após carga oficial até 25/09/2026.
// As vendas por profissional já vêm do dataset da área selecionada.
(() => {
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
