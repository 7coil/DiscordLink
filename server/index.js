var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser')
var Discord = require('discord.js');
var fs = require('fs');
var client = new Discord.Client();
var request = require('request').defaults({encoding: null});
client.login(process.env.DISCORD);

app.use(express.static(path.join(__dirname, '../client/')));

var channel;

//Set the running game and the avatar for the bot.
client.on('ready', function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("chat.infra.link");
	fs.readFile('channel.txt', 'utf8', function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var message = JSON.parse(data);
			console.dir(message);
			channel = client.channels.get(message.channel.id);
		}
	});
	
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
				message: "Your message is too long or too short, it does not comply with Discord limits."
			});
			return true;
		//Check if the source sent is too short/long/valid
		} else if (typeof(data.source) != "string" || data.message.source < 1 || data.message.source > 1900) {
			socket.emit("system", {
				type: "kick",
				message: "The source data sent was too long or too short, please contact the author of this software to fix this error."
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
		fs.writeFile('channel.txt', JSON.stringify(message), 'utf-8');
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
			var data;
			//Check if the attatchment is an IMAGE
			var img = !!element.height;
			//Check if there is a filename.
			var name = element.filename || "Unnamed File";
			
			request.get(element.url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
				}
			});

			io.sockets.emit("url", {
				source: "discord",
				message: data,
				username: message.author.username,
				img: img,
				name: name
			});
		});
	}
});

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.post("/POST/", function(req, res) {
	console.dir(req.body);
	//Check if the Discord channel has been set yet.
	if (typeof(channel) === 'undefined') {
		res.end("Exited with error code: 1");
		return true;
	//Check if the username is too short/long/invalid
	} else if (typeof(req.body.username) != "string" || req.body.username.length < 1 || req.body.username.length > 32) {
		res.end("Exited with error code: 2");
		return true;
	//Check if the message sent is too short/long/invalid
	} else if (typeof(req.body.message) != "string" || req.body.message.length < 1 || req.body.message.length > 1900) {
		res.end("Exited with error code: 3");
		return true;
	//Check if the source sent is too short/long/valid
	} else if (typeof(req.body.source) != "string" || req.body.message.source < 1 || req.body.message.source > 1900) {
		res.end("Exited with error code: 4");
		return true;
	}
	
	//Do this to prevent sending excess data that may have came from attackers
	io.sockets.emit("message", {
		source: req.body.source,
		message: req.body.message,
		username: req.body.username
	});

	
	//Send to Discord channel
	channel.send('**' + req.body.username + '@' + req.body.source + '**: ' + req.body.message);
	res.end("Exited with error code: 0");
});
