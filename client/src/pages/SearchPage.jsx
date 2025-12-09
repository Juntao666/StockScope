import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchPage = () => {
  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Use fixed 2024 dates since we have data until Dec 2024
  const [companySymbol, setCompanySymbol] = useState('');
  const [startDate, setStartDate] = useState('2024-11-09');
  const [endDate, setEndDate] = useState('2024-12-09');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const fetchStockData = async (symbol, start, end) => {
    const baseURL = 'http://localhost:8080';

    // Convert YYYY-MM-DD dates to timestamps (milliseconds)
    const startTimestamp = new Date(start).getTime();
    const endTimestamp = new Date(end).getTime();

    try {
      // Fetch stock prices and sentiment in parallel
      const [pricesResponse, sentimentResponse] = await Promise.all([
        fetch(`${baseURL}/stocks/${symbol}/prices?start=${startTimestamp}&end=${endTimestamp}`),
        fetch(`${baseURL}/stocks/${symbol}/sentiment?start=${startTimestamp}&end=${endTimestamp}`)
      ]);

      if (!pricesResponse.ok || !sentimentResponse.ok) {
        throw new Error('Failed to fetch data from backend');
      }

      const pricesData = await pricesResponse.json();
      const sentimentData = await sentimentResponse.json();

      // Transform the data to match the UI's expected format
      // Parse string values to numbers
      const parsedPrices = pricesData.map(item => ({
        date: item.date,
        open: parseFloat(item.open),
        close: parseFloat(item.close),
        high: parseFloat(item.high),
        low: parseFloat(item.low)
      }));

      return {
        symbol: symbol.toUpperCase(),
        companyName: `${symbol.toUpperCase()}`,
        stockPrices: parsedPrices,
        sentimentScore: parseFloat(sentimentData.sentiment_score) || 0,
        sentimentLevel: sentimentData.sentiment_level || 'N/A'
      };
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  };

  const handleSearch = async () => {
    // Validation
    if (!companySymbol.trim()) {
      setError('Please enter a company symbol');
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

    setError('');
    setLoading(true);
    setSearchResults(null);

    try {
      const data = await fetchStockData(companySymbol, startDate, endDate);
      setSearchResults(data);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stock Search
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search for a company's stock price and sentiment analysis
        </Typography>
      </Box>

      {/* Search Form */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Company Symbol"
                placeholder="e.g., AAPL, GOOGL"
                value={companySymbol}
                onChange={(e) => setCompanySymbol(e.target.value)}
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
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                onClick={handleSearch}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? 'Searching...' : 'Search'}
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

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardContent>
            {/* Company Info Header */}
            <Typography variant="h5" gutterBottom>
              {searchResults.companyName} ({searchResults.symbol})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Data from {startDate} to {endDate}
            </Typography>

            {/* Results Grid */}
            <Grid container spacing={4} justifyContent="space-evenly">
              {/* Stock Price */}
              <Grid item xs={12} md={5}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Stock Price
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Starting Price (Close):
                    </Typography>
                    <Typography variant="h5">
                      ${searchResults.stockPrices[searchResults.stockPrices.length - 1]?.close?.toFixed(2) || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Ending Price (Close):
                    </Typography>
                    <Typography variant="h5">
                      ${searchResults.stockPrices[0]?.close?.toFixed(2) || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Price Range:
                    </Typography>
                    <Typography variant="body1">
                      High: ${searchResults.stockPrices[0]?.high?.toFixed(2) || 'N/A'} /
                      Low: ${searchResults.stockPrices[0]?.low?.toFixed(2) || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Sentiment Score */}
              <Grid item xs={12} md={5}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Sentiment Analysis
                  </Typography>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography
                      variant="h3"
                      color={searchResults.sentimentScore > 0 ? 'success.main' : searchResults.sentimentScore < 0 ? 'error.main' : 'text.secondary'}
                    >
                      {searchResults.sentimentScore?.toFixed(2) || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Range: -1 (Negative) to +1 (Positive)
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }} color="primary">
                      {searchResults.sentimentLevel}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default SearchPage;
