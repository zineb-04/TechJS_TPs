const axios = require("axios");

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Récupère un Pokémon et ses 5 premiers moves
 * @param {string} name - Nom du Pokémon (ex: "pikachu")
 * @returns {{ name: string, moves: string[] }}
 */
async function getPokemon(name) {
  const res = await axios.get(`${BASE_URL}/pokemon/${name}`);
  const moves = res.data.moves.slice(0, 5).map((m) => m.move.name);
  return {
    name: res.data.name,
    moves,
  };
}

/**
 * Récupère les détails d'un move (puissance, précision, PP)
 * @param {string} moveName - Nom du move (ex: "tackle")
 * @returns {{ name: string, power: number, accuracy: number, pp: number }}
 */
async function getMoveDetails(moveName) {
  try {
    const res = await axios.get(`${BASE_URL}/move/${moveName}`);
    return {
      name: moveName,
      power: res.data.power || 40,       // valeur par défaut si null
      accuracy: res.data.accuracy || 100, // valeur par défaut si null
      pp: res.data.pp || 10,
    };
  } catch {
    // En cas d'erreur sur un move, on retourne des valeurs par défaut
    return { name: moveName, power: 40, accuracy: 100, pp: 10 };
  }
}

module.exports = { getPokemon, getMoveDetails };