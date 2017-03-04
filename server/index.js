var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var request = require('request');
var Discord = require('discord.js');
var client = new Discord.Client();
client.login(process.env.DISCORD);

app.use(express.static(path.join(__dirname, '../client/')));

var users = [];
var channel;

//Set the running game and the avatar for the bot.
client.on('ready', function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("http://188.166.149.34:8080/");
});

io.on('connection', function (socket) {
	socket.on("user", function (data) {
		//Check if the username is too short/long/invalid
		if (typeof(data.username) != "string" || data.username.length < 1 || data.username.length > 32) {
			socket.emit("err", {
				type: "username",
				message: "Your username is too long or too short, it does not comply with Discord limits."
			});
			return true;
		}
	});
	socket.on("message", function (data) {
		let input = data.message.split(" ");
		
		//Check if the Discord channel has been set yet.
		if (typeof(channel) === 'undefined') {
			socket.emit("err", {
				type: "notify",
				message: "The Discord TextChannel has currently not been set yet. Please use the (!!notdiscord) command as an administrator to set a channel."
			});
			return true;
		//Check if the username is too short/long/invalid
		} else if (typeof(data.username) != "string" || data.username.length < 1 || data.username.length > 32) {
			socket.emit("err", {
				type: "username",
				message: "Your username is too long or too short, it does not comply with Discord limits."
			});
			return true;
		//Check if the message sent is too short/long/invalid
		} else if (typeof(data.message) != "string" || data.message.length < 1 || data.message.length > 1950) {
			socket.emit("err", {
				type: "notify",
				message: "Your message is too long or too short, it does not comply with Discord limits, along with the length of your username."
			});
			return true;
		}
		
		//Do this to prevent sending excess data that may have came from attackers
		socket.broadcast.emit("message", {
			message: data.message,
			username: data.username
		});
		
		//Send to Discord channel
		channel.send('**' + data.username + '**: ' + data.message);
	});
	
	client.on('message', function(message) {
		//Split the text into individual command words.
		let input = message.content.replace( /\n/g, " " ).split(" ");
		//Stop commands from being run in DMs
		if (!message.guild) return true;
		//Stop messages from being recieved from itself
		if (client.user.id === message.author.id) return true;
		//Stop messages from being recieved from other channels
		if (channel === message.channel) return true;
		
		switch(input[0]) {
			case '!!notdiscord':
				channel = message.channel;
				message.reply("Selected this channel for NotDiscord.");
				break;
			default:
				socket.broadcast.emit("message", {
					message: message.content,
					username: message.author.username
				});
				break;
		}
	});
});

server.listen(process.env.PORT || 8080);
