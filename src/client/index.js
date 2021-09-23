const { Client, Collection } = require("discord.js");
const { sync } = require("glob");
const util = require("../util");

class Args extends Array {
	constructor(str = "", len = 0) {
		super();

		const [cmd, ...args] = str.slice(len).split(" ");

		this.command = cmd;

		this.flags = args.reduce((b, c) => {
			const match = c.match(/^-+([\w-]+)=?(?:(?<==)([\w-\.]+))?/);
			if (match) b[match[1]] = match[2] || true;
			else this.push(c);
			return b;
		}, {});
	}

	toString() {
		return this.join(" ");
	}
}

class EvalClient extends Client {
	constructor() {
		super({ intents: ["GUILDS", "GUILD_MESSAGES"] });

		this.prefix = process.env["PREFIX"] || "!!";

		this.util = util;

		this.commands = new Collection();
	}

	loadCommands() {
		sync("commands/**/*.js", { absolute: true }).forEach((x) => {
			const command = require(x);
			this.commands.set(command.name, command);
			delete require.cache[require.resolve(x)];
		});
	}

	loadEvents() {
		sync("events/**/*.js", { absolute: true }).forEach((x) => {
			const event = require(x);
			this.on(event.name, event.exec.bind(null, this));
			delete require.cache[require.resolve(x)];
		});
	}

	parse(msg) {
		return new Args(msg.content, this.prefix.length);
	}

	async init() {
		this.loadCommands();
		this.loadEvents();

		this.login();
		return this;
	}
}

module.exports = { EvalClient, Args };
