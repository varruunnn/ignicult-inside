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

interface CountUpProps {
  target: number;
  duration?: number;
  format?: (n: number) => string;
}
const CountUp: React.FC<CountUpProps> = ({
  target,
  duration = 2000,
  format = (n) => n.toFixed(0),
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setCount(start);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration]);

  return <span>{format(count)}</span>;
};

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
        className="fixed top-12 left-4 z-50 p-3 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
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
                    className="block px-6 py-3  border-[#FFB000] border-[0.5px] cursor-pointer bg-[#1D1D1D] rounded-xl transition-colors duration-300 hover:bg-gray-800 hover:text-black text-white"
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
    </>);
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
  const [selectedMonth, setSelectedMonth] = useState<string>('2');
  const [selectedYear, setSelectedYear] = useState<string>('2025');

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
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const getIcon = (title: string) => {
    switch (title) {
      case 'Total Time':
        return <Clock className="w-6 h-6" />;
      case 'Unique Players':
        return <Users className="w-6 h-6" />;
      case 'Number of Activities':
        return <Activity className="w-6 h-6" />;
      case 'Avg Time per Activity':
        return <BarChart2 className="w-6 h-6" />;
      case 'Avg Time per Player':
        return <BarChart2 className="w-6 h-6" />;
      default:
        return <BarChart2 className="w-6 h-6" />;
    }
  };

  const months = [
    { value: '1', name: 'January' },
    { value: '2', name: 'February' },
    { value: '3', name: 'March' },
    { value: '4', name: 'April' },
    { value: '5', name: 'May' },
    { value: '6', name: 'June' },
    { value: '7', name: 'July' },
    { value: '8', name: 'August' },
    { value: '9', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' },
  ];
  const years = ['2024', '2025', '2026'];
  const renderMonth = (selectedYear: string, months: { value: string; name: string }[]) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; 
    const maxAllowed = (() => {
      if (selectedYear === '2024') return 12; 
      if (parseInt(selectedYear) === currentYear) return currentMonth;
      if (parseInt(selectedYear) > currentYear) return 0;
      return 12;
    })();
  
    return months.map((month) => {
      const disabled = selectedYear === '2024' ? month.value !== '12' : parseInt(month.value) > maxAllowed;
      return (
        <option key={month.value} value={month.value} disabled={disabled}>
          {month.name}
        </option>
      );
    });
  };

  const avgTimePerPlayerFormat = (n: number) => n.toFixed(2);
  return (
    <motion.div
      className="min-h-screen bg-[#1D1D1D] text-white p-4 sm:p-8 overflow-x-hidden w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >

      {loading ? (
        <motion.div className="flex flex-col items-center justify-center h-96" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
            <Loader2 className="w-12 h-12 text-slate-400" />
          </motion.div>
          <p className="mt-4 text-slate-400">Loading activity data...</p>
        </motion.div>
      ) : data ? (
        <div className="relative">
          <Menu />
          <header className="flex items-center justify-between px-4 py-2 pl-20">
            <h2 className="text-2xl max-[468px]:text-xl  text-white whitespace-nowrap flex max-[468px]:left-[-2vw] max-[468px]:relative max-[370px]:relative max-[376px]:left-[-8vw] max-[376px]:top-[-2vw] max-[376px]:text-lg items-center gap-2">
              <Calendar className="w-7 h-7" />
              Monthly Activity Dashboard
            </h2>
            <img src="/blackLOgo.svg" alt="Logo" className="w-16 max-[376px]:left-[-50vw] max-[468px]:w-12 max-[468px]:relative max-[468px]:top-[12vw] max-[468px]:left-[-40vw] h-auto " />
          </header>
          <div className="w-full h-px max-[468px]:mt-[70px] bg-amber-500"></div>

          <div className="flex flex-col sm:flex-row  items-start mt-[20px] w-[100%] justify-start gap-4 mb-6">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-[#404040] text-white rounded p-2 text-sm"
            >
              {renderMonth(selectedYear,months)}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#404040] text-white rounded p-2 text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <motion.div
              variants={chartVariants}
              className="bg-gradient-to-tr from-[#284229] to-[#549c02d0] backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-slate-700/50 w-full md:w-[70%] h-[300px] sm:h-[400px] md:h-[500px]"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-light mb-6 text-center">Daily Activity Trends</h3>
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
            <motion.div
              variants={cardVariants}
              className="bg-[url('/bg0.svg')] bg-cover bg-center backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 w-full md:w-[30%] flex flex-col items-center justify-center"
              whileHover={{ scale: 1.02 }}
            >
              <Clock className="w-9 h-9 relative top-[-2vw]" />
              <h3 className="text-4xl font-light text-slate-100 mb-2">Total Time</h3>
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#92FF00] to-[#7aee15]">
                <CountUp target={parseFloat(data.totalTime.split(' ')[0])} duration={2000} format={(n) => n.toFixed(2)} />
              </p>
              <p className="text-2xl font-light text-slate-100">hours</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <motion.div
              variants={cardVariants}
              className="bg-gradient-to-t from-[#0b8d0f] via-[#284229] to-[#052406] backdrop-blur-sm rounded-xl p-6 h-40 flex flex-col justify-center"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg">{getIcon('Activities per Player')}</div>
                <h3 className="text-lg font-light text-slate-100">Activities per Player</h3>
              </div>
              <p className="text-5xl mt-6 font-bold">
                <span className="bg-gradient-to-br from-[#92FF00] to-[#7aee15] text-transparent bg-clip-text">
                  <CountUp target={data.numberOfActivitiesPerPlayer || 0} duration={2000} format={(n) => n.toFixed(2)} />
                </span>
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              className="flex flex-col items-center justify-center w-full backdrop-blur-sm rounded-xl p-6 h-40"
              whileHover={{ y: -5 }}
              style={{
                backgroundImage: 'url(/bg3.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="flex items-start w-full gap-3">
                <div className="p-2 rounded-lg">{getIcon('Avg Time per Activity')}</div>
                <h3 className="text-lg font-light text-slate-100">Avg time per activity</h3>
              </div>
              <p className="text-3xl text-left w-full font-bold">
                <span className="bg-gradient-to-br text-5xl from-[#92FF00] to-[#7aee15] text-transparent bg-clip-text">
                  <CountUp target={parseFloat(data.averageTimePerActivity.split(' ')[0]) || 0} duration={2000} format={(n) => n.toFixed(2)} />
                </span>
                <p className="font-light text-xl">minutes</p>
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              className="flex flex-col items-center justify-center w-full backdrop-blur-sm rounded-xl p-6 h-40"
              whileHover={{ y: -5 }}
              style={{
                backgroundImage: 'url(/bg4.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="flex items-start w-full gap-3">
                <div className="p-2 rounded-lg">{getIcon('Number of Activities')}</div>
                <h3 className="text-lg font-light text-slate-100">Average Time Per Player</h3>
              </div>
              <p className="text-3xl text-left w-full font-bold">
                <span className="bg-gradient-to-br text-5xl from-[#92FF00] to-[#7aee15] text-transparent bg-clip-text">
                  <CountUp target={parseFloat(data.averageTimeSpentPerPlayer)} duration={780} format={avgTimePerPlayerFormat} />
                </span>
                <p className="font-light text-xl">minutes</p>
              </p>
            </motion.div>
          </div>
          {/* Second Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <motion.div
              variants={cardVariants}
              className="bg-[url('/bg3.svg')] bg-cover bg-center backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-40 flex flex-col justify-center"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">{getIcon('Unique Players')}</div>
                <h3 className="text-lg font-light text-slate-100">Unique Players</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                <span className="bg-gradient-to-br text-5xl from-[#92FF00] to-[#7aee15] text-transparent bg-clip-text">
                  <CountUp target={data.uniquePlayers} duration={2000} />
                </span>
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              className="bg-[url('/bg4.svg')] bg-cover bg-center backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-40 flex flex-col justify-center"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">{getIcon('Number of Activities')}</div>
                <h3 className="text-lg font-light text-slate-100">Number of Activities</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                <span className="bg-gradient-to-br from-[#92FF00] text-5xl to-[#7aee15] text-transparent bg-clip-text">
                  <CountUp target={data.numberOfActivities} duration={2000} />
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      ) : (
        <motion.div className="text-center text-xl text-red-400" variants={cardVariants}>
          Error fetching activity data
        </motion.div>
      )
      }
    </motion.div >

  );
};

export default MonthlyActivity;
