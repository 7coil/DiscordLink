var url = "http://chat.infra.link/";
var socket = io.connect(url);
var textbox = document.getElementById("bkmbox");
var messages = document.getElementById("bkmmessages");
var params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})
var config = JSON.parse(decodeURIComponent(params["config"]));
var user = config["username"];
								
function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

socket.on("message", function (data){
	messages.innerHTML += escapeHtml(data.username + "@" + data.source + ": " + data.message) + "<br>";
	$("#bkmchat").scrollTop($("#bkmchat").height());
});

socket.on("url", function(data) {
	messages.innerHTML += escapeHtml(data.username + "@" + data.source + " Attachment:") + "<a href='" + data.message.replace(/'/g, "%27").replace(/"/g, "%22") + "'>" + escapeHtml(data.message) + "</a></br>";
	$("#bkmchat").scrollTop($("#bkmchat").height());
});

socket.on("connect", function () {
	if (!user) {
		$(location).attr('href', '/');
	} else {
		socket.emit("user", {"username": user});
		$('#menu').hide(200);
	}
});

socket.on("system", function(data) {
	switch(data.type) {
		case "notify":
			messages.innerHTML += "<b>" + escapeHtml(data.message) + "</b><br>";
			break;
		case "kick":
			$('menu').hide(200);
			$(location).attr('href', '/?error=' + encodeURIComponent(data.message));
			break;
	}
});

function toggleMenu(){
	$('#menu').toggle(200);
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
