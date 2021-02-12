const Discord = require("discord.js");
const client = new Discord.Client();
require('dotenv').config();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('mEmEs Be BoRn !help', {type: 'WATCHING'}).then(_ => console.log('New status set!')).catch(console.error);
});

const mockPrefix = '!mock';
const addRolePrefix = '!addRole';
const removeRolePrefix = '!removeRole'
const helpPrefix = '!help'


client.on('message', message => {
    const content = message.content;
    if(content.startsWith(mockPrefix)) {
        mocking(message)
    };
    if(content.startsWith(removeRolePrefix)) {
        removeRole(message);
    }
    if(content.startsWith(addRolePrefix)) {
        addRole(message);
    }
    if(content.startsWith(helpPrefix)) {
        help(message);
    }
});

const help = (message) => {
    const helpText = `
    
        **_Commands_**:
        > **!mock**
        > example: !mock @hewhosmites I am the coolest
        > notes: the user is optional

        > **!removeRole**
        > example: !removeRole coolGuys
        > notes: the paramter is a string

        > **!addRole**
        > example: !addRole coolGuys notCoolGuys
        > notes: the first paramter is the check and the 2nd is what to add
        > so in this example everyone with **coolGuys** will also get not **notCoolGuys**
    `;
    client.users.cache.get(message.author.id).send(helpText);
}

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

const mocking = (message) => {
    const content = message.content;
    const split = content.split(/ +/);
    const args = split.slice(1);
    if (message.author === client.user) {
        return
    }
    const user = getUserFromMention(args[0]);
    if(user){
        args.shift();
    }

    const letterArray = args.join(' ').split('');
    let counter = 0;
    const mockingText = letterArray.reduce((string, letter) => {
        string += counter % 2 ? letter.toUpperCase() : letter.toLowerCase();
        if(!letter.search(/[a-zA-z]/)){
            counter++;
        }
        return string;
    }, '')

    message.delete()
    message.channel.send(`${mockingText} ${user ? user.toString() : ''}-- from ${message.author.toString()} hello`);
}

const addRole = ( message ) => {
    const split = message.content.split(/ +/);
    const args = split.slice(1);
    const [ roleToCheck, roleToAdd ] = args;

    if(!message.guild.roles.cache.find(role => role.name === roleToAdd)) {
        return message.channel.send(`${roleToAdd || 'role'} to add not found`)
    }
    if(!message.guild.roles.cache.find(role => role.name === roleToCheck)) {
        return message.channel.send(`${roleToCheck || 'role'} to check not found`)
    }

    const checkId = message.guild.roles.cache.find(role => role.name === roleToCheck).id;
    const addId = message.guild.roles.cache.find(role => role.name === roleToAdd).id;

    message.guild.members.cache
        .filter(member => member._roles.includes(checkId))
        .forEach(member => member.roles.add(addId))
}

const removeRole = ( message ) => {
    const split = message.content.split(/ +/);
    const args = split.slice(1);
    const [ roleToRemove ] = args

    if(!message.guild.roles.cache.find(role => role.name === roleToRemove)) {
        return message.channel.send(`${roleToRemove || 'role'} not found`)
    }

    const removeId = message.guild.roles.cache.find(role => role.name === roleToRemove).id;

    message.guild.members.cache
        .filter(member => member._roles.includes(removeId))
        .forEach(member => member.roles.remove(removeId))
}

client.login(process.env.BOT_TOKEN);