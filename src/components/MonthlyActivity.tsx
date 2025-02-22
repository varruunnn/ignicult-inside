import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Users,
  Activity,
  BarChart2,
  Calendar,
  Loader2,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
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
                    className="relative cursor-pointer z-10 px-4 py-2 text-white"
                    onClick={() => {
                      navigate(item.path);
                      setMenuOpen(false);
                    }}
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

interface DailyBreakdown {
  date: string;
  totalMinutes: string;
  totalActivities: number;
}

interface MonthlyActivityData {
  totalTime: string;
  averageTimePerActivity: string;
  uniquePlayers: number;
  numberOfActivities: number;
  numberOfActivitiesPerPlayer: number;
  averageTimeSpentPerPlayer: string;
  dailyBreakdown: DailyBreakdown[];
}

const MonthlyActivity: React.FC = () => {
  const [data, setData] = useState<MonthlyActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setHoveredCard] = useState<string | null>(null);
  const [displayedValues, setDisplayedValues] = useState<{ [key: string]: number }>({});

  const [selectedMonth, setSelectedMonth] = useState<string>("2");
  const [selectedYear, setSelectedYear] = useState<string>("2025");

  const fetchData = () => {
    setLoading(true);
    fetch(`https://ignicult.com/api/activity/totalMonthlyActivity/${selectedMonth}/${selectedYear}`)
      .then((res) => res.json())
      .then((data: MonthlyActivityData) => {
        setData(data);
        setLoading(false);
        animateNumbers(data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const animateNumbers = (data: MonthlyActivityData) => {
    const targets = {
      uniquePlayers: data.uniquePlayers,
      numberOfActivities: data.numberOfActivities,
      activitiesPerPlayer: data.numberOfActivitiesPerPlayer,
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const counts: { [key in keyof typeof targets]: number } = {
      uniquePlayers: 0,
      numberOfActivities: 0,
      activitiesPerPlayer: 0,
    };

    const timer = setInterval(() => {
      let completed = true;
      (Object.keys(targets) as (keyof typeof targets)[]).forEach((key) => {
        if (counts[key] < targets[key]) {
          counts[key] = Math.min(counts[key] + targets[key] / steps, targets[key]);
          completed = false;
        }
      });
      setDisplayedValues({ ...counts });
      if (completed) {
        clearInterval(timer);
      }
    }, stepDuration);
  };

  const transformedData = data?.dailyBreakdown.map((item) => ({
    date: item.date,
    totalMinutes: parseFloat(item.totalMinutes),
    totalActivities: item.totalActivities,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const getIcon = (title: string) => {
    switch (title) {
      case "Total Time": return <Clock className="w-6 h-6" />;
      case "Unique Players": return <Users className="w-6 h-6" />;
      case "# of Activities": return <Activity className="w-6 h-6" />;
      default: return <BarChart2 className="w-6 h-6" />;
    }
  };

  const months = [
    { value: "1", name: "January" },
    { value: "2", name: "February" },
    { value: "3", name: "March" },
    { value: "4", name: "April" },
    { value: "5", name: "May" },
    { value: "6", name: "June" },
    { value: "7", name: "July" },
    { value: "8", name: "August" },
    { value: "9", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
  ];

  const years = ["2024", "2025", "2026"];

  return (
    <motion.div
      className="min-h-screen bg-[#1D1D1D] text-white p-8 overflow-x-hidden w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Menu />
      {loading ? (
        <motion.div
          className="flex flex-col items-center justify-center h-96"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-slate-400" />
          </motion.div>
          <p className="mt-4 text-slate-400">Loading activity data...</p>
        </motion.div>
      ) : data ? (
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div className="text-center relative left-[-27%] space-y-4" variants={cardVariants}>
          <img src="/blackLOgo.svg" className="w-[50px] h-[50px] right-[-27%] absolute top-[-35%]" alt="" />
            <motion.div
              className="inline-block relative backdrop-blur-sm p-6 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              
              <h2 className="text-2xl absolute top-[-22%] left-[-13vw] font-normal text-white whitespace-nowrap">
              <Calendar className="w-7 absolute left-[-12%] top-[7%] h-7" />
                Monthly Activity Dashboard
              </h2>
             
            </motion.div>
          </motion.div>
          <div className="w-[98%] h-[1px] left-[1%] absolute bg-amber-500 top-[14%]"></div>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-[#404040] text-white rounded-4xl w-[13vw] absolute left-[5%] p-2 text-sm"
            >
              {months.map((month) =>
                (selectedYear === "2024" && parseInt(month.value) < 8)
                  ? null
                  : <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
              )}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#404040] text-white rounded-4xl w-[10vw] absolute left-[20%] p-2 text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-6 h-[350px] mt-[50px]">
            <motion.div
              variants={chartVariants}
              className="backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 w-full md:w-[70%] h-full"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-light mb-6 text-center text-white">
                Daily Activity Trends
              </h3>
              <ResponsiveContainer width="100%" height="70%">
                <LineChart data={transformedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(4px)',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line
                    type="monotone"
                    dataKey="totalMinutes"
                    name="Total Minutes"
                    stroke="#f87171"
                    strokeWidth={3}
                    dot={{ fill: '#f87171', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#f87171', strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalActivities"
                    name="Total Activities"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    dot={{ fill: '#fbbf24', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#fbbf24', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-xl font-bold text-red-500 mt-4">
                Total Time: {data.totalTime}
              </p>
            </motion.div>
            <div className="flex mt-[30px] flex-col gap-6 w-full md:w-[30%] h-[10vh]">
              <motion.div
                variants={cardVariants}
                className="bg-[#404040] backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 flex-1"
                whileHover={{ y: -5 }}
                onHoverStart={() => setHoveredCard('Avg Time per Activity')}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#404040] p-2 rounded-lg">
                    {getIcon('Avg Time per Activity')}
                  </div>
                  <h3 className="text-lg font-medium text-slate-100">
                    Avg Time per Activity
                  </h3>
                </div>
                <p className="text-3xl font-bold">
                  <span className="bg-gradient-to-r  from-[#FF0000]  to-[#FFF600] text-transparent bg-clip-text">
                    {data.averageTimePerActivity}
                  </span>
                </p>
              </motion.div>
              <motion.div
                variants={cardVariants}
                className="bg-[#404040] backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 flex-1"
                whileHover={{ y: -5 }}
                onHoverStart={() => setHoveredCard('Unique Players')}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#404040]p-2 rounded-lg">
                    {getIcon('Unique Players')}
                  </div>
                  <h3 className="text-lg font-medium text-slate-100">
                    Unique Players
                  </h3>
                </div>

                <p className="text-3xl font-bold">
                  <span className="bg-gradient-to-r  from-[#FF0000]  to-[#FFF600] text-transparent bg-clip-text">
                    {displayedValues.uniquePlayers?.toFixed(0) || '0'}  
                  </span>
                </p>
              </motion.div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-40 flex flex-col justify-center"
              onHoverStart={() => setHoveredCard('# of Activities')}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-slate-700 p-2 rounded-lg">
                  {getIcon('# of Activities')}
                </div>
                <h3 className="text-lg font-medium text-slate-300">Number of Activities</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {displayedValues.numberOfActivities?.toFixed(0) || '0'}
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-40 flex flex-col justify-center"
              onHoverStart={() => setHoveredCard('Activities per Player')}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-slate-700 p-2 rounded-lg">
                  {getIcon('Activities per Player')}
                </div>
                <h3 className="text-lg font-medium text-slate-300">Activities per Player</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {displayedValues.activitiesPerPlayer?.toFixed(2) || '0'}
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-40 flex flex-col justify-center"
              onHoverStart={() => setHoveredCard('Avg Time per Player')}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-slate-700 p-2 rounded-lg">
                  {getIcon('Avg Time per Player')}
                </div>
                <h3 className="text-lg font-medium text-slate-300">Avg Time per Player</h3>
              </div>
              <p className="text-3xl font-bold text-white">{data.averageTimeSpentPerPlayer}</p>
            </motion.div>
          </div>
        </div>
      ) : (
        <motion.div className="text-center text-xl text-red-400" variants={cardVariants}>
          Error fetching activity data
        </motion.div>
      )}
    </motion.div>
  );
};

export default MonthlyActivity;
