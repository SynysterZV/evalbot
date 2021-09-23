const { Message } = require("discord.js");
const { inspect } = require("util");
const { fork } = require("child_process");
const { sep } = require("path");

module.exports = {
	name: "eval",

	/**
	 *
	 * @param {Message} message
	 * @param {string[]} args
	 */

	async exec(message, args) {
		if (!args.flags.vm) {
			if (message.author.id == "372516983129767938") {
				let evaled;

				try {
					evaled = await eval(`( async () => {
                        return ${args}
                    })()`);
				} catch (e) {
					evaled = e;
				}

				if (typeof evaled != "string") evaled = inspect(evaled, { depth: 0 });

				return message.client.util.trivialSend(message, evaled, "js");
			}
		}

		const child = fork(__dirname + sep + "run", [], { timeout: 2e3, serialization: "advanced" });
		child.send({ args, ctx: { message } });

		child.on("message", (evaled) => {
			message.client.util.trivialSend(message, evaled, "js");
		});

		child.on("exit", (code, signal) => {
			if (signal) return message.channel.send("Code completion took too long (> 2s)");
		});
	}
};
