const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv').config({ path: `${__dirname}/../.env` })
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});