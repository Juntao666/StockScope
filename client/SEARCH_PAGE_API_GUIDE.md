# Search Page API Integration Guide

This guide explains how to integrate the actual backend API with the SearchPage component.

## Current State

The SearchPage currently uses **placeholder data** in the `fetchStockData` function located at:
- **File**: `src/pages/SearchPage.jsx`
- **Function**: `fetchStockData` (lines ~23-46)

## How to Add Real API Integration

### Step 1: Locate the Placeholder Function

Find the `fetchStockData` function in `src/pages/SearchPage.jsx`:

```javascript
// PLACEHOLDER: Replace this with actual API call to your backend
const fetchStockData = async (symbol, start, end) => {
  // TODO: Replace with actual backend endpoint
  // ...placeholder code...
}
```

### Step 2: Replace with Your Backend API Call

Replace the placeholder function with your actual backend endpoint:

```javascript
const fetchStockData = async (symbol, start, end) => {
  try {
    // Replace with your actual backend URL
    const response = await fetch(
      `http://localhost:8000/api/stocks/${symbol}?startDate=${start}&endDate=${end}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
```

### Step 3: Expected Backend Response Format

Your backend API should return data in this format:

```javascript
{
  "symbol": "AAPL",
  "companyName": "Apple Inc.",
  "stockPrices": [
    {
      "date": "2024-01-01",
      "price": 150.25,
      "volume": 1000000
    },
    // ... more price data points
  ],
  "sentimentScore": 0.72,  // Between -1 and 1
  "earnings": {
    "estimated": 2.45,
    "actual": 2.50
  },
  "revenue": {
    "estimated": 85.3,  // in billions
    "actual": 87.1
  }
}
```

### Step 4: Environment Variables (Recommended)

For production, use environment variables for the API URL:

1. Create a `.env` file in the client directory:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

2. Update the fetch call:
```javascript
const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/stocks/${symbol}?startDate=${start}&endDate=${end}`
);
```

### Step 5: Error Handling

The component already handles errors, but you may want to customize error messages based on status codes:

```javascript
if (!response.ok) {
  if (response.status === 404) {
    throw new Error('Stock symbol not found');
  } else if (response.status === 500) {
    throw new Error('Server error. Please try again later.');
  }
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

## Alternative: Using Axios

If you prefer to use Axios instead of fetch:

### Installation
```bash
npm install axios
```

### Implementation
```javascript
import axios from 'axios';

const fetchStockData = async (symbol, start, end) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/stocks/${symbol}`,
      {
        params: {
          startDate: start,
          endDate: end,
        },
        headers: {
          // Add authentication headers if needed
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
```

## Backend Endpoint Checklist

Make sure your backend API endpoint:

- [ ] Accepts GET requests at `/api/stocks/:symbol`
- [ ] Accepts query parameters: `startDate` and `endDate`
- [ ] Returns JSON response in the expected format
- [ ] Handles CORS properly for development
- [ ] Validates date formats (YYYY-MM-DD)
- [ ] Returns appropriate HTTP status codes:
  - `200` for success
  - `404` for stock not found
  - `400` for invalid parameters
  - `500` for server errors

## Testing

After integrating the API:

1. Start your backend server
2. Start the frontend: `npm run dev`
3. Navigate to: http://localhost:5173/page2
4. Test with a known stock symbol (e.g., AAPL, GOOGL)
5. Verify data displays correctly
6. Test error cases (invalid symbol, invalid dates)

## Additional Features to Consider

- Add loading states for better UX
- Implement debouncing for search inputs
- Add autocomplete for company symbols
- Cache recent searches
- Add data visualization (charts/graphs)
- Export results to CSV/PDF

---

**Need Help?** If you encounter issues:
1. Check browser console for errors
2. Verify backend is running and accessible
3. Check CORS configuration
4. Verify API response format matches expected structure
