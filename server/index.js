var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser')
var Discord = require('discord.js');
var fs = require('fs');
var client = new Discord.Client();
client.login(process.env.DISCORD);

app.use(express.static(path.join(__dirname, '../client/')));

var users = [];
var channel;

//Set the running game and the avatar for the bot.
client.on('ready', function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("chat.infra.link");
	channel = client.channels.get(fs.readFile('channel.txt'));
	console.dir(client.channels);
	console.dir(channel);
});

io.on('connection', function (socket) {
	socket.on("user", function (data) {
		//Check if the username is too short/long/invalid
		if (typeof(data.username) != "string" || data.username.length < 1 || data.username.length > 32) {
			socket.emit("err", {
				type: "kick",
				message: "Your username is too long or too short, it does not comply with Discord limits."
			});
			return true;
		}
		socket.emit("system", {
			type: "notify",
			message: "Connected!"
		});
	});
	socket.on("message", function (data) {
		//Check if the Discord channel has been set yet.
		if (typeof(channel) === 'undefined') {
			socket.emit("system", {
				type: "notify",
				message: "The Discord TextChannel has currently not been set yet. Please use the (!!DiscordLink) command as an administrator to set a channel."
			});
			return true;
		//Check if the username is too short/long/invalid
		} else if (typeof(data.username) != "string" || data.username.length < 1 || data.username.length > 32) {
			socket.emit("system", {
				type: "kick",
				message: "Your username is too long or too short, it does not comply with Discord limits."
			});
			return true;
		//Check if the message sent is too short/long/invalid
		} else if (typeof(data.message) != "string" || data.message.length < 1 || data.message.length > 1900) {
			socket.emit("system", {
				type: "notify",
				message: "Your message is too long or too short, it does not comply with Discord limits, along with the length of your username."
			});
			return true;
		} else if (typeof(data.source) != "string" || data.message.source < 1 || data.message.source > 1900) {
			socket.emit("system", {
				type: "kick",
				message: "Your source is too long or too short, it does not comply with Discord limits, along with the length of your username."
			});
			return true;
		}
		
		//Do this to prevent sending excess data that may have came from attackers
		socket.broadcast.emit("message", {
			source: data.source,
			message: data.message,
			username: data.username
		});
		
		//Send to Discord channel
		channel.send('**' + data.username + '@' + data.source + '**: ' + data.message);
	});
});

server.listen(process.env.PORT || 8080);

client.on('message', function(message) {
	//Split the text into individual command words.
	let input = message.content.toLowerCase().replace( /\n/g, " " ).split(" ");
	//Stop commands from being run in DMs
	if (!message.guild) return true;
	
	//Check if it's the DiscordLink command for ADMINS only
	if (input[0] === '!!discordlink' && (message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR") || message.author.id === "190519304972664832" || message.author.id === "114049019227013128")) {
		channel = message.channel;
		fs.writeFile('channel.txt', message.channel.id);
		message.reply("Selected this channel for DiscordLink.");
		return true;
	}
	
	//Stop messages from being recieved from itself
	if (client.user.id === message.author.id) return true;
	//Stop messages from being recieved from other channels
	if (channel != message.channel) return true;
	
	//Transmit Discord message to server
	io.sockets.emit("message", {
		source: "discord",
		message: message.content,
		username: message.author.username
	});
	
	//Transmit any attachments
	if (message.attachments) {
		message.attachments.every(function(element, index) {
			io.sockets.emit("url", {
				source: "discord",
				message: element.url,
				username: message.author.username
			});
		});
	}
});

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.post("/POST/", function(req, res) {
	console.dir(req);
});
