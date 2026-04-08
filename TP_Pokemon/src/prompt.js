const inquirer = require("inquirer");

/**
 * Demande le nom du Pokémon au joueur
 * @returns {string} Nom saisi
 */
async function askPokemonName() {
  const { pokemonName } = await inquirer.prompt([
    {
      type: "input",
      name: "pokemonName",
      message: "🎮 Choisis ton Pokémon (ex: pikachu, bulbasaur, mewtwo) :",
      validate: (input) => {
        if (!input.trim()) return "Le nom ne peut pas être vide !";
        return true;
      },
    },
  ]);
  return pokemonName.trim();
}

/**
 * Affiche la liste des moves disponibles et demande le choix du joueur
 * @param {Array} moves - Liste des moves avec leurs stats
 * @returns {object} Le move choisi
 */
async function askMove(moves) {
  const choices = moves.map((m) => ({
    name: `${m.name.padEnd(20)} | power: ${String(m.power).padStart(3)}  acc: ${String(m.accuracy).padStart(3)}%  pp: ${m.pp}`,
    value: m,
  }));

  const { chosenMove } = await inquirer.prompt([
    {
      type: "list",
      name: "chosenMove",
      message: "⚔️  Choisis ton attaque :",
      choices,
    },
  ]);

  return chosenMove;
}

module.exports = { askPokemonName, askMove };