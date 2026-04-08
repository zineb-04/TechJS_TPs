const { askMove } = require("./prompt");
const { chooseBotMove } = require("./bot");
const { showStatus } = require("./display");

/**
 * Tente un move et retourne les dégâts infligés
 * - Si pp <= 0 → move épuisé, attaque bloquée
 * - L'accuracy détermine si l'attaque touche
 */
function attemptMove(move) {
  // Vérifier si le move a encore des PP
  if (move.pp <= 0) {
    console.log(`  ${move.name} n'a plus de PP !`);
    return 0;
  }

  // Consommer 1 PP
  move.pp--;

  // Vérifier l'accuracy
  const roll = Math.random() * 100;
  if (roll > move.accuracy) {
    console.log(`❌ ${move.name} a raté ! (accuracy: ${move.accuracy}%)`);
    return 0;
  }

  return move.power;
}

/**
 * Boucle de jeu principale
 * Les deux joueurs partent avec 300 HP
 * Le premier à 0 HP perd
 * @returns {string} "player" ou "bot"
 */
async function battle(playerMoves, botMoves, playerName, botName) {
  let playerHp = 300;
  let botHp = 300;

  while (playerHp > 0 && botHp > 0) {
    showStatus(playerHp, botHp, playerName, botName);

    // Vérifier si le joueur a encore des moves utilisables
    const usableMoves = playerMoves.filter((m) => m.pp > 0);
    if (usableMoves.length === 0) {
      console.log("💤 Tu n'as plus de PP sur aucun move ! Tu perds automatiquement.");
      return "bot";
    }

    // Tour du joueur
    const playerMove = await askMove(playerMoves);

    // Tour du bot
    const botMove = chooseBotMove(botMoves);
    console.log(
      `\n🤖 ${botName} utilise : ${botMove.name} (power: ${botMove.power}, acc: ${botMove.accuracy}%, pp: ${botMove.pp})`
    );

    console.log("");

    // Calcul des dégâts
    const playerDmg = attemptMove(playerMove);
    const botDmg = attemptMove(botMove);

    // Application des dégâts
    if (playerDmg > 0) {
      console.log(`✅ ${playerName} inflige ${playerDmg} dégâts à ${botName} !`);
      botHp = Math.max(0, botHp - playerDmg);
    }

    if (botDmg > 0) {
      console.log(`💥 ${botName} inflige ${botDmg} dégâts à ${playerName} !`);
      playerHp = Math.max(0, playerHp - botDmg);
    }

    console.log("");
  }

  return playerHp > 0 ? "player" : "bot";
}

module.exports = { attemptMove, battle };