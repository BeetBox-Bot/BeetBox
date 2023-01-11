const { Youtube } = require('./youtube');

class Queue {
    /**
     * This class represents a FIFO queue of Songs. The 0th element is the end of the queue, so the currently playing song. Songs are added to the end of the queue and move towards the front.
     */
    constructor() {
        this.songs = [];
        this.channel = {}
        this.state = 'idle';
        this.volume = 1;
    }

    async push(song, interaction) {
        this.channel = interaction.client.channels.cache.get(interaction.channelId);
        const title = await Youtube.getTitle(song.link);
        song.title = title;
        this.songs.push(song);

        // If this is the first song, play it
        if (song === this.getTop()) {
            await this.start(interaction);
            await interaction.editReply('.'); 
        }
        else
            await interaction.editReply(`Added ${title} to queue!`); 
    }

    pop() {
        this.songs.shift();
    }

    async start(interaction) {
        await this.getTop().play(interaction, this.volume);
    }

    async nextSong(interaction) {
        this.pop();
        if (this.songs.length > 0)
            await this.start(interaction);
    }

    isEmpty() {
        return this.songs.length === 0;
    }

    getTop() {
        return this.songs[0];
    }

    getNext() {
        if (this.songs.length < 2)
            return null;
        return this.songs[1];
    }

    async pause() {
        this.state = 'paused';
        await this.getTop().pause();
    }

    async unpause() {
        this.state = 'playing';
        await this.getTop().unpause();
    }

    async stop(interaction) {
        this.state = 'stopped';
        await this.getTop().stop(interaction);
        this.songs = [];
    }

    async skip(interaction) {
        await this.nextSong(interaction);
    }

    list() {
        return this.songs.map((s) => s.title);
    }

    async setVolume(volume) {
        this.volume = volume;
        await this.pause();
        this.getTop().resource.volume.setVolume(this.volume);
        await this.unpause();
    }
}

module.exports = Queue;