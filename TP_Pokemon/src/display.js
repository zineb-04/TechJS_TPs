
/**
 * Affiche les HP actuels des deux joueurs
 */
function showStatus(playerHp, botHp, playerName, botName) {
  console.log("─────────────────────────────────");
  console.log(`❤️  ${playerName} : ${playerHp} HP  |  ${botName} : ${botHp} HP`);
  console.log("─────────────────────────────────");
}

/**
 * Affiche le résultat final du combat
 * @param {string} winner  - "player" ou "bot"
 * @param {string} playerName
 */
function showResult(winner, playerName) {
  console.log("\n=================================");
  if (winner === "player") {
    console.log(`🏆 ${playerName.toUpperCase()} a gagné ! Félicitations !`);
  } else {
    console.log("💀 Tu as perdu... Entraîne-toi et reviens !");
  }
  console.log("=================================\n");
}

module.exports = { showStatus, showResult };