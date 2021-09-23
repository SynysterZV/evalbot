const { Message } = require("discord.js");
const fetch = require("node-fetch");

function random(c) {
	return c[~~(Math.random() * c.length)];
}

function makeEmbed(result, rand) {
	let body;
	if (rand) {
		try {
			body = Array.isArray(result) ? random(result[0].data.children).data : random(result.data.children).data;
		} catch {}
	} else {
		try {
			body = Array.isArray(result) ? result[0].data.children[0].data : result.data.children[0].data;
		} catch {}
	}

	if (typeof body == "undefined") return { error: "No Posts found" };

	let {
		author,
		title,
		subreddit_name_prefixed,
		selftext,
		thumbnail,
		score,
		num_comments,
		url,
		created_utc,
		permalink,
		url_overridden_by_dest,
		gallery_data,
		is_video,
		over_18
	} = body;

	if (url?.match(/imgur|gfycat/)) url += ".gif";
	if (url_overridden_by_dest?.match(/imgur|gfycat/)) url_overridden_by_dest += ".gif";

	const embed = {
		author: {
			name: subreddit_name_prefixed,
			icon_url:
				"https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_reddit-512.png",
			url: `https://reddit.com/${subreddit_name_prefixed}`
		},
		title: title.replace("&amp;", "&"),
		url: `https://reddit.com${permalink}`,
		image: {
			url:
				thumbnail == "self"
					? ""
					: gallery_data
					? `https://i.redd.it/${gallery_data.items[0].media_id}.jpg`
					: url_overridden_by_dest || url
		},
		footer: {
			text: `${score >= 0 ? `👍 ${score}` : `👎 ${score}`} ◈ 💬 ${num_comments} ◈ Author: ${author}`
		},
		color: 0xff5700,
		timestamp: new Date(parseInt(created_utc + "000")),
		description: selftext ? `${selftext.substr(0, 2000)}...` : ""
	};

	return { embed, is_video, url, nsfw: over_18 };
}

module.exports = {
	name: "reddit",

	/**
	 *
	 * @param {Message} message
	 * @param {string[]} args
	 */

	async exec(message, args) {
		const sub = args.join(" ") || "memes";
		const url = `https://reddit.com/r/${sub}/${args.flags.l ? "new" : "random"}/.json`;

		const res = await fetch(url)
			.then((res) => res.json())
			.catch(() => null);
		if (Array.isArray(res) ? !res[0].data?.children?.length : !res.data?.children?.length)
			return message.reply(`Subreddit Not Found: ${sub}`);

		const info = makeEmbed(res, !args.flags.l, message.channel.nsfw);
		if (info.error) return message.reply(info.error);

		if (!message.channel.nsfw && info.nsfw) {
			return message.reply("This content is NSFW. Go to an NSFW channel to view it");
		}

		message.channel.send({ embeds: [info.embed] });
	}
};
