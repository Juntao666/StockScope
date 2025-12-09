const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const randomRoute = require('./randomRoute');
const topRoute = require('./topRoute');
const certainCompany = require("./certainCompany");
const financeRoute = require("./financeRoute");
const newsRoute = require("./newsRoute");

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/random', randomRoute.random);//query 1 done
app.get('/gain', topRoute.gain);//query 2 done
app.get('/decline', topRoute.decline); //query 3 done
app.get('/intervalCloseK',topRoute.intervalCloseK); //query 4
app.get('/stocks/rankings/highest-sentiment',topRoute.intervalSentimentK);//query 11 Jack
app.get('/stocks/:code/prices', certainCompany.getStockPrices);//query 12 Jeff
app.get('/stocks/:code/sentiment',certainCompany.getStockSentiment);//query 13 Jeff
app.get('/companies/top-revenue-growth',financeRoute.getTopRevenueGrowth);//query 10 Jack
app.get('/stocks/news/3day-reaction',newsRoute.getBearishNewsAnd3DayImpact);//query 9 Jeff
app.get('/stocks/sentiment/trends',newsRoute.getSentimentTrend);//query 8 <Problmatic>
app.get('/stocks/news/volume-spike',newsRoute.getMajorNewsVolumeSpikes); //query 7 Jack
app.get('/stocks/news/negative-impact',newsRoute.getNegativeNewsWithPriceDrop);//query 6 Jack
app.get('/stocks/:code/financials',newsRoute.getCompanyFinancials);//query 5 Jeff


// app.get('/song/:song_id', routes.song);
// app.get('/album/:album_id', routes.album);
// app.get('/albums', routes.albums);
// app.get('/album_songs/:album_id', routes.album_songs);
// app.get('/top_songs', routes.top_songs);
// app.get('/top_albums', routes.top_albums);
// app.get('/search_songs', routes.search_songs);
// app.get('/playlist/entrance_songs', routes.entrance_songs);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
