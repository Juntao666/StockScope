import React, { useEffect, useState } from 'react';

const HomePage = () => {
    const [stocks, setStocks] = useState([]);

    return (
        <div>
            <h1>Top 10 Stocks with Highest Gains Today</h1>
            <ul>
                {stocks.map(stock => (
                    <li key={stock.symbol}>
                        {stock.name} ({stock.symbol}): {stock.gain}%
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;