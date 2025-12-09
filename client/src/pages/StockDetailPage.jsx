import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SearchIcon from '@mui/icons-material/Search';
import { CandlestickChart } from '../components/CandlestickChart';

const StockDetailPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // State - use fixed 2024 dates since we have data until Dec 2024
  const [inputSymbol, setInputSymbol] = useState(searchParams.get('symbol') || '');
  const [symbol, setSymbol] = useState('');
  const [startDate, setStartDate] = useState('2024-11-09');
  const [endDate, setEndDate] = useState('2024-12-09');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stockData, setStockData] = useState(null);
  const [candlestickData, setCandlestickData] = useState([]);

  // Load data from URL parameter on mount
  useEffect(() => {
    const urlSymbol = searchParams.get('symbol');
    if (urlSymbol) {
      setSymbol(urlSymbol);
      setInputSymbol(urlSymbol);
      fetchStockData(urlSymbol, startDate, endDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch stock data from backend
  const fetchStockData = async (stockSymbol, start, end) => {
    const baseURL = 'http://localhost:8080';
    const startTimestamp = new Date(start).getTime();
    const endTimestamp = new Date(end).getTime();

    const url = `${baseURL}/stocks/${stockSymbol}/prices?start=${startTimestamp}&end=${endTimestamp}`;
    console.log('Fetching from URL:', url);
    console.log('Stock Symbol:', stockSymbol);
    console.log('Date Range:', start, 'to', end);
    console.log('Timestamps:', startTimestamp, 'to', endTimestamp);

    setLoading(true);
    setError('');

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json();

      console.log('Received data from backend:', data);
      console.log('Data length:', data?.length);

      if (!data || data.length === 0) {
        setError(`No data found for symbol "${stockSymbol}"`);
        setStockData(null);
        setCandlestickData([]);
        return;
      }

      // Sort data by date ascending (for chart)
      const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

      // Transform data for candlestick chart
      const chartData = sortedData.map(item => ({
        time: item.date,
        open: parseFloat(item.open),
        close: parseFloat(item.close),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
      }));

      // Calculate current price and price change
      const latestData = sortedData[sortedData.length - 1];
      const previousData = sortedData[sortedData.length - 2];
      const currentPrice = parseFloat(latestData.close);
      const previousPrice = previousData ? parseFloat(previousData.close) : currentPrice;
      const priceChange = previousData ? currentPrice - previousPrice : 0;
      const priceChangePercent = previousData ? (priceChange / previousPrice) * 100 : 0;

      setStockData({
        symbol: stockSymbol.toUpperCase(),
        currentPrice,
        priceChange,
        priceChangePercent,
        dataPoints: sortedData.length,
      });

      setCandlestickData(chartData);
    } catch (err) {
      setError('Failed to load stock data. Please try again.');
      console.error('Error fetching stock data:', err);
      setStockData(null);
      setCandlestickData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!inputSymbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }

    setSymbol(inputSymbol.toUpperCase());
    setSearchParams({ symbol: inputSymbol.toUpperCase() });
    fetchStockData(inputSymbol, startDate, endDate);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isPositive = stockData ? stockData.priceChange >= 0 : true;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Title */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stock Detail & Chart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View detailed stock price chart with candlestick visualization
        </Typography>
      </Box>

      {/* Search Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Stock Symbol"
                placeholder="e.g., AAPL"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                onClick={handleSearch}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? 'Loading...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stock Info Header - Only show if we have data */}
      {stockData && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {stockData.symbol}
            </Typography>
            <Chip
              label={`${stockData.dataPoints} data points`}
              variant="outlined"
              size="medium"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <Typography variant="h3" component="div" fontWeight="bold">
              ${stockData.currentPrice.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isPositive ? (
                <TrendingUpIcon color="success" />
              ) : (
                <TrendingDownIcon color="error" />
              )}
              <Typography
                variant="h6"
                color={isPositive ? 'success.main' : 'error.main'}
                fontWeight="medium"
              >
                {isPositive ? '+' : ''}
                {stockData.priceChange.toFixed(2)} ({isPositive ? '+' : ''}
                {stockData.priceChangePercent.toFixed(2)}%)
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Period: {startDate} to {endDate}
          </Typography>
        </Box>
      )}

      {/* Candlestick Chart - Only show if we have data */}
      {stockData && candlestickData.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Price Chart
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interactive candlestick chart showing daily price movements
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              overflowX: 'auto'
            }}>
              <CandlestickChart
                data={candlestickData}
                width={900}
                height={400}
                padding={50}
                bullishColor="rgb(34, 197, 94)"
                bearishColor="rgb(239, 68, 68)"
                showGrid={true}
                showPriceLabels={true}
                candleWidthRatio={0.7}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* No Data Message */}
      {!loading && !stockData && !error && (
        <Alert severity="info">
          Enter a stock symbol and date range to view the candlestick chart.
        </Alert>
      )}

      {/* Chart Legend - Only show if we have data */}
      {stockData && candlestickData.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Chart Legend
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: 'rgb(34, 197, 94)',
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Green Candle:</strong> Closing price higher than opening price (Bullish)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: 'rgb(239, 68, 68)',
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Red Candle:</strong> Closing price lower than opening price (Bearish)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Candle Components:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Body: Shows opening and closing prices
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Upper Wick: Shows the highest price
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Lower Wick: Shows the lowest price
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default StockDetailPage;
