import React, { useEffect, useState } from "react";
import TopScorerCard from "./TopScorerCard";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

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
        className="fixed top-8 left-4 z-50 p-3 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
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
            <motion.div {...fadeIn} className="mt-8 flex flex-col md:flex-row gap-4">
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

interface ScoreStats {
  mean: number;
  standardDeviation: number;
}

interface Statistics {
  score: ScoreStats;
  time: ScoreStats;
  scorePerMinute: ScoreStats;
}

interface TopValidScore {
  score: number;
  achievedBy: string;
  isValidated: boolean;
  cultixReward: number;
}

interface TopScorer {
  gameId: number;
  gameTitle: string;
  topValidScore: TopValidScore;
  statistics: Statistics;
}

interface TopScorersResponse {
  data: TopScorer[];
}

const TopScorer: React.FC = () => {
  const [scorers, setScorers] = useState<TopScorer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetch("https://ignicult.com/api/activity/top-scores")
      .then((res) => res.json())
      .then((json: TopScorersResponse) => {
        setScorers(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching top scorers");
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % scorers.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + scorers.length) % scorers.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  if (loading) {
    return <LoadingScreen loading={loading} />;
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1D1D1D] text-red-500">
        {error}
      </div>
    );
  }
  if (scorers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1D1D1D] text-white">
        No data available.
      </div>
    );
  }

  const current = scorers[currentIndex];

  return (
    <div className="min-h-screen bg-[#1D1D1D] flex flex-col items-center justify-center relative">
      <Menu />
      <header className="w-full flex items-center justify-between px-4 py-4">
        <div className="flex relative left-[5vw] items-center gap-2">
          <img src="/hs.svg" alt="" className="w-6 h-6" />
          <h2 className="text-xl sm:text-2xl text-white whitespace-nowrap">
            Top Scorers Dashboard
          </h2>
        </div>
        <img src="/blackLOgo.svg" alt="Logo" className="w-12 sm:w-16 h-auto" />
      </header>
      <div className="w-full h-px bg-amber-500"></div>
      <button
        onClick={handlePrev}
        className="absolute left-4 z-10 p-2 text-white"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <div className="relative w-full mt-[-40px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="flex justify-center w-full"
          >
            <TopScorerCard
              achievedBy={current.topValidScore.achievedBy}
              topScore={current.topValidScore.score}
              gameTitle={current.gameTitle}
              scorePerMinute={current.statistics.scorePerMinute.mean}
              meanTime={current.statistics.time.mean}
              cultixReward={current.topValidScore.cultixReward}
              gameImage={`/${current.gameId}.svg`}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        onClick={handleNext}
        className="absolute right-4 z-10 p-2 text-white"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};

export default TopScorer;
