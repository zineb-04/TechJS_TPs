#!/usr/bin/env node

const { getPokemon, getMoveDetails } = require("./src/api");
const { battle } = require("./src/battle");
const { askPokemonName } = require("./src/prompt");
const { showResult } = require("./src/display");

async function main() {
  console.log("=================================");
  console.log("   Bienvenue dans Pokémon CLI !  ");
  console.log("=================================\n");

  // Demander le Pokémon du joueur
  const playerName = await askPokemonName();

  console.log(`\n⏳ Chargement de ${playerName}...`);

  // Liste de Pokémon pour le bot (choix aléatoire)
  const botPool = ["charizard", "blastoise", "venusaur", "gengar", "machamp"];
  const botName = botPool[Math.floor(Math.random() * botPool.length)];

  // Récupérer les données des deux Pokémon
  let playerData, botData;
  try {
    playerData = await getPokemon(playerName.toLowerCase());
    botData = await getPokemon(botName);
  } catch (err) {
    console.log(`\n❌ Pokémon "${playerName}" introuvable. Vérifie l'orthographe !`);
    process.exit(1);
  }

  // Récupérer les détails des moves (puissance, précision, PP)
  console.log("⏳ Chargement des moves...\n");
  const playerMoves = await Promise.all(playerData.moves.map(getMoveDetails));
  const botMoves = await Promise.all(botData.moves.map(getMoveDetails));

  console.log(`⚔️  ${playerData.name.toUpperCase()} vs ${botData.name.toUpperCase()}`);
  console.log("Que le combat commence !\n");

  // Lancer le combat et récupérer le gagnant
  const winner = await battle(playerMoves, botMoves, playerData.name, botData.name);

  showResult(winner, playerData.name);
}

main();