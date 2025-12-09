import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { indigo, amber } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import './App.css'

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SearchPage2 from './pages/SearchPage2';
import StockDetailPage from './pages/StockDetailPage';
import NewsImpactPage from './pages/NewsImpactPage';
import RandomStocksPage from './pages/RandomStocksPage';
import SentimentRankingPage from './pages/SentimentRankingPage';
import RevenueGrowthPage from './pages/RevenueGrowthPage';
import NewsVolumeSpikePage from './pages/NewsVolumeSpikePage';
import NegativeNewsImpactPage from './pages/NegativeNewsImpactPage';

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/page2" element={<SearchPage />} />
          <Route path="/page3" element={<SearchPage2 />} />
          <Route path="/stock-detail" element={<StockDetailPage />} />
          <Route path="/news-impact" element={<NewsImpactPage />} />
          <Route path="/random-stocks" element={<RandomStocksPage />} />
          <Route path="/sentiment-ranking" element={<SentimentRankingPage />} />
          <Route path="/revenue-growth" element={<RevenueGrowthPage />} />
          <Route path="/news-volume-spike" element={<NewsVolumeSpikePage />} />
          <Route path="/negative-news-impact" element={<NegativeNewsImpactPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
