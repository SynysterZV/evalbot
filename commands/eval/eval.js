const { Message } = require('discord.js')
const { fork } = require('child_process')
const { sep } = require('path')

module.exports = {
    name: 'eval',

    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     */

    async exec(message, args) {
        if(`${args}`.includes('eval')) return message.channel.send('You cannot use eval functions within this eval')

        const child = fork(__dirname + sep + 'run' , [], { timeout: 2e3, serialization: 'advanced' })
        child.send({ args, ctx: { message } })

        child.on('message', (evaled) => {
            if(evaled.length > 2000) message.channel.send({ files: [{ name: 'output.js', attachment: Buffer.from(evaled) }] })
            else message.channel.send(`\`\`\`js\n${evaled}\n\`\`\``)
        })
    }
}