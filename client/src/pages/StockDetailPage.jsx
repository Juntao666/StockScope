import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Paper,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { CandlestickChart } from '../components/CandlestickChart';

const StockDetailPage = () => {
  // Mock stock data
  const stockInfo = {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: 178.52,
    priceChange: 2.34,
    priceChangePercent: 1.33,
    volume: 52847293,
    marketCap: '2.81T',
    peRatio: 29.45,
    dividendYield: 0.52,
  };

  // Mock candlestick data for the past 30 days
  const generateMockCandlestickData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    let basePrice = 170;

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Generate realistic OHLC data
      const open = basePrice + (Math.random() - 0.5) * 4;
      const close = open + (Math.random() - 0.5) * 6;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      const volume = Math.floor(50000000 + Math.random() * 30000000);

      data.push({
        time: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        volume,
      });

      // Gradually trend upward
      basePrice = close * 0.8 + basePrice * 0.2;
    }

    return data;
  };

  const [candlestickData] = useState(generateMockCandlestickData());

  const isPositive = stockInfo.priceChange >= 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {stockInfo.symbol}
          </Typography>
          <Chip
            label={stockInfo.companyName}
            variant="outlined"
            size="medium"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <Typography variant="h3" component="div" fontWeight="bold">
            ${stockInfo.currentPrice.toFixed(2)}
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
              {stockInfo.priceChange.toFixed(2)} ({isPositive ? '+' : ''}
              {stockInfo.priceChangePercent.toFixed(2)}%)
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 3,
          mb: 4,
          flexWrap: 'wrap',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            flex: '1 1 220px',
            minWidth: '220px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="medium">
            Volume
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            {(stockInfo.volume / 1000000).toFixed(2)}M
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            flex: '1 1 220px',
            minWidth: '220px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="medium">
            Market Cap
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            ${stockInfo.marketCap}
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            flex: '1 1 220px',
            minWidth: '220px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="medium">
            P/E Ratio
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            {stockInfo.peRatio}
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            flex: '1 1 220px',
            minWidth: '220px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="medium">
            Dividend Yield
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            {stockInfo.dividendYield}%
          </Typography>
        </Paper>
      </Box>

      {/* Candlestick Chart */}
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Price Chart (30 Days)
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

      {/* Additional Info Section */}
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
    </Container>
  );
};

export default StockDetailPage;
