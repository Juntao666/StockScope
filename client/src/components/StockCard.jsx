import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

/**
 * StockCard - A reusable card component for displaying stock information
 *
 * This component displays a stock's ranking, symbol, name, and a metric value
 * with color-coded visualization. The card has hover effects and a fixed width
 * of 250px for consistent layout in flex/grid containers.
 *
 * @component
 * @example
 * // Basic usage:
 * <StockCard
 *   stock={{ symbol: 'AAPL', name: 'Apple Inc.', priceIncrease: 5.2 }}
 *   index={0}
 *   metric="priceIncrease"
 *   formatMetricValue={(value, type) => `+${value.toFixed(2)}%`}
 *   getMetricColor={(value, type) => value > 0 ? 'success.main' : 'error.main'}
 * />
 *
 * @param {Object} props - Component props
 * @param {Object} props.stock - Stock data object containing symbol, name, and metric values
 * @param {string} props.stock.symbol - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
 * @param {string} props.stock.name - Full company name
 * @param {number} props.stock[metric] - The metric value to display (e.g., priceIncrease, currentPrice)
 * @param {number} props.index - The ranking position of the stock (0-based, will display as #1, #2, etc.)
 * @param {string} props.metric - The key of the metric to display from the stock object
 * @param {Function} props.formatMetricValue - Function to format the metric value for display
 *   @param {number} value - The raw metric value
 *   @param {string} metricType - The type of metric being formatted
 *   @returns {string} Formatted string for display (e.g., "+5.2%", "$150.00")
 * @param {Function} props.getMetricColor - Function to determine the color based on metric value
 *   @param {number} value - The metric value
 *   @param {string} metricType - The type of metric
 *   @returns {string} Material-UI color string (e.g., 'success.main', 'error.main')
 *
 * @returns {JSX.Element} A Material-UI Card component with stock information
 */
const StockCard = ({ stock, index, metric, formatMetricValue, getMetricColor }) => {
  return (
    <Card
      sx={{
        // Fixed width ensures consistent card sizes in flex layout
        width: 250,
        minWidth: 250,
        maxWidth: 250,
        // Smooth hover animation
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        {/* Ranking badge with icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            #{index + 1}
          </Typography>
        </Box>

        {/* Stock ticker symbol */}
        <Typography variant="h6" gutterBottom>
          {stock.symbol}
        </Typography>

        {/* Company full name */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {stock.name}
        </Typography>

        {/* Metric value with dynamic color and formatting */}
        <Typography
          variant="h5"
          color={getMetricColor(stock[metric], metric)}
          sx={{ fontWeight: 'bold' }}
        >
          {formatMetricValue(stock[metric], metric)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StockCard;
