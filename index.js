const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const youtube = require('./services/youtube');
const spotify = require('./services/spotify');

const sc = require('./utilities/deploy-commands');

// Load the .env file
const dotenv = require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildPresences,
    ],
});

module.exports.client = client;

// Reload slash commands when the bot starts
sc;

// Prep use of slash commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load slash commands
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
// Create an event listener for messages
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', message => {
    // Check if the message starts with '!play'
    if (message.content.startsWith('!play')) {
        // Get the search query or YouTube/Spotify link from the message
        const query = message.content.split(' ')[1];

        // Check if the query is a YouTube link
        if (query.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)) {
            // Get the YouTube video ID from the link
            const videoId = query.split('v=')[1];

            // Play the audio of the YouTube video
            youtube.play(videoId, message);
        } else {
            // Check if the query is a Spotify link
            if (query.match(/https?:\/\/(open|play)\.(spotify\.com)\/(track|album)\/[a-zA-Z0-9]{22}/)) {
                // Get the Spotify track or album ID from the link
                const id = query.split(/https?:\/\/(open|play)\.(spotify\.com)\/(track|album)\/([a-zA-Z0-9]{22})/)[4];

                // Play the audio of the Spotify track or album
                spotify.play(id, message);
            } else {
                // Search for YouTube and Spotify videos by keyword
                youtube.search(query, youtubeApiKey, (error, youtubeResults) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    // Get the first YouTube result
                    const youtubeResult = youtubeResults[0];

                    spotify.search(query, (error, spotifyResults) => {
                        if (error) {
                            console.error(error);
                            return;
                        }

                        // Get the first Spotify result
                        const spotifyResult = spotifyResults[0];

                        // Play the audio of the first YouTube or Spotify result
                        if (youtubeResult) {
                            youtube.play(youtubeResult.id.videoId, message);
                        } else if (spotifyResult) {
                            spotify.play(spotifyResult.id, message);
                        } else {
                            message.channel.send('No results found.');
                        }
                    });
                });
            }
        }
    }
});

client.login(process.env.BOT_TOKEN);
