import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const emotes: string[] = ["⚡", "🚀", "🔥", "💨", "⚡", "🚀"]; // Fast-changing emotes

interface LoadingScreenProps {
  loading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ loading }) => {
  const [currentEmote, setCurrentEmote] = useState<number>(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentEmote((prev) => (prev + 1) % emotes.length);
      }, 200); // Change emote every 200ms
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key={currentEmote}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-6xl"
          >
            {emotes[currentEmote]}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-xl font-semibold"
          >
            Loading.......
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;