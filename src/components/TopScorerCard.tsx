import React, { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";


interface Props {
  achievedBy: string;
  topScore: number;
  gameTitle: string;
  scorePerMinute: number;
  meanTime: number;
  cultixReward: number;
  gameImage: string; 
}

const CountUp: React.FC<{ target: number; duration?: number; format?: (n: number) => string; }> = ({
  target,
  duration = 2,
  format = (n) => n.toFixed(0),
}) => {
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

const TopScorerCard: React.FC<Props> = ({
  achievedBy,
  topScore,
  gameTitle,
  scorePerMinute,
  meanTime,
  cultixReward,
  gameImage,
}) => {
  return (
    <motion.div
      className="min-h-screen flex mt-[60px] items-center justify-center bg-[#1D1D1D] p-4"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="grid grid-cols-2 gap-4 max-w-4xl w-full rounded-xl shadow-lg p-4 bg-[#1D1D1D]">
        <div className="rounded-lg p-4 flex w-[150%] flex-col justify-center bg-gradient-to-tr from-green-700 to-[#284229]">
          <p className="text-sm font-medium text-white opacity-90">Achieved By</p>
          <h2 className="text-2xl font-normal font-mono text-gray-300 mt-1 truncate">
            {achievedBy}
          </h2>
        </div>
        <div className="rounded-lg p-4 flex w-[50%] relative left-[50%] flex-col justify-center bg-gradient-to-tr from-green-700 to-[#284229]">
          <p className="text-sm font-medium text-white opacity-90">Top Score</p>
          <h2 className="text-2xl font-semibold font-mono text-gray-300 mt-1">
            <CountUp target={topScore} />
          </h2>
        </div>
        <div className="col-span-2 relative rounded-lg overflow-hidden flex items-center justify-center bg-neutral-800">
          <img
            src={gameImage}
            alt={gameTitle}
            className="w-full h-[300px] object-cover"
          />
          {/* <h2 className="absolute bottom-4 right-4 text-2xl font-bold text-lime-300 drop-shadow-md">
            {gameTitle}
          </h2> */}
        </div>
        <div className="rounded-lg p-4 flex flex-col items-center bg-gradient-to-tr from-green-700 to-[#2111FF]">
          <p className="text-sm font-medium text-white opacity-90">Score per minute</p>
          <h2 className="text-2xl font-semibold text-gray-300 font-mono mt-1">
            <CountUp target={scorePerMinute} duration={2} format={(n) => n.toFixed(2)} />
          </h2>
        </div>
        <div className="flex flex-row gap-4">
          <div className="rounded-lg p-4 flex flex-col items-center bg-gradient-to-tr from-[#3511FF] to-cyan-600 w-1/2">
            <p className="text-sm font-medium text-white opacity-90">Mean Time</p>
            <h2 className="text-2xl font-semibold text-gray-300 font-mono mt-1">
              <CountUp target={meanTime} duration={2} format={(n) => n.toFixed(2)} />
            </h2>
          </div>
          <div className="rounded-lg p-4 flex flex-col items-center bg-gradient-to-tr from-green-700 to-[#FF1911] w-1/2">
            <p className="text-sm font-medium text-white opacity-90">Cultix Reward</p>
            <h2 className="text-2xl font-semibold text-gray-300 font-mono mt-1">
              <CountUp target={cultixReward} />
            </h2>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopScorerCard;
