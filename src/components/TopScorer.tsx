import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, animate } from "framer-motion";
import { X, MenuIcon } from "lucide-react";
import LoadingScreen from "./LoadingScreen";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
        className="fixed top-12 left-4 z-50 p-3 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
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

const CountUp: React.FC<{
  target: number;
  duration?: number;
  format?: (n: number) => string;
}> = ({ target, duration = 2, format = (n) => n.toFixed(0) }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
  }, [target, duration]);
  return <span>{format(value)}</span>;
};

const TopScorer: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          "https://ignicult.com/api/activity/top-scores"
        );
        const json: ApiResponse = await response.json();
        if (json && json.data) {
          setGames(json.data);
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };
    fetchScores();
  }, []);
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(event.target.value);
    setCurrentIndex(index);
  };

  if (!games || games.length === 0) {
    return <LoadingScreen loading={true} />;
  }

  const currentGame = games[currentIndex];
  const allScores = currentGame.allScores || [];
  const maxScore = Math.max(...allScores.map((s) => s.score));
  const formatDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
    });
  };
  const CustomDot = (props: any) => {
    const { cx, cy, value } = props;
    if (value === maxScore) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="red"
          stroke="white"
          strokeWidth={2}
        />
      );
    }
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#8884d8"
        stroke="white"
        strokeWidth={1}
      />
    );
  };
  const gameImageSrc = `/${currentGame.gameId}.svg`;

  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white p-4 flex flex-col space-y-4">
      <Menu />
      <header className="w-full flex items-center justify-between px-4 py-4">
        <div className="flex relative left-[5vw] items-center gap-2 max-[468px]:left-[15vw]">
          <img src="/hs.svg" alt="" className="w-6 h-6" />
          <h2 className="text-xl sm:text-2xl text-white whitespace-nowrap max-[362px]:text-[17px]">
            Top Scorers Dashboard
          </h2>
        </div>
        <img src="/blackLOgo.svg" alt="Logo" className="w-12 sm:w-16 h-auto" />
      </header>
      <div className="w-full h-px bg-amber-500"></div>

      <div className="flex mt-[20px] justify-between items-center">
        <div className="flex items-center space-x-2">
          <label className="text-gray-300">Select Games</label>
          <select
            value={currentIndex}
            onChange={handleSelectChange}
            className="bg-[#404040] text-white px-1 py-1 rounded-xl outline-none"
          >
            {games.map((game, index) => (
              <option key={game.gameId} value={index}>
                {game.gameTitle}
              </option>
            ))}
          </select>
        </div>
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/top-20-scores");
            }}
            className="text-yellow-400 underline hover:text-yellow-300"
          >
            View all Top 20 scores
          </a>
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <button
          onClick={handlePrev}
          className="absolute left-[30%] cursor-pointer z-10 text-4xl text-white hover:text-gray-300 transform -translate-y-1/2 top-1/2"
        >
          &lsaquo;
        </button>

        <div className="flex flex-col items-center">
          <img
            src={gameImageSrc}
            alt={currentGame.gameTitle}
            className="w-64 h-auto rounded-lg shadow-lg"
          />
        </div>
        <button
          onClick={handleNext}
          className="absolute right-[30%] cursor-pointer z-10 text-4xl text-white hover:text-gray-300 transform -translate-y-1/2 top-1/2"
        >
          &rsaquo;
        </button>
      </div>
      <div className="mx-4 md:ml-[190px] md:mr-[190px] md:mx-20 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r md:w-[142%] from-[#264733] via-[#1d6865] to-[#264733] p-4 rounded-lg shadow">
            <h4 className="text-sm font-light">Achieved By</h4>
            <h3 className="text-3xl font-mono font-bold truncate tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#89fc5f] to-[#edfa64]">
              {currentGame.topValidScore.achievedBy}
            </h3>
          </div>
          <div className="bg-gradient-to-r md:w-[60%] md:relative md:left-[40%]  from-[#2f4829] via-[#455d28] to-[#536928] p-4 rounded-lg shadow flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-light">Top Score</h4>
              <h3 className="text-4xl font-mono font-bold truncate tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#89fc5f] to-[#edfa64]">
                <CountUp target={currentGame.topValidScore.score} />
              </h3>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 self-start bg-transparent cursor-pointer text-white px-1 py-1 rounded hover:bg-white hover:text-black transition-colors"
            >
              More info
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="bg-gradient-to-r from-[#283f35] via-[#273661] to-[#262e81] p-4 rounded-lg shadow flex flex-col justify-center">
            <h4 className="text-sm font-light">Score per minute</h4>
            <h3 className="text-4xl font-mono font-bold truncate tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#89fc5f] to-[#edfa64]">
              <CountUp target={currentGame.statistics.scorePerMinute.mean} />
            </h3>
          </div>
          <div className="bg-gradient-to-r from-[#2b3463] via-[#2a3c47] to-[#284034] p-4 rounded-lg shadow flex flex-col justify-center">
            <h4 className="text-sm font-light">Mean Time</h4>
            <h3 className="text-4xl font-mono font-bold truncate tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#89fc5f] to-[#edfa64]">
              <CountUp target={currentGame.statistics.time.mean} />
            </h3>
          </div>
          <div className="bg-gradient-to-r from-[#433d26] via-[#703421] to-[#713421] p-4 rounded-lg shadow flex flex-col justify-center">
            <h4 className="text-sm font-light">Cultix Reward</h4>
            <h3 className="text-4xl font-mono font-bold truncate tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#89fc5f] to-[#edfa64]">
              <CountUp target={currentGame.topValidScore.cultixReward} />
            </h3>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-gray-900 p-4 rounded-lg max-w-3xl w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 cursor-pointer text-white border border-white rounded px-2 py-1 hover:bg-white hover:text-black transition-colors"
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-4">
              Score History - {currentGame.gameTitle}
            </h2>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={allScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis
                    dataKey="achievedAt"
                    tickFormatter={(val) => formatDate(val)}
                    stroke="#fff"
                  />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    labelFormatter={(label) => `Date: ${formatDate(label)}`}
                    formatter={(value, name) => [
                      value,
                      name === "score" ? "Score" : name,
                    ]}
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={<CustomDot />}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopScorer;
