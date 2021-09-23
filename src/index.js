if(!process.env['DISCORD_TOKEN']) throw new Error("You need to set DISCORD_TOKEN as an env var")

const { EvalClient } = require("./client");
new EvalClient().init();
