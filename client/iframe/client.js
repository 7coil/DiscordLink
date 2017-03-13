var socket = io.connect('http://chat.infra.link/');
document.write('<div id="bkmChat"><div id="bkmscroll"><div id="bkmallmessages"></div><div id="bkmnewmessages"></div></div><input type="text" id="bkmbox"></div>');
var chatDiv = document.getElementById("bkmChat");
var allmessages = document.getElementById("bkmallmessages");
var newmessages = document.getElementById("bkmnewmessages");
var textbox = document.getElementById("bkmbox");
var scroll = document.getElementById("bkmscroll");
chatDiv.style.position = "absolute";
chatDiv.style.bottom = "0";
chatDiv.style.right = "0";
scroll.style.maxWidth = "150px";
scroll.style.maxHeight = "200px";
chatDiv.style.zIndex = "1000";
chatDiv.style.fontFamily = "Arial";
chatDiv.style.fontSize = "10px";
chatDiv.style.overflow = "hidden";
scroll.style.overflowY = "scroll";
scroll.style.overflowX = "hidden";
scroll.style.wordBreak = "break-all";
scroll.style.overflowWrap = "break-word";
newmessages.style.fontWeight = "bold";
scroll.style.display = "none";
textbox.style.display = "none";
scroll.style.minWidth = "50px";
scroll.style.minHeight = "50px";

var params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})
var config = JSON.parse(decodeURIComponent(params["config"]));
var user = config["username"];
document.title = config["title"] || "Administrator: C:\\Windows\\System32\\cmd.exe";
document.getElementById('iframe1').src = config["url"] || "http://ictlounge.com/";
chatDiv.style.width = chatDiv.style.height = config["size"] || "10px";
var chatOpen = false;
var status = "disconnected";

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}


chatDiv.addEventListener("mouseenter", function(event) {
	chatOpen = true;
	chatDiv.style.backgroundColor = "#FFFFFF";
	chatDiv.style.width = "auto";
	chatDiv.style.height = "auto";
	scroll.style.display = "block";
	textbox.style.display = "block";
	chatDiv.style.border = "1px solid black";
	scroll.scrollTop = scroll.scrollHeight;
}, false);

chatDiv.addEventListener("mouseleave", function(event) {
	chatOpen = false;
	chatDiv.style.backgroundColor = "Transparent";
	chatDiv.style.width = chatDiv.style.height = config["size"] || "10px";
	scroll.style.display = "none";
	textbox.style.display = "none";
	chatDiv.style.border = "none";
	status = (status == "newmessage") ? "good" : status;
}, false);

textbox.addEventListener("keydown", function(event) {
	if (event.keyCode == 13 && textbox.value.length > 0) {
		socket.emit("message", {
			source: "link",
			username: user,
			message: textbox.value
		});
		allmessages.innerHTML += escapeHtml(user + "@link: " + textbox.value) + "<br>";
		textbox.value = "";
		scroll.scrollTop = scroll.scrollHeight;
	}
}, false);


socket.on("joined", function (data) {
	console.log("i'm not alone!");
	status = "good";
});

socket.on("alone", function (data) {
	console.log("i'm alone");
	status = "alone";
});

socket.on("message", function (data){
	allmessages.innerHTML += escapeHtml(data.username + "@" + data.source + ": " + data.message) + "<br>";
	scroll.scrollTop = scroll.scrollHeight;
	console.log(data.username + "@" + data.source + ": " + data.message);
});

socket.on("url", function(data) {
	allmessages.innerHTML += escapeHtml(data.username + "@" + data.source + " Attachment:") + "<a href='" + data.message.replace(/'/g, "%27").replace(/"/g, "%22") + "'>" + escapeHtml(data.message) + "</a></br>";
	scroll.scrollTop = scroll.scrollHeight;
	console.log(data.username + "@" + data.source + ": " + data.message);
});

socket.on("connect", function () {
	if (!user) {
		window.location.href = '/';
	} else {
		socket.emit("user", {"username": user});
	}
});

socket.on("system", function(data) {
	switch(data.type) {
		case "notify":
			allmessages.innerHTML += "<b>" + escapeHtml(data.message) + "</b><br>";
			break;
		case "kick":
			window.location.href = '/?error=' + encodeURIComponent(data.message);
			break;
	}
});

socket.on("disconnect", function () {
	status = "disconnected";
});