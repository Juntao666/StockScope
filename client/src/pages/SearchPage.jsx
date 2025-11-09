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

  // Calculate default dates
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [companySymbol, setCompanySymbol] = useState('');
  const [startDate, setStartDate] = useState(formatDate(oneMonthAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // PLACEHOLDER: Replace this with actual API call to your backend
  const fetchStockData = async (symbol, start, end) => {
    // TODO: Replace with actual backend endpoint
    // Example: const response = await fetch(`http://your-backend-url/api/stocks/${symbol}?start=${start}&end=${end}`);

    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // PLACEHOLDER DATA - Replace with actual API response
    return {
      symbol: symbol.toUpperCase(),
      companyName: `${symbol.toUpperCase()} Inc.`,
      stockPrices: [
        { date: start, price: 150.25, volume: 1000000 },
        { date: end, price: 155.75, volume: 1200000 },
      ],
      sentimentScore: 0.72, // Score between -1 and 1
      earnings: {
        estimated: 2.45,
        actual: 2.50,
      },
      revenue: {
        estimated: 85.3, // in billions
        actual: 87.1,
      },
    };
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
          Search for a company's stock price, sentiment score, and financial estimates
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
              <Grid item xs={12} md={3.5}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Stock Price
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Starting Price:
                    </Typography>
                    <Typography variant="h5">
                      ${searchResults.stockPrices[0]?.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Ending Price:
                    </Typography>
                    <Typography variant="h5">
                      ${searchResults.stockPrices[searchResults.stockPrices.length - 1]?.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Sentiment Score */}
              <Grid item xs={12} md={3.5}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Sentiment Score
                  </Typography>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography
                      variant="h3"
                      color={searchResults.sentimentScore > 0 ? 'success.main' : 'error.main'}
                    >
                      {searchResults.sentimentScore.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Range: -1 (Negative) to +1 (Positive)
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Earnings & Revenue */}
              <Grid item xs={12} md={3.5}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Financial Estimates
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Earnings Per Share
                    </Typography>
                    <Typography variant="body2">
                      Estimated: ${searchResults.earnings.estimated}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Actual: ${searchResults.earnings.actual}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      Revenue (Billions)
                    </Typography>
                    <Typography variant="body2">
                      Estimated: ${searchResults.revenue.estimated}B
                    </Typography>
                    <Typography variant="body2">
                      Actual: ${searchResults.revenue.actual}B
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
