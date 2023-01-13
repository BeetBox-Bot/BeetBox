const { EmbedBuilder } = require('discord.js');

const baseEmbed = new EmbedBuilder()
	.setColor([255, 0, 255])
	.setURL('https://github.com/BeetBox-Bot/BeetBox')
	.setAuthor({ name: 'BeetBox', iconURL: 'https://cdn.discordapp.com/icons/951595568331886692/c9b833a53a3d89b405a1b689bdf1e415.webp?size=96', url: 'https://github.com/BeetBox-Bot/BeetBox' })
	.setTimestamp()

module.exports = {
    baseEmbed
};