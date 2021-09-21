const { Message } = require('discord.js')

module.exports = {
    name: 'test',

    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     */

    exec(message, args) {
        console.log(`${args}`)
    }
}