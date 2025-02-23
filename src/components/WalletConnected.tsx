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
        className="fixed top-4 left-4 z-50 p-3 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {menuOpen ? <X className="w-6 h-6 text-white" /> : <MenuIcon className="w-6 h-6 text-white" />}
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="fixed inset-0 bg-black bg-opacity-90 z-40 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div {...fadeIn} className="flex flex-col items-center">
              <motion.img src="/blackLOgo.svg" alt="Logo" className="w-[150px] h-[150px] relative left-[-1vw]" />
            </motion.div>
            <motion.div {...fadeIn} className="mt-8 flex md:flex-row flex-col gap-4">
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
                    className="block px-6 py-3  border-[#FFB000] border-[0.5px] cursor-pointer bg-[#1D1D1D] rounded-xl transition-colors duration-300 hover:bg-gray-800 hover:text-black text-white no-underline"
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

interface WalletData {
  count: number;
}

const Spinner = () => {
  return (
    <motion.div 
      className="w-[100px] h-[100px] relative top-[2vw] right-[-8vw] rounded-full border-10 border-[#363030] border-t-[#8bf335]"
      style={{
        filter: 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.5))',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};



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
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#1D1D1D] text-white p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Menu />

      <div className="max-w-4xl mx-auto">
        {loading ? (
          <motion.div
            className="flex flex-col items-center justify-center h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div variants={loadingVariants} animate="animate">
              <Loader2 className="w-12 h-12 text-blue-400" />
            </motion.div>
            <p className="mt-4 text-slate-400">Loading wallet data...</p>
          </motion.div>
        ) : walletData ? (
          <motion.div className="space-y-8">
            <motion.div className="text-center space-y-4" variants={itemVariants}>
              <motion.div
                className="inline-block p-4 rounded-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <h2 className="text-[23px] ml-[-40px] absolute max-[468px]:left-[50vw] max-[468px]:text-sm top-[3.6%] left-[10%] flex items-center gap-3">
                  <Wallet className="w-5 h-5 max-[480px]:hidden" />
                  Wallets Connected
                </h2>
                <img src="/blackLOgo.svg" className="w-9 h-9 right-[2%] absolute top-[3.5%]" alt="" />
              </motion.div>

              <div className="w-[98%] h-[1px] left-[1%] absolute bg-amber-500 top-[14%]"></div>
            </motion.div>

            <motion.div
              className="bg-[url('/walletss.svg')] mt-[80px] bg-cover bg-center backdrop-blur-sm rounded-3xl p-12 shadow-xl"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div className="space-y-6" variants={itemVariants}>
                  <div className="flex items-center relative">
                    <h3 className="text-3xl relative top-[2vw] text-slate-300">Total Wallets</h3>
                  </div>
                  <motion.div
                    className="text-8xl font-bold bg-gradient-to-r from-[#1FFF5B] to-[#FFF600] bg-clip-text text-transparent"
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
              </div>

              <motion.div
                className="mt-8 pt-8 border-t border-slate-700/50 text-center"
                variants={itemVariants}
              >
                <motion.div className="inline-flex items-center gap-2 text-slate-400" whileHover={{ scale: 1.05, color: "#60A5FA" }}>
                  <ChevronUp className="w-4 h-4" />
                  <span>Active and growing ecosystem</span>
                </motion.div>
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
