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

interface MonthlyActivityData {
  totalTime: string;
  averageTimePerActivity: string;
  uniquePlayers: number;
  numberOfActivities: number;
  numberOfActivitiesPerPlayer: number;
  averageTimeSpentPerPlayer: string;
  dailyBreakdown: { date: string; totalMinutes: string; totalActivities: number }[];
}

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
                    className="relative cursor-pointer z-10 px-4 py-2"
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

const MonthlyActivity: React.FC = () => {
  const [data, setData] = useState<MonthlyActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState<string>("2");
  const [selectedYear, setSelectedYear] = useState<string>("2025");

  const fetchData = () => {
    setLoading(true);
    fetch(`https://ignicult.com/api/activity/totalMonthlyActivity/${selectedMonth}/${selectedYear}`)
      .then((res) => res.json())
      .then((data: MonthlyActivityData) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

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
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const getIcon = (title: string) => {
    switch (title) {
      case "Total Time":
        return <Clock className="w-6 h-6" />;
      case "Avg Time per Activity":
        return <BarChart2 className="w-6 h-6" />;
      case "Avg Time per Player":
        return <BarChart2 className="w-6 h-6" />;
      default:
        return <BarChart2 className="w-6 h-6" />;
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
      className="min-h-screen bg-[#1D1D1D] text-white p-8 w-full relative overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Menu />
      {loading ? (
        <motion.div
          className="flex flex-col items-center justify-center h-screen"
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
          {/* Header Section */}
          <motion.div className="text-center space-y-4 md:relative" variants={cardVariants}>
            <img src="/blackLOgo.svg" className="w-9 h-9 mx-auto md:absolute md:right-0 md:top-[-23%]" alt="Logo" />
            <motion.div
              className="inline-block relative backdrop-blur-sm p-6 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <h2 className="text-2xl text-white whitespace-nowrap md:absolute md:top-[-18%] md:left-[-13vw]">
                <Calendar className="w-7 inline mr-2" />
                Monthly Activity Dashboard
              </h2>
            </motion.div>
          </motion.div>
          <div className="w-full h-[1px] bg-amber-500 my-4 md:my-0"></div>
          {/* Selectors */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-[#404040] text-white rounded-full w-[13vw] p-2 text-sm"
            >
              {months.map((month) =>
                selectedYear === "2024" && parseInt(month.value) < 8 ? null : (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                )
              )}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#404040] text-white rounded-full w-[10vw] p-2 text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {/* Graph and Adjacent Card Container */}
          <div className="flex flex-col md:flex-row gap-6 h-[300px] mt-6">
            <motion.div
              variants={chartVariants}
              className="bg-gradient-to-tr from-[#284229] to-[#549c02d0] backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 w-full md:w-[70%] h-full"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-light mb-6 text-center">
                Daily Activity Trends
              </h3>
              <ResponsiveContainer width="100%" height="80%">
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
            </motion.div>
            {/* Adjacent Card for Total Time */}
            <div className="flex flex-col gap-6 w-full md:w-[30%] h-full">
              <motion.div
                variants={cardVariants}
                className="bg-gradient-to-tr from-[#023a10] to-[#1d745b] backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 flex-1"
                whileHover={{ y: -5 }}
                style={{
                  backgroundImage: 'url("/bg0.svg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="flex flex-col items-start h-full gap-3">
                  <h3 className="text-4xl font-light text-slate-100">Total Time</h3>
                </div>
                <p className="mt-4 text-center text-xl font-bold">
                  <CountUp target={parseFloat(data.totalTime.split(" ")[0])} duration={2000} format={(n) => n.toFixed(2)} /> hours
                </p>
              </motion.div>
            </div>
          </div>
          {/* Bottom Grid: Two Cards for Avg Time per Activity and Avg Time per Player */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <motion.div
              variants={cardVariants}
              className="flex flex-col items-center justify-center w-full backdrop-blur-sm rounded-xl p-6 h-40"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-slate-700 p-2 rounded-lg">
                  {getIcon("Avg Time per Activity")}
                </div>
                <h3 className="text-lg font-light text-slate-100">Avg Time per Activity</h3>
              </div>
              <p className="text-3xl font-bold">
                <CountUp target={parseFloat(data.averageTimePerActivity.split(" ")[0])} duration={2000} format={(n) => n.toFixed(2)} /> <span>minutes</span>
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              className="flex flex-col items-center justify-center w-full backdrop-blur-sm rounded-xl p-6 h-40"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-slate-700 p-2 rounded-lg">
                  {getIcon("Avg Time per Player")}
                </div>
                <h3 className="text-lg font-light text-slate-100">Avg Time per Player</h3>
              </div>
              <p className="text-3xl font-bold">
                <CountUp target={parseFloat(data.averageTimeSpentPerPlayer.split(" ")[0])} duration={2000} format={(n) => n.toFixed(2)} /> <span>minutes</span>
              </p>
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
