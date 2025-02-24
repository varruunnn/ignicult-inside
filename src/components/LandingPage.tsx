import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  delay?: number;
  initialY?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, delay = 0, initialY = -20 }) => {
  const characters: string[] = text.split('');
  const [animatedText, setAnimatedText] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < characters.length) {
        setAnimatedText((prev) => prev + characters[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setAnimationComplete(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [characters]);

  return (
    <div style={{ display: 'inline-block', fontSize: '2.5rem', fontWeight: 500, fontFamily: 'inherit' }}>
      {characters.map((char, index) => (
        <AnimatePresence key={index} initial={false}>
          {animationComplete ? (
            <motion.span
              initial={{ opacity: 0, y: initialY }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: delay + index * 0.05 }}
            >
              {char}
            </motion.span>
          ) : (
            <span style={{ opacity: index < animatedText.length ? 1 : 0 }}>{characters[index]}</span>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
};

const LandingPage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white font-sans relative overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col mt-[-40px] items-center justify-center h-screen px-4 relative z-10"
      >
        <motion.img
          src="/blackLOgo.svg"
          className="w-[100px] h-[100px]"
          alt=""
          initial={{ scale: 0, y: 0 }}
          animate={{
            scale: 1,
            y: [0, -3, 0],
            transition: {
              scale: { duration: 1, ease: "easeInOut" },
              y: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }
            }
          }}
        />
        <AnimatedText text="Ignicult-Insight" initialY={-20} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <p className="text-gray-400 text-sm mb-1">"Ignicult Insights" is a dedicated platform providing real-time analytics and key performance metrics of Ignicult. Designed to attract investors, it showcases user engagement, game activity trends, and</p>
          <p className="text-gray-400 text-sm">
          economic data, offering transparency into the platform’s growth and impact.
          </p>
        </motion.div>
        {!showOptions && (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowOptions(true)}
            className="px-8 py-4 border-[0.5px] border-[#FFB000] bg-[#1D1D1D] cursor-pointer rounded-xl text-lg font-normal shadow-lg transition-colors duration-300 hover:bg-gray-700"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF0000] to-[#FFF600]">
              Show Data
            </span>
          </motion.button>
        )}

        <AnimatePresence>
          {showOptions && (
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-1 flex flex-col md:flex-row gap-4"
            >
              {[
                { path: "/topgames", text: "Top Games" },
                { path: "/monthly-activity", text: "Monthly Activity" },
                { path: "/wallet-connected", text: "Wallet Connected" }
              ].map((option, index) => (
                <motion.div
                  key={option.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => navigate(option.path)}
                    className="block px-6 py-3 border-[#FFB000] border-[0.5px] cursor-pointer bg-[#1D1D1D] rounded-xl transition-colors duration-300 hover:bg-gray-800 hover:text-black text-white no-underline"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF0000] to-[#FFF600]">
                      {option.text}
                    </span>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LandingPage;
