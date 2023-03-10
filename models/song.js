const { ActivityType } = require('discord.js');
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');

class Song {
    constructor () {
        this.player = createAudioPlayer();
        this.resource = {};
        this.stream = {};
        this.status = 'unplayed';
        this.connection = {};
    }

    async play (interaction, volume=1) {
        // We have to create this.stream in the child class play() function before calling this, or this.stream will be {}
        this.resource = createAudioResource(this.stream, { inlineVolume: true });
        this.resource.volume.setVolume(volume);
        this.player.play(this.resource);

        // Subscribe the connection to the audio player (will play audio on the voice connection)
        this.connection.subscribe(this.player);
        
        let timeout;
        
        this.player.on('stateChange', async (oldState, newState) => {
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
                this.connection.destroy();
            }
        });
        

        // Output the video title
        await interaction.client.channels.cache.get(interaction.channelId).send(`Now Playing: ${this.title}`);
        interaction.client.user.setActivity(this.title, { type: ActivityType.Playing });
    }

    async pause () {
        this.player.pause();
    }

    async unpause() {
        this.player.unpause();
    }

    async stop () {
        console.log("Leaving voice channel due to stop command");
        this.connection.destroy();
    }
};

module.exports = Song