import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  X,
  Menu as MenuIcon,
  Trophy,
  Clock,
  Award,
  FileCheck,
} from "lucide-react";
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
  validationDetails?: {
    checks: {
      scoreWithinRange: boolean;
      timeWithinRange: boolean;
      rateWithinRange: boolean;
      scoreAchievable: boolean;
    };
    achievability: {
      maxAchievableScore: number;
      actualScore: number;
      requiredRate: number;
      maxReasonableRate: number;
    };
    explanation: string;
    [key: string]: any;
  };
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
        className="fixed top-7 left-4 z-50 p-3  rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
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
            <motion.div {...fadeIn} className="flex flex-col items-center
            ">
              <img src="/blackLOgo.svg" alt="Logo" className="w-24 h-24
              " />
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
  className?: string;
}> = ({
  target,
  duration = 2,
  format = (n) => n.toFixed(0),
  className = "",
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => format(latest));

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      type: "spring",
      stiffness: 50,
      damping: 15,
    });
    return () => controls.stop();
  }, [target, duration, count]);

  return (
    <motion.span className={`font-bold ${className}`}>{rounded}</motion.span>
  );
};

const ValidationBadge: React.FC<{ isValid: boolean }> = ({ isValid }) => {
  return (
    <motion.span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
        isValid
          ? "bg-gradient-to-r from-green-600 to-green-400 text-white"
          : "bg-gradient-to-r from-red-700 to-red-500 text-white"
      }`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 15,
      }}
    >
      {isValid ? "Validated" : "Not Validated"}
    </motion.span>
  );
};
const CustomGraphDot = (props: any) => {
  const { cx, cy, value, max } = props;
  if (value === max) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#FFB000"
        stroke="white"
        strokeWidth={2}
      />
    );
  }
  return <circle cx={cx} cy={cy} r={3} fill="#FFB000" />;
};
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#333] p-2 rounded-lg text-white text-sm">
        <p className="font-semibold">Percentile: {label.toFixed(0)}%</p>
        <p>
          Date: {new Date(payload[0].payload.achievedAt).toLocaleDateString()}
        </p>
        <p>Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
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
    return <LoadingScreen loading={true} />;
  }

  if (games.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold"
        >
          No data available.
        </motion.div>
      </div>
    );
  }

  const currentGame = games[selectedGameIndex];
  const sortedScores = [...(currentGame.allScores || [])].sort(
    (a, b) => b.score - a.score
  );
  const top20 = sortedScores.slice(0, 20);
  const selectedPlayer = top20[selectedPlayerIndex] || top20[0];
  const maxGraphScore = Math.max(...top20.map((p) => p.score));

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGameIndex(Number(e.target.value));
    setSelectedPlayerIndex(0);
  };

  const handlePlayerClick = (index: number) => {
    setSelectedPlayerIndex(index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1D1D1D] to-[#0D0D0D] text-white p-4">
      <Menu />
      <img
        src="/blackLOgo.svg"
        alt="Logo"
        className="w-12 h-12 relative right-[-95%]
        max-[468px]:right-[-86%]
        "
      />

      <motion.div
        className="relative mx-auto max-w-6xl mt-10 mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between backdrop-blur-lg bg-black/30 rounded-2xl p-4 border border-gray-800">
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ rotate: 10 }} className="hidden sm:block">
              <Trophy className="h-8 w-8 text-yellow-500" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-500">
                Top 20 Scores
              </h1>
              <p className="text-gray-400">{currentGame.gameTitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <label className="text-gray-300 font-medium">Game:</label>
            <motion.select
              value={selectedGameIndex}
              onChange={handleGameChange}
              className="w-64 cursor-pointer bg-[#2A2A2A] text-white px-4 py-2 rounded-xl outline-none border border-gray-700 shadow-lg bg-[url('/arrow-down.svg')] bg-no-repeat bg-right bg-opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {games.map((game, idx) => (
                <option key={game.gameId} value={idx}>
                  {game.gameTitle}
                </option>
              ))}
            </motion.select>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-gradient-to-b from-[#2A2A2A] to-[#222222] rounded-2xl overflow-hidden shadow-xl border border-gray-800">
            <div className="p-4 bg-gradient-to-r from-[#333333] to-[#2A2A2A] border-b border-gray-700">
              <h3 className="text-lg font-bold flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                <span>Leaderboard</span>
              </h3>
            </div>

            <ul
              className="max-h-[70vh] overflow-y-auto space-y-1 p-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#FFB000 #1D1D1D",
              }}
            >
              {top20.map((player, index) => (
                <motion.li
                  key={player.achievedBy + index}
                  onClick={() => handlePlayerClick(index)}
                  className={`
                    px-4 py-3 cursor-pointer rounded-xl transition-all flex items-center
                    ${
                      index === selectedPlayerIndex
                        ? "bg-gradient-to-r from-[#3D3D3D] to-[#2D2D2D] border-l-4 border-yellow-500 shadow-lg"
                        : "hover:bg-[#2D2D2D] border-l-4 border-transparent"
                    }
                  `}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                      index < 3
                        ? "bg-gradient-to-br from-yellow-500 to-amber-700"
                        : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`font-bold ${
                        index < 3 ? "text-black" : "text-gray-300"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="font-medium truncate w-32">
                      {player.achievedBy.length > 10
                        ? player.achievedBy.slice(0, 10) + "..."
                        : player.achievedBy}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center mt-1">
                      <span className="mr-2">
                        {player.score.toLocaleString()}
                      </span>
                      <ValidationBadge isValid={player.isValidated} />
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.div
            className="max-w-6xl mx-auto mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              Score History (Percentile)
            </h3>
            <div className="bg-[#2A2A2A] p-4 rounded-2xl shadow-lg">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={top20.map((player, index, arr) => ({
                    ...player,
                    percentile: 100 - (index / (arr.length - 1)) * 100,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis
                    dataKey="percentile"
                    reversed
                    tickFormatter={(val: number) => `${val.toFixed(0)}%`}
                    stroke="#fff"
                    label={{
                      value: "Percentile",
                      position: "insideBottom",
                      offset: -5,
                      fill: "#fff",
                      fontSize: 14,
                    }}
                  />
                  <YAxis
                    stroke="#fff"
                    label={{
                      value: "Score",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#fff",
                      fontSize: 14,
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#FFB000"
                    strokeWidth={2}
                    dot={<CustomGraphDot max={maxGraphScore} />}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-2 space-y-6"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] p-6 rounded-2xl shadow-lg border border-gray-800"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="mr-3"
              >
                <Trophy className="w-6 h-6 text-blue-400" />
              </motion.div>
              Player Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-900/30 p-2 rounded-lg">
                    <Award className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 ">Wallet ID</p>
                    <p className="font-mono text-white tracking-tight text-sm">{selectedPlayer.achievedBy}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:ml-[30px] max-[1555px]:ml-[50px]">
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-900/30 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Achieved At</p>
                    <p className="font-medium">
                      {formatDateTime(selectedPlayer.achievedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl shadow-lg border border-green-800"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2f4829]/90 via-[#455d28]/90 to-[#536928]/90 z-0"></div>

            <div className="absolute inset-0 z-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white/10"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, Math.random() * -50],
                    opacity: [0.2, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-3"
                >
                  <Trophy className="w-6 h-6 text-yellow-300" />
                </motion.div>
                Score Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl">
                    <p className="text-gray-200 text-sm mb-1">Score</p>
                    <div className="text-white text-3xl font-bold">
                      <CountUp
                        target={selectedPlayer.score}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl">
                    <p className="text-gray-200 text-sm mb-1">Time Taken</p>
                    <div className="text-white text-2xl font-bold">
                      <CountUp
                        target={selectedPlayer.timeTaken}
                        format={(n) => n.toFixed(2)}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500"
                      />
                      <span className="ml-1 text-blue-300 text-lg">
                        minutes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl">
                    <p className="text-gray-200 text-sm mb-1">
                      Score per Minute
                    </p>
                    <div className="text-white text-2xl font-bold">
                      <CountUp
                        target={selectedPlayer.scorePerMinute}
                        format={(n) => n.toFixed(2)}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500"
                      />
                    </div>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl">
                    <p className="text-gray-200 text-sm mb-1">Cultix Reward</p>
                    <div className="text-white text-2xl font-bold flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="mr-2"
                      >
                        <Award className="w-5 h-5 text-yellow-300" />
                      </motion.div>
                      <CountUp
                        target={selectedPlayer.cultixReward}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] p-6 rounded-2xl shadow-lg border border-gray-800"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="mr-3"
              >
                <FileCheck className="w-6 h-6 text-purple-400" />
              </motion.div>
              Validation Details
            </h3>

            <div className="mb-4 flex items-center">
              <div
                className={`text-lg font-bold mr-3 ${
                  selectedPlayer.isValidated ? "text-green-400" : "text-red-400"
                }`}
              >
                {selectedPlayer.isValidated ? "Validated" : "Not Validated"}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                }}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    selectedPlayer.isValidated ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {selectedPlayer.isValidated ? "✓" : "✗"}
                </div>
              </motion.div>
            </div>

            {selectedPlayer.validationDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#333333] p-4 rounded-xl">
                    <h4 className="font-semibold text-purple-300 mb-2">
                      Checks
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div
                          className={`h-4 w-4 rounded-full mr-2 ${
                            selectedPlayer.validationDetails.checks
                              .scoreWithinRange
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Score Within Range</span>
                      </li>
                      <li className="flex items-center">
                        <div
                          className={`h-4 w-4 rounded-full mr-2 ${
                            selectedPlayer.validationDetails.checks
                              .timeWithinRange
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Time Within Range</span>
                      </li>
                      <li className="flex items-center">
                        <div
                          className={`h-4 w-4 rounded-full mr-2 ${
                            selectedPlayer.validationDetails.checks
                              .rateWithinRange
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Rate Within Range</span>
                      </li>
                      <li className="flex items-center">
                        <div
                          className={`h-4 w-4 rounded-full mr-2 ${
                            selectedPlayer.validationDetails.checks
                              .scoreAchievable
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Score Achievable</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#333333] p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Achievability
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-400">Max Score:</span>
                        <span className="font-mono">
                          {
                            selectedPlayer.validationDetails.achievability
                              .maxAchievableScore
                          }
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Actual Score:</span>
                        <span className="font-mono">
                          {
                            selectedPlayer.validationDetails.achievability
                              .actualScore
                          }
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Required Rate:</span>
                        <span className="font-mono">
                          {
                            selectedPlayer.validationDetails.achievability
                              .requiredRate
                          }
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Max Rate:</span>
                        <span className="font-mono">
                          {
                            selectedPlayer.validationDetails.achievability
                              .maxReasonableRate
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#333333] p-4 rounded-xl mt-4">
                  <h4 className="font-semibold text-yellow-300 mb-2">
                    Explanation
                  </h4>
                  <p className="text-gray-300">
                    {selectedPlayer.validationDetails.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Top20Scores;
