const { Message } = require('discord.js')
const { fork } = require('child_process')

module.exports = {
    name: 'eval',

    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     */

    async exec(message, args) {
        if(![
            '372516983129767938',
            '320546614857170945',
            '813020524477153281'
            ].includes(message.author.id)) return

        if(`${args}`.includes('eval')) return message.channel.send('You cannot use eval functions within this eval')

        const child = fork(__dirname + '\\run' , [], { timeout: 1000 })
        child.send({ args: `${args}`, flags: args.flags, ctx: { message, client: message.client } })

        child.on('message', (evaled) => {
            if(evaled.length > 2000) message.channel.send({ files: [{ name: 'output.js', attachment: Buffer.from(evaled) }] })
            else message.channel.send(`\`\`\`js\n${evaled}\n\`\`\``)
        })
    }
}