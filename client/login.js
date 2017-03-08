var params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})
var usernameBox = document.getElementById("username");
var themeSelect = document.getElementById("theme");
var theme, settings;

if (params["error"]) {
	$("#error").html("Error! " + decodeURIComponent(params["error"]));
}

function changeTheme() {
	theme = themeSelect.options[themeSelect.selectedIndex].value;
	$("#settings").empty();
	switch (theme) {
		case "client":
			$("#settings").empty();
			break;
		case "iframe":
			$("#settings").append('<p>URL:</p>\n');
			$("#settings").append('<input type="text" id="iframeURL" value="https://en.wikipedia.org/wiki/Strange_Case_of_Dr_Jekyll_and_Mr_Hyde">\n');
			$("#settings").append('<p>Corner Button Size (px):</p>\n');
			$("#settings").append('<input type="number" id="iframeSIZE" value="10" min="10" max="100">\n');
			break;
	}
}

function submit() {
	switch (theme) {
		case "client":
			settings = {
				'username': usernameBox.value
			}
			break;
		case "iframe":
			settings = {
				'username': usernameBox.value,
				'url': document.getElementById("iframeURL").value,
				'size': document.getElementById("iframeSIZE").value + "px"
			}
			break;
	}
	$(location).attr('href', '/' + theme + '/?config=' + encodeURIComponent(JSON.stringify(settings)))
}

$(document).ready(function() {
	changeTheme();
});
