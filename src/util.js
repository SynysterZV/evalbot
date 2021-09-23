function trivialSend(m, c, ext) {
	if (c.length > 2000) m.channel.send({ files: [{ name: "output." + (ext || "txt"), attachment: Buffer.from(c) }] });
	else m.channel.send({ content: `\`\`\`${ext || ""}\n${c}\n\`\`\`` });
}

module.exports = { trivialSend };
