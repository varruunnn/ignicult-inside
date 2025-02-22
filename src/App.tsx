import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TopGames from './components/TopGames';
import MonthlyActivity from './components/MonthlyActivity';
import WalletConnected from './components/WalletConnected';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/topgames" element={<TopGames />} />
        <Route path="/monthly-activity" element={<MonthlyActivity />} />
        <Route path="/wallet-connected" element={<WalletConnected />} />
      </Routes>
    </Router>
  );
}

export default App;
