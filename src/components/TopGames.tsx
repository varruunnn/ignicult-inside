import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Activity,
  Award,
  Loader2,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Menu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Top Games", path: "/topgames" },
    { label: "Monthly Activity", path: "/monthly-activity" },
    { label: "Wallet Connected", path: "/wallet-connected" },
  ];

  return (
    <>
      <motion.button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="fixed top-4 left-4 z-50 p-3 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
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
            className="fixed inset-0 bg-black bg-opacity-90 z-40 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="space-y-6 text-2xl">
              {menuItems.map((item) => (
                <motion.li key={item.path} className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white opacity-0"
                    whileHover={{ opacity: 1, scale: 1.8 }}
                    transition={{ duration: 0.3 }}
                  />
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setMenuOpen(false);
                    }}
                    className="relative cursor-pointer z-10 px-4 py-2"
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

interface Game {
  gameId: number;
  title: string;
  completionRate: number;
  predictedScore: number;
}

const TopGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://ignicult.com/api/activity/top-games')
      .then((res) => res.json())
      .then((data: Game[]) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (value: number) => ({
      width: `${value * 100}%`,
      transition: { duration: 1.2, ease: "easeOut" },
    }),
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#1D1D1D] text-white p-8 relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {loading ? (
        <motion.div
          className="flex flex-col items-center justify-center h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div variants={loadingVariants} animate="animate">
            <Loader2 className="w-12 h-12 text-slate-400" />
          </motion.div>
          <p className="mt-4 text-slate-400">Loading games data...</p>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-12 relative">
          <Menu />
          <motion.div className="flex items-center justify-between mb-12" variants={cardVariants}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-6 rounded-2xl relative w-full h-full flex items-center"
            >
              <img src="/game.svg" className="w-9 top-[-11%] left-[4%] absolute h-9" alt="Game Icon" />
              <h2 className="text-2xl ml-2 relative top-[-2.7vw] left-[5%]">Top Games Dashboard</h2>
              <img src="/blackLOgo.svg" className="w-9 h-9 ml-auto relative top-[-2.2vw]" alt="Black Logo" />
            </motion.div>
          </motion.div>

          <div className="w-[100%] h-[1px] absolute bg-amber-500 top-[4.5%] left-[-10px]"></div>

          <AnimatePresence>
            {games.length > 0 && (
              <div className="grid gap-8 grid-cols-1 mt-[-20px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {games.map((game) => (
                  <motion.div
                    key={game.gameId}
                    variants={cardVariants}
                    onHoverStart={() => setHoveredCard(game.gameId)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/50"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <motion.img
                        src={`/${game.gameId}.svg`}
                        alt={game.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredCard === game.gameId ? 1 : 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"
                      />
                    </div>
                    <div className="p-6">
                      <motion.h3 className="text-xl font-semibold mb-4 flex items-center gap-2" layout>
                        <Award className="w-5 h-5 text-slate-300" />
                        {game.title}
                      </motion.h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-400 flex items-center gap-1">
                              <Activity className="w-4 h-4" />
                              Completion Rate
                            </span>
                            <span className="text-sm font-medium">
                              {(game.completionRate * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="bg-slate-700/50 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-[#FF0000] to-[#FFF600] h-full rounded-full"
                              custom={game.completionRate}
                              variants={progressVariants}
                              initial="hidden"
                              animate="visible"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-400 flex items-center gap-1">
                              <ArrowUp className="w-4 h-4" />
                              Predicted Score
                            </span>
                            <span className="text-sm font-medium">
                              {(game.predictedScore * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="bg-slate-700/50 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-[#FF0000] to-[#FFF600] h-full rounded-full"
                              custom={game.predictedScore}
                              variants={progressVariants}
                              initial="hidden"
                              animate="visible"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default TopGames;
