import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Menu as MenuIcon, X, ChevronUp, Loader2 } from 'lucide-react';

const Menu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuOptions = [
    { path: '/topgames', text: 'Top Games' },
    { path: '/monthly-activity', text: 'Monthly Activity' },
    { path: '/wallet-connected', text: 'Wallet Connected' },
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
        className="fixed top-10 min-[2250px]:top-15 left-4 z-50 p-3 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
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
              <img src="/blackLOgo.svg" alt="Logo" className="w-36 h-36" />
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
                    className="block px-6 py-3 border border-[#FFB000] rounded-xl transition-colors duration-300 hover:bg-gray-800 hover:text-black text-white"
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

const Spinner: React.FC = () => {
  return (
    <motion.div
      className="w-24 h-24 rounded-full border-8 border-[#363030] border-t-[#8bf335]"
      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.5))' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

interface WalletData {
  count: number;
}

const WalletConnected: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    fetch('https://ignicult.com/api/web3-wallets/count')
      .then((res) => res.json())
      .then((data: WalletData) => {
        setWalletData(data);
        setLoading(false);
        animateNumber(data.count);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const animateNumber = (target: number) => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.ceil(current + target / steps);
      if (current >= target) {
        setDisplayCount(target);
        clearInterval(timer);
      } else {
        setDisplayCount(current);
      }
    }, stepDuration);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
  };

  const loadingVariants = {
    animate: { rotate: 360, transition: { duration: 1.5, repeat: Infinity, ease: 'linear' } },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#1D1D1D] text-white overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Menu />
      <header className="w-full">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex relative top-[1.8vw] max-[375px]:top-[-2vw] max-[375px]:left-[22vw]  left-[4vw] items-center gap-2 max-[1000px]:top-[3vw] max-[1000px]:left-[15vw] max-[468px]:left-[15vw] max-[468px]:top-[5vw] ">
            <Wallet className="w-7 h-7 text-white" />
            <h2 className="text-2xl font-light whitespace-nowrap max-[375px]:text-lg ">Wallets Connected</h2>
          </div>
          <img src="/blackLOgo.svg" alt="Logo" className="w-16 max-[375px]:left-[-40vw] max-[375px]:top-[12vw] max-[370px]:w-9  relative top-[1.5vw] h-16" />
        </div>
        <div className="w-full h-px relative top-[2.5vw] max-[375px]:mt-[30px] bg-amber-500" />
      </header>
      <div className="max-w-4xl mx-auto p-4 bg-[url('/walletss.svg')] rounded-4xl mt-[120px] bg-cover bg-center">
        {loading ? (
          <motion.div className="flex flex-col items-center justify-center h-96" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div variants={loadingVariants} animate="animate">
              <Loader2 className="w-12 h-12 text-blue-400" />
            </motion.div>
            <p className="mt-4 text-slate-400">Loading wallet data...</p>
          </motion.div>
        ) : walletData ? (
          <motion.div className="space-y-8">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div className="space-y-4" variants={itemVariants}>
                <h3 className="text-xl sm:text-3xl text-slate-300">Total Wallets</h3>
                <motion.div
                  className="text-5xl sm:text-8xl font-bold bg-gradient-to-r from-[#1FFF5B] to-[#FFF600] bg-clip-text text-transparent"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  {displayCount.toLocaleString()}
                </motion.div>
              </motion.div>
              <motion.div className="flex items-center justify-center" variants={itemVariants}>
                <Spinner />
              </motion.div>
            </motion.div>
            <motion.div className="mt-8 pt-4 border-t border-slate-700/50 text-center" variants={itemVariants}>
              <motion.div className="inline-flex items-center gap-2 text-slate-400 hover:scale-105" whileHover={{ scale: 1.05, color: '#60A5FA' }}>
                <ChevronUp className="w-4 h-4" />
                <span>Active and growing ecosystem</span>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div className="text-center text-xl text-red-400" variants={itemVariants}>
            Error fetching wallet data
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WalletConnected;
