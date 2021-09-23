const { Message } = require("discord.js");

module.exports = {
	name: "messageCreate",

	/**
	 *
	 * @param {*} client
	 * @param {Message} message
	 */

	async exec(client, message) {
		if (message.author.bot || !message.content.startsWith(client.prefix)) return;

		const args = client.parse(message);

		const command = client.commands.get(args.command);
		if (!command) return;

		try {
			await command.exec(message, args);
		} catch (e) {
			console.log(e);
		}
	}
};
