var url = "http://188.166.149.34:8080/";
var socket = io.connect(url);
var textbox = document.getElementById("bkmbox");
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
	messages.innerHTML += escapeHtml(data.username + "@" + data.source + ": " + data.message) + "<br>";
	$("#bkmchat").scrollTop($("#bkmchat").height());
});

socket.on("url", function(data) {
	messages.innerHTML += escapeHtml(data.username + "@" + data.source + " Attachment:") + "<a href='" + data.message.replace(/'/g, "%27").replace(/"/g, "%22") + "'>" + escapeHtml(data.message) + "</a>";
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
		$("#bkmchat").scrollTop($("#bkmchat").height());
		messages.innerHTML += escapeHtml(user + "@link: " + textbox.value) + "<br>";
		socket.emit("message", {
			source: "link",
			username: user,
			message: textbox.value
		});
		textbox.value = "";
	}
}, false);
