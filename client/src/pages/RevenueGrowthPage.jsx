import React, { useEffect, useState } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Chip,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import RefreshIcon from '@mui/icons-material/Refresh';
import config from '../config.json';

const RevenueGrowthPage = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [k, setK] = useState(15);
    const [error, setError] = useState('');

    const fetchRevenueGrowth = (topK = k) => {
        setLoading(true);
        setError('');
        
        fetch(`http://${config.server_host}:${config.server_port}/companies/top-revenue-growth?k=${topK}`)
            .then(res => res.json())
            .then(resJson => {
                if (resJson.error) {
                    setError(resJson.error);
                    setCompanies([]);
                } else {
                    setCompanies(resJson);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching revenue growth:', error);
                setError('Failed to fetch data. Please try again.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRevenueGrowth();
    }, []);

    const formatRevenue = (revenue) => {
        return `$${parseFloat(revenue).toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })}M`;
    };

    const formatPercentage = (percentage) => {
        return `${parseFloat(percentage).toFixed(2)}%`;
    };

    const getGrowthColor = (percentage) => {
        if (percentage >= 50) return '#2e7d32'; // Dark green
        if (percentage >= 30) return '#388e3c'; // Green
        if (percentage >= 20) return '#4caf50'; // Light green
        if (percentage >= 10) return '#66bb6a'; // Lighter green
        return '#81c784'; // Very light green
    };

    const handleSearch = () => {
        if (k > 0 && k <= 100) {
            fetchRevenueGrowth(k);
        }
    };

    return (
        <Container maxWidth="xl" style={{ marginTop: '30px', marginBottom: '30px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
                <Typography
                    variant="h4"
                    style={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                    }}
                >
                    📈 Top Revenue Growth Companies
                </Typography>
            </Box>
            
            <Typography variant="body1" color="textSecondary" gutterBottom style={{ marginBottom: '20px' }}>
                Companies with the highest year-over-year revenue growth
            </Typography>

            {/* Search Controls */}
            <Card elevation={3} style={{ marginBottom: '30px', padding: '15px' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Number of Companies (Top K)"
                                type="number"
                                value={k}
                                onChange={(e) => setK(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                fullWidth
                                inputProps={{ min: 1, max: 100 }}
                                helperText="Enter a number between 1 and 100"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<RefreshIcon />}
                                onClick={handleSearch}
                                disabled={loading}
                                style={{ height: '56px' }}
                            >
                                Load Data
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
                <Box marginBottom="20px">
                    <Typography color="error" variant="body1">
                        ⚠️ {error}
                    </Typography>
                </Box>
            )}

            {/* Loading Spinner */}
            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress size={60} />
                </Box>
            )}

            {/* Results Table */}
            {!loading && companies.length > 0 && (
                <>
                    <Box marginBottom="20px">
                        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                            Top {companies.length} Companies by Revenue Growth
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Financial Year: {companies[0]?.current_year || 'N/A'}
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell align="center"><strong>Rank</strong></TableCell>
                                    <TableCell><strong>Company</strong></TableCell>
                                    <TableCell><strong>Stock Code</strong></TableCell>
                                    <TableCell align="right"><strong>Current Revenue</strong></TableCell>
                                    <TableCell align="right"><strong>Previous Revenue</strong></TableCell>
                                    <TableCell align="center"><strong>Growth Rate</strong></TableCell>
                                    <TableCell align="right"><strong>Employees</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companies.map((company, index) => (
                                    <TableRow 
                                        key={company.code}
                                        hover
                                        style={{ 
                                            cursor: 'pointer',
                                            backgroundColor: index < 3 ? '#f9f9f9' : 'transparent',
                                        }}
                                    >
                                        <TableCell align="center">
                                            <Box
                                                style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 
                                                        index === 0 ? '#FFD700' : 
                                                        index === 1 ? '#C0C0C0' : 
                                                        index === 2 ? '#CD7F32' : '#e0e0e0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                    margin: '0 auto',
                                                    color: index < 3 ? 'white' : 'black',
                                                    boxShadow: index < 3 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <BusinessIcon style={{ marginRight: '8px', color: '#1976d2' }} />
                                                <Typography
                                                    variant="body1"
                                                    style={{
                                                        fontWeight: index < 3 ? 'bold' : 'normal',
                                                        fontSize: index < 3 ? '1rem' : '0.95rem',
                                                    }}
                                                >
                                                    {company.company_name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={company.code}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                style={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography style={{ fontWeight: '600', color: '#2e7d32' }}>
                                                {formatRevenue(company.current_revenue_millions)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography style={{ color: '#666' }}>
                                                {formatRevenue(company.prev_revenue_millions)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    backgroundColor: getGrowthColor(company.revenue_growth_pct),
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                }}
                                            >
                                                <TrendingUpIcon style={{ marginRight: '4px', fontSize: '1.2rem' }} />
                                                {formatPercentage(company.revenue_growth_pct)}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography style={{ color: '#666' }}>
                                                {company.full_time_employees?.toLocaleString('en-US') || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* No Results Message */}
            {!loading && companies.length === 0 && !error && (
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="300px"
                    marginTop="20px"
                >
                    <Typography variant="h6" color="textSecondary">
                        No revenue growth data available
                    </Typography>
                </Box>
            )}

            {/* Information Cards */}
            <Grid container spacing={3} marginTop="30px">
                <Grid item xs={12} md={6}>
                    <Card elevation={2} style={{ backgroundColor: '#e3f2fd', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
                                📊 About Revenue Growth
                            </Typography>
                            <Typography variant="body2" paragraph>
                                <strong>Revenue Growth Rate</strong> measures the percentage increase in a company's revenue from one year to the next.
                            </Typography>
                            <Typography variant="body2" paragraph>
                                <strong>Formula:</strong><br />
                                Growth % = ((Current Year Revenue - Previous Year Revenue) / Previous Year Revenue) × 100
                            </Typography>
                            <Typography variant="body2">
                                Higher growth rates typically indicate strong business performance and market demand.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card elevation={2} style={{ backgroundColor: '#f3e5f5', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                                💡 Key Insights
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • <strong>Top performers</strong> shown with medal rankings (🥇🥈🥉)
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • <strong>Revenue values</strong> displayed in millions of dollars
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • <strong>Growth colors</strong> indicate performance level:
                                <br />  - Dark Green: ≥50% growth
                                <br />  - Green: 30-50% growth
                                <br />  - Light Green: 10-30% growth
                            </Typography>
                            <Typography variant="body2">
                                • <strong>Employee count</strong> provides company size context
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Statistics Summary */}
            {!loading && companies.length > 0 && (
                <Box marginTop="30px">
                    <Card elevation={3} style={{ backgroundColor: '#fff3e0' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#e65100' }}>
                                📈 Summary Statistics
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" color="textSecondary">
                                        Highest Growth Rate
                                    </Typography>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                        {formatPercentage(companies[0]?.revenue_growth_pct || 0)}
                                    </Typography>
                                    <Typography variant="caption">
                                        {companies[0]?.company_name || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" color="textSecondary">
                                        Average Growth Rate
                                    </Typography>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                                        {formatPercentage(
                                            companies.reduce((sum, c) => sum + parseFloat(c.revenue_growth_pct), 0) / companies.length
                                        )}
                                    </Typography>
                                    <Typography variant="caption">
                                        Across top {companies.length} companies
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" color="textSecondary">
                                        Total Companies
                                    </Typography>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                                        {companies.length}
                                    </Typography>
                                    <Typography variant="caption">
                                        With positive growth
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Container>
    );
};

export default RevenueGrowthPage;
