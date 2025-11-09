const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const randomRoute = require('./randomRoute');
const topRoute = require('./topRoute');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/random', randomRoute.random);
app.get('/gain', topRoute.gain);
app.get('/decline', topRoute.decline);
app.get('/intervalCloseK',topRoute.intervalCloseK);
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
