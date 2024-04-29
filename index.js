require('dotenv').config(); // Load environment variables from .env file
const { Client, Intents } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Register commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
}

client.once('ready', () => {
    console.log('Bot is ready');
    client.application?.commands.set(commands).then(() => {
        console.log('Commands registered');
    }).catch(console.error);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = commands.find(cmd => cmd.name === interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN); // Retrieve token from environment variable
