const { ActivityType } = require('discord.js');
const { getVoiceConnection, createAudioResource } = require('@discordjs/voice');

class Song {
    constructor () {
        this.resource = {};
        this.stream = {};
        this.status = 'unplayed';
    }

    async play (interaction, volume=1) {
        // We have to create this.stream in the child class play() function before calling this, or this.stream will be {}
        this.resource = createAudioResource(this.stream, { inlineVolume: true });
        this.resource.volume.setVolume(volume);
        
        const connection = getVoiceConnection(interaction.guildId);
        connection.player.play(this.resource);
        
        let timeout;
        
        connection.player.on('stateChange', async (oldState, newState) => {
            this.status = newState.status;
            if (newState.status === 'playing') {
                clearTimeout(timeout);
            }

            // Leave voice channel when audio is finished playing and idle for two minutes (this should only happen for the last song in a Queue, because the obj should get destroyed first)
            // TODO move this to Queue
            if (newState.status === 'idle') {
                await global.queue.nextSong(interaction);
                //const timeout = setTimeout(() => {
                //    console.log("Leaving voice channel due to inactivity");
                //    this.connection.destroy();
                //}, 120000);
            }

            // Leave voice channel when audio encounters an error
            if (newState.status === 'error') {
                console.error(newState.error);
                console.log("Leaving voice channel due to error");
                interaction.connection.destroy();
            }
        });
        

        // Output the video title
        await interaction.client.channels.cache.get(interaction.channelId).send(`Now Playing: ${this.title}`);
        interaction.client.user.setActivity(this.title, { type: ActivityType.Playing });
    }

    async pause (interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        connection.player.pause();
    }

    async unpause(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        connection.player.unpause();
    }

    async stop (interaction) {
        console.log("Leaving voice channel due to stop command");
        const connection = getVoiceConnection(interaction.guildId);
        connection.destroy();
    }
};

module.exports = Song