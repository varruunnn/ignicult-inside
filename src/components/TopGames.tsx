import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  ArrowUp,
  Activity,
  Award,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen'; 

interface Game {
  gameId: number;
  title: string;
  completionRate: number;
  predictedScore: number;
}

const Menu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuOptions = [
    { path: '/topgames', text: 'Top Games' },
    { path: '/monthly-activity', text: 'Monthly Activity' },
    { path: '/wallet-connected', text: 'Wallet Connected' },
    { path: '/top-scorer', text: 'Top Scorers' },
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
        className="fixed top-15 left-4 z-50 p-3 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {menuOpen ? <X className="w-6 h-6 text-white" /> : <MenuIcon className="w-6 h-6 text-white" />}
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
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (value: number) => ({
      width: `${value * 100}%`,
      transition: { duration: 1.2, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      className="min-h-screen bg-[#1D1D1D] text-white p-8 relative overflow-x-hidden w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Menu />
      {loading ? (
        <LoadingScreen loading={loading} />
      ) : (
        <>
          <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-4">
            <div className="flex items-center relative left-[2vw] gap-2">
              <Gamepad2 className="w-9 h-9" />
              <h2 className="text-xl sm:text-2xl text-white whitespace-nowrap">
                Top Games Dashboard
              </h2>
            </div>
            <img src="/blackLOgo.svg" alt="Logo" className="w-12 sm:w-16 h-auto" />
          </header>
          <div className="w-full h-px bg-amber-500"></div>
          <AnimatePresence>
            {games.length > 0 && (
              <div className="grid gap-8 grid-cols-1 mt-[20px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {games.map((game) => (
                  <motion.div
                    key={game.gameId}
                    variants={cardVariants}
                    onHoverStart={() => setHoveredCard(game.gameId)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className="bg-[#2b2b2b] backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/50"
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
                      <motion.h3
                        className="text-xl font-semibold mb-4 flex items-center gap-2"
                        layout
                      >
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
                          <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-[#1FFF5B] to-[#FFF600] h-full rounded-full"
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
                          <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-[#1FFF5B] to-[#FFF600] h-full rounded-full"
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
        </>
      )}
    </motion.div>
  );
};

export default TopGames;
