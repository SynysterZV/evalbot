const { Message } = require('discord.js')
const { execSync } = require('child_process')

module.exports = {
    name: 'shell',

    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     */

    exec(message, args) {
        if(message.author.id != '372516983129767938') return

        const output = execSync(`${args}`).toString()

        message.client.util.trivialSend(message, output)
    }
}