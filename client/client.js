var url = "http://188.166.149.34:8080/";
var socket = io.connect(url);
var messages = document.getElementById("bkmmessages");
var user;

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

socket.on("connected", function (data) {
	console.log("connected!");
});

socket.on("message", function (data){
	messages.innerHTML += escapeHtml(data.username + ": " + data.message) + "<br>";
	$("#bkmchat").scrollTop($("#bkmchat").height());
});

socket.on("connect", function () {
	user = user || prompt("Please insert a username.");
	socket.emit("user", {"username": user});
	$('#menu').hide();
});

socket.on("err", function(data) {
	switch(data.type) {
		case "notify":
			messages.innerHTML += "<b>" + escapeHtml(data.message) + "</b><br>";
			break;
		case "username":
			$('menu').show();
			user = prompt(data.message);
			socket.emit("user", {"username": user});
			$('#menu').hide();
			break;
	}

});

function toggleMenu(){
	$('#menu').toggle();
}

textbox.addEventListener("keydown", function(event) {
	if (event.keyCode == 13 && textbox.value.length > 0) {
		messages.innerHTML += escapeHtml(user + ": " + textbox.value) + "<br>";
		$("#bkmchat").scrollTop($("#bkmchat").height());
		socket.emit("message", {
			username: user,
			message: textbox.value
		});
		textbox.value = "";
	}
}, false);

upload.addEventListener('change', function() {
	var files = upload.files;
	if (files.length > 0) {
		sendBase64(files[0], files[0].name);
	}
});


function send(user, message, data) {
	console.log(message);
	socket.emit("message", {
		username: user,
		message: message,
		dataTransfer: data
	});
}

function test() {
	setInterval(function() {
		console.log("Did shit");
		socket.emit("message", {"username": "What the fuck did you just fucking say about me, you little bitch? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You’re fucking dead, kiddo.", message: "What the fuck did you just fucking say about me, you little bitch? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You’re fucking dead, kiddo."});
	}, 10);
}