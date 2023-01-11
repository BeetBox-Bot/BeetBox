# BeetBox

A Discord bot that plays audio from YouTube URLs and Youtube query searches. This bot can queue music that is added via search or direct URL. 

## Prerequisites

- Node.js
- A Discord account and a Discord bot token
- A YouTube API key
- A Spotify API client ID and client secret

## Installation

1. Clone this repository
2. Run `npm install` to install the required dependencies
3. Replace 'YOUR_BOT_TOKEN_HERE' in a `.env` file with your Discord bot token
4. Replace 'YOUR_YOUTUBE_API_KEY_HERE' in a `.env` file with your YouTube API key
5. Replace 'YOUR_SPOTIFY_CLIENT_ID_HERE' and 'YOUR_SPOTIFY_CLIENT_SECRET_HERE' in a `.env` file with your Spotify API client ID and client secret

```
BOT_TOKEN=${{ YOUR_BOT_TOKEN_HERE }}
YOUTUBE_API_KEY=${{ YOUR_YOUTUBE_API_KEY_HERE }}
SPOTIFY_CLIENT_ID=${{ YOUR_SPOTIFY_CLIENT_ID_HERE }}
SPOTIFY_CLIENT_SECRET=${{ YOUR_SPOTIFY_CLIENT_SECRET_HERE }}
```

## Usage

1. Run `node index.js` to start the bot
2. In a Discord channel, enter `/play <query>` to search for tracks by keyword or play a YouTube/Spotify link

## Commands

- `/play <query>`: Search for tracks by keyword or play a YouTube/Spotify link
- `/pause` : Pause the currently playing track
- `/resume` : Resume playback of the current track
- `/stop` : Stop playback of current track, dump the queue, and destroy the audio connection and disconnect from voice chat
- `/skip`: Skip to the next track in the queue
- `/nowplaying`: Display the title and artist of the current track
- `/queue`: Display the list of tracks in the queue

## Utilities

There is currently one utility, `deploy-commands.js`. Deploy-commands is a manual deploy of all of the slash commands to the server.

### Usage of deploy-commands.js

1. Create a config.json file using this template below: 

```json
{
        "token": "${{ YOUR_BOT_TOKEN_HERE }}",
        "clientId": "${{ YOUR_CLIENT_ID_HERE }}",
        "guildId": "${{ YOUR_GUILD_ID_HERE }}"
}
```

- Token: This is your bot token. This can be retrieved from the Discord Developer Portal, within your app's page.
- clientId: This is your clientID from the OAuth2 Tab in your app settings in the Discrod Developer Portal 
- guildId: This is your server ID. In Developer Mode, right click your server icon in the lefthand bar, and click `copy id`

2. You can manually invoke `deploy-commands.js` with the command `node utilities/deploy-commands.js` OR activate it by uncommenting `sc;`

## Roadmap

The following features are planned for future development:

- `/add <query>`: Search for tracks and add them to the queue
- `/volume <level>`: Set the volume level for playback
- `/lyrics`: Display the lyrics of the current track
- `/playlist <name>`: Create and save a playlist of tracks

- The addition of spotify music to be played
- The content agnostic queue, where spotify and youtube tracks can coexist in a single queue

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
