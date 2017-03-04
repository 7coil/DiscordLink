var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var request = require('request');
var Discord = require('discord.js');
var client = new Discord.Client();
client.login(api["discord"]);

app.use(express.static(path.join(__dirname, '../client/')));

var users = [];
var channel;

io.on('connection', function (socket) {
	socket.on("user", function (data) {
		//Check if the Discord channel has been set yet.
		if (typeof(channel) === null) {
			socket.emit("error", {
				message: "The Discord TextChannel has currently not been set yet. Please use the (!!notdiscord) command as an administrator to set a channel."
			});
			return true;
		//Check if the username is too short/long/invalid
		} else if (data.username != "string" || data.username.length === 0 || data.username.length > 32) {
			socket.emit("error", {
				message: "Your message is too long or too short, it does not comply with Discord limits."
			});
			return true;
		//Check if the message sent is too short/long/invalid
		} else if (data.message != "string" || data.message.length === 0 || data.message.length > 2000) {
			socket.emit("error", {
				message: "Your message is too long or too short, it does not comply with Discord limits."
			});
			return true;
		}
	});
	socket.on("message", function (data) {
		let input = data.message.split(" ");
		
		//Check if the Discord channel has been set yet.
		if (typeof(channel) === null) {
			socket.emit("error", {
				message: "The Discord TextChannel has currently not been set yet. Please use the (!!notdiscord) command as an administrator to set a channel."
			});
			return true;
		//Check if the username is too short/long/invalid
		} else if (data.username != "string" || data.username.length === 0 || data.username.length > 32) {
			socket.emit("error", {
				message: "Your message is too long or too short, it does not comply with Discord limits."
			});
			return true;
		//Check if the message sent is too short/long/invalid
		} else if (data.message != "string" || data.message.length === 0 || data.message.length > 2000) {
			socket.emit("error", {
				message: "Your message is too long or too short, it does not comply with Discord limits."
			});
			return true;
		}
		
		socket.broadcast.emit("message", data);
	});
});

server.listen(process.env.PORT || 8080);
