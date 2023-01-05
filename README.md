# BeetBox

A Discord bot that plays audio from YouTube and Spotify links, and searches for tracks by keyword.

## Prerequisites

- Node.js
- A Discord account and a Discord bot token
- A YouTube API key
- A Spotify API client ID and client secret

## Installation

1. Clone this repository
2. Run `npm install` to install the required dependencies
3. Replace 'YOUR_BOT_TOKEN_HERE' in `index.js` with your Discord bot token
4. Replace 'YOUR_YOUTUBE_API_KEY_HERE' in `services/youtube.js` with your YouTube API key
5. Replace 'YOUR_SPOTIFY_CLIENT_ID_HERE' and 'YOUR_SPOTIFY_CLIENT_SECRET_HERE' in `services/spotify.js` with your Spotify API client ID and client secret

## Usage

1. Run `node index.js` to start the bot
2. In a Discord channel, enter `!play <query>` to search for tracks by keyword or play a YouTube/Spotify link

## Commands

- `!play <query>`: Search for tracks by keyword or play a YouTube/Spotify link

## Roadmap

The following features are planned for future development:

- `!stop`: Stop playback and leave the voice channel
- `!skip`: Skip to the next track in the queue
- `!nowplaying`: Display the title and artist of the current track
- `!queue`: Display the list of tracks in the queue
- `!pause`: Pause playback
- `!resume`: Resume playback
- `!seek <time>`: Seek to a specific time within the current track
- `!search <query>`: Search for tracks and add them to the queue
- `!volume <level>`: Set the volume level for playback
- `!lyrics`: Display the lyrics of the current track
- `!playlist <name>`: Create and save a playlist of tracks
- Queue functionality: The ability to queue mixed playlists of Spotify and YouTube tracks

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.