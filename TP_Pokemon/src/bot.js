/**
 * Choisit un move aléatoirement parmi la liste du bot
 * @param {Array} moves - Liste des moves du bot
 * @returns {object} Le move choisi
 */
function chooseBotMove(moves) {
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

module.exports = { chooseBotMove };