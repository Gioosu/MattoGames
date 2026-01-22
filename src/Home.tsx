import logo from "./assets/logo.png";

interface Game {
  id: string;
  name: string;
}

const games: Game[] = [
  { id: "numbers", name: "Numbers" },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <img src={logo} alt="Logo Party Game" className="w-40 h-40" />

      <h1 className="text-3xl font-bold text-center">
        Welcome to MattoGames!
      </h1>

      <div className="flex flex-col gap-4">
        {games.map((game) => (
          <button
            key={game.id}
            className="w-64 bg-blue-500 hover:bg-blue-600 active:scale-95 transition text-white py-4 rounded-xl text-lg font-semibold shadow"
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
