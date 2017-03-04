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
			source: "discordlink",
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
