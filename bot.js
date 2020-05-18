const Discord = require("discord.js");
const client = new Discord.Client();
require('dotenv').config();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('mEmEs Be BoRn', {type: 'WATCHING'}).then(_ => console.log('New status set!')).catch(console.error);
});



let readMessage = true;
const prefix = '!mock'

client.on('message', message => {
    const content = message.content;
    if(!content.startsWith(prefix)) return;

    const split = content.split(/ +/);
    const args = split.slice(1);
    
	if(readMessage) {
        if (message.author == client.user) {
            return
        }
        const user = getUserFromMention(args[0]);
        if(user){
            args.shift();
        }
    
        const letterArray = args.join(' ').toLowerCase().split('');
        let i = 0;
        let counter = 0;
        let mockingText = '';
        while(i < letterArray.length){
            mockingText += counter % 2 ? letterArray[i].toUpperCase() : letterArray[i];
            if(letterArray[i] !== " "){
                counter++;
            }
            i++
        }


        message.channel.send(`${mockingText} ${user ? user.toString() : ''}`)

		readMessage = false;
        timeout = setTimeout( () => readMessage = true, 5000);
	}
});

const getUserFromMention = (mention) => {
	// The id is the first and only match found by the RegEx.
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// However the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}
client.login(process.env.BOT_TOKEN);