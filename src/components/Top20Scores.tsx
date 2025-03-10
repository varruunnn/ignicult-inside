import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MenuIcon } from "lucide-react";
import LoadingScreen from "./LoadingScreen";
interface ScoreDetails {
  score: number;
  achievedBy: string;
  timeTaken: number;
  scorePerMinute: number;
  achievedAt: string;
  isValidated: boolean;
  cultixReward: number;
  validationDetails?: any;
}

interface GameStatistics {
  score: {
    mean: number;
    standardDeviation: number;
  };
  time: {
    mean: number;
    standardDeviation: number;
  };
  scorePerMinute: {
    mean: number;
    standardDeviation: number;
  };
}

interface TopValidScore {
  score: number;
  achievedBy: string;
  isValidated: boolean;
  cultixReward: number;
}

interface GameData {
  gameId: number;
  gameTitle: string;
  topValidScore: TopValidScore;
  statistics: GameStatistics;
  allScores: ScoreDetails[];
}

interface ApiResponse {
  message: string;
  data: GameData[];
}
const Menu: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuOptions = [
      { path: "/topgames", text: "Top Games" },
      { path: "/monthly-activity", text: "Monthly Activity" },
      { path: "/wallet-connected", text: "Wallet Connected" },
      { path: "/top-scorer", text: "Top Scorers" },
    ];
  
    const fadeIn = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    };
  
    return (
      <>
        <motion.button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="fixed top-7 left-4 z-50 p-3 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MenuIcon className="w-6 h-6 text-white" />
          )}
        </motion.button>
  
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="fixed inset-0 bg-black bg-opacity-90 z-40 flex flex-col items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div {...fadeIn} className="flex flex-col items-center">
                <img src="/blackLOgo.svg" alt="Logo" className="w-24 h-24" />
              </motion.div>
              <motion.div
                {...fadeIn}
                className="mt-8 flex flex-col md:flex-row gap-4"
              >
                {menuOptions.map((option, index) => (
                  <motion.div
                    key={option.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => {
                        navigate(option.path);
                        setMenuOpen(false);
                      }}
                      className="block px-6 py-3 border-[#FFB000] border-[0.5px] cursor-pointer bg-[#1D1D1D] rounded-xl transition-colors duration-300 hover:bg-gray-800 hover:text-black text-white"
                    >
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF0000] to-[#FFF600]">
                        {option.text}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </>
    );
  };
const Top20Scores: React.FC = () => {
  const [games, setGames] = useState<GameData[]>([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState<number>(0);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://ignicult.com/api/activity/top-scores");
        const json: ApiResponse = await res.json();
        if (json && json.data) {
          setGames(json.data);
        }
      } catch (error) {
        console.error("Error fetching top scores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <LoadingScreen loading={true} />
    );
  }

  if (games.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No data available.
      </div>
    );
  }

  const currentGame = games[selectedGameIndex];
  const sortedScores = [...(currentGame.allScores || [])].sort(
    (a, b) => b.score - a.score
  );
  const top20 = sortedScores.slice(0, 20);
  const selectedPlayer = top20[selectedPlayerIndex] || top20[0];
  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGameIndex(Number(e.target.value));
    setSelectedPlayerIndex(0); 
  };
  const handlePlayerClick = (index: number) => {
    setSelectedPlayerIndex(index);
  };

  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white p-4">
      <Menu />
      <div className="flex mt-[20px] items-center justify-between mb-4">
        <div className="flex items-center relative left-[60px] space-x-2">
          <label className="text-gray-300">Select Games</label>
          <select
            value={selectedGameIndex}
            onChange={handleGameChange}
            className="bg-[#404040] text-white px-2 py-1 rounded-xl outline-none"
          >
            {games.map((game, idx) => (
              <option key={game.gameId} value={idx}>
                {game.gameTitle}
              </option>
            ))}
          </select>
        </div>
        <h2 className="text-xl max-[460px]:hidden font-bold">Top 20 Scores</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-[#2A2A2A] rounded-lg p-4 w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-2">Achieved By</h3>
          <ul className="max-h-[70vh] overflow-y-auto space-y-1">
            {top20.map((player, index) => (
              <li
                key={player.achievedBy + index}
                onClick={() => handlePlayerClick(index)}
                className={`px-3 py-2 cursor-pointer rounded-md hover:bg-[#404040] transition-colors
                  ${
                    index === selectedPlayerIndex
                      ? "bg-[#505050] font-bold"
                      : "bg-transparent"
                  }
                `}
              >
                <span className="mr-2 text-amber-400">{index + 1}.</span>
                <span>
                  {player.achievedBy.length > 12
                    ? player.achievedBy.slice(0, 12) + "..."
                    : player.achievedBy}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-[#2f4829] via-[#455d28] to-[#536928]  p-4 rounded-lg flex flex-col justify-center">
            <h4 className="text-xl font-light">Top Score</h4>
            <h3 className="text-6xl font-mono font-bold truncate tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#89fc5f] to-[#edfa64]">
              {selectedPlayer.score.toLocaleString()}
            </h3>
          </div>
          <div className="bg-gradient-to-r from-[#2b3463] via-[#2a3c47] to-[#284034]  p-4 rounded-lg flex flex-col justify-center">
            <h4 className="text-lg font-light">Score per minute</h4>
            <h3 className="text-6xl font-mono font-bold truncate tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#89fc5f] to-[#edfa64]">
              {selectedPlayer.scorePerMinute.toFixed(2)}
            </h3>
          </div>
          <div className="bg-gradient-to-r from-[#2b3463] via-[#2a3c47] to-[#284034] p-4 rounded-lg flex flex-col justify-center">
            <h4 className="text-xl font-light">Mean Time</h4>
            <h3 className="text-6xl font-mono font-bold truncate tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#89fc5f] to-[#edfa64]">
              {selectedPlayer.timeTaken.toFixed(2)}
            </h3>
          </div>
          <div className="bg-gradient-to-r from-[#433d26] via-[#703421] to-[#713421] p-4 rounded-lg flex flex-col justify-center">
            <h4 className="text-xl font-light">Cultix Reward</h4>
            <h3 className="text-6xl font-mono font-bold truncate tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#89fc5f] to-[#edfa64]">
              {selectedPlayer.cultixReward}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top20Scores;
