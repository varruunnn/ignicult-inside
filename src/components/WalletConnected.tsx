import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Menu as MenuIcon, X, ChevronUp, Users, Loader2 } from 'lucide-react';


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
        className="fixed top-4 left-4 z-50 p-3 rounded-full cursor-pointer  hover:bg-slate-700 transition-colors"
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
      current = Math.ceil(current + (target / steps));
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white p-8"
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
            <motion.div
              className="text-center space-y-4"
              variants={itemVariants}
            >
              <motion.div
                className="inline-block w-[25vw] bg-slate-800/50 backdrop-blur-sm p-4  rounded-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Wallet className="w-8 h-8 top-[28%] absolute" />
                <h2 className="text-3xl ml-[50px] bg-gradient-to-r font-light from-gray-400 to-gray-300 bg-clip-text text-transparent flex items-center gap-3">
                  
                  Wallets Connected
                </h2>
              </motion.div>
            </motion.div>

            <motion.div
              className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-slate-700/50"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  className="space-y-6"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl text-slate-300">Total Wallets</h3>
                  </div>
                  <motion.div
                    className="text-7xl font-bold bg-gradient-to-r  from-gray-400 to-gray-300 bg-clip-text text-transparent"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {displayCount.toLocaleString()}
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex items-center justify-center"
                  variants={itemVariants}
                >
                  <motion.div
                    className="relative w-32 h-32"
                    animate={{
                      rotate: 360
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-blue-400 rounded-full"
                        style={{
                          top: `${Math.sin(i * (Math.PI / 4)) * 60 + 60}px`,
                          left: `${Math.cos(i * (Math.PI / 4)) * 60 + 60}px`,
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                className="mt-8 pt-8 border-t border-slate-700/50 text-center"
                variants={itemVariants}
              >
                <motion.div
                  className="inline-flex items-center gap-2 text-slate-400"
                  whileHover={{ scale: 1.05, color: "#60A5FA" }}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Active and growing ecosystem</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center text-xl text-red-400"
            variants={itemVariants}
          >
            Error fetching wallet data
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WalletConnected;