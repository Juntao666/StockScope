# StockScope

A comprehensive stock market analysis platform that provides real-time stock data visualization, company financial information, and market news sentiment analysis for S&P 500 companies.

## 📖 Project Description

StockScope is a full-stack web application designed to help investors and traders make informed decisions by providing:

- **Real-time Stock Data**: Interactive candlestick charts and price tracking
- **Company Information**: Detailed financial metrics and company profiles for S&P 500 stocks
- **News Sentiment Analysis**: Aggregated news with sentiment scores to gauge market sentiment
- **Search Functionality**: Quick search and discovery of stocks
- **Top Performers**: View top-performing stocks in the market

### Tech Stack

**Frontend (Client):**

- React 19 with Vite
- Material-UI (MUI) for UI components
- React Router for navigation

**Backend (Server):**

- Node.js with Express
- PostgreSQL/SQLite for data storage
- RESTful API architecture

**Data Processing (ETL):**

- Python with Jupyter Notebooks
- yfinance API for financial data
- News sentiment analysis

## 🚀 How to Run Locally

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Juntao666/StockScope.git
cd StockScope
```

#### 2. Set Up the Server (Backend)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure database connection (if needed)
# Edit config.json with your database credentials

# Start the server
npm start
```

The server will run on `http://localhost:8000` (or the port specified in your configuration).

#### 3. Set Up the Client (Frontend)

Open a new terminal window/tab:

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Configure API endpoint (if needed)
# Edit src/config.json to match your server URL

# Start the development server
npm run dev
```

The client application will run on `http://localhost:5173` (default Vite port).

#### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

### Running Both Services Simultaneously

For convenience, you can run both server and client in separate terminal windows:

**Terminal 1 (Server):**

```bash
cd server && npm start
```

**Terminal 2 (Client):**

```bash
cd client && npm run dev
```

## 📁 Project Structure

```
StockScope/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── data/        # Mock data
│   │   └── config.json  # Client configuration
│   └── package.json
│
├── server/              # Backend Express server
│   ├── routes.js        # API route definitions
│   ├── server.js        # Server entry point
│   ├── config.json      # Server configuration
│   └── package.json
│
└── etl/                 # Data processing scripts
    ├── yfinance_api.ipynb
    └── company_income.ipynb
```

## 🔧 Available Scripts

### Client (Frontend)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server (Backend)

- `npm start` - Start the server

## 📊 Features

- **Home Page**: Overview of market trends and featured stocks
- **Search Page**: Search and filter S&P 500 companies
- **Stock Detail Page**: Detailed view with candlestick charts and financial metrics
- **News Integration**: Latest news with sentiment analysis
- **Responsive Design**: Works on desktop and mobile devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👥 Authors

**江北男人** - _Initial work_

---

> _"滚滚长江东逝水，浪花淘尽英雄。"_
