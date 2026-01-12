// src/pages/Home.tsx
import React from "react";
import logo from "./assets/logo.png";

interface Game {
  id: string;
  name: string;
  path: string;
}

const games: Game[] = [
  { id: "numbers", name: "Numbers", path: "/features/games/numbers" },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <img src={logo} alt="Logo Party Game" className="w-40 h-40 mb-6" />
      <h1 className="text-3xl font-bold mb-6">Welcome to mattoGames!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {games.map((game) => (
          <button
            key={game.id}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded"
            onClick={() => alert(`Pronti ${game.name}`)}
          >
            {game.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
