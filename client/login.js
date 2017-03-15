var params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})
var usernameText = document.getElementById("usernameText");
var themeSelect = document.getElementById("themeSelect");
var windowSelect = document.getElementById("windowSelect");
var theme, windowmode;

if (params["error"]) {
	$("#error").html("Error! " + decodeURIComponent(params["error"]));
}

function changeTheme() {
	theme = themeSelect.options[themeSelect.selectedIndex].value;
	$("#themeSettings").empty();
	switch (theme) {
		case "client":
			$("#themeSettings").empty();
			break;
		case "iframe":
			$("#themeSettings").append('<p>URL:</p>\n');
			$("#themeSettings").append('<input type="text" id="iframeURL" value="https://en.wikipedia.org/wiki/Strange_Case_of_Dr_Jekyll_and_Mr_Hyde">\n');
			$("#themeSettings").append('<p>Corner Button Size (px):</p>\n');
			$("#themeSettings").append('<input type="number" id="iframeSIZE" value="10" min="10" max="100">\n');
			$("#themeSettings").append('<p>New Tab/Window title</p>\n');
			$("#themeSettings").append('<input type="text" id="windowTITLE" value="">\n');
			break;
	}
}

function changeWindow() {
	windowmode = windowSelect.options[windowSelect.selectedIndex].value;
}

function submit() {
	theme = themeSelect.options[themeSelect.selectedIndex].value;
	windowmode = windowSelect.options[windowSelect.selectedIndex].value;
	console.log(theme);
	console.log(windowmode);
	
	var settings = {
		'username': usernameText.value
	}
	
	
	//Set the settings for the theme
	switch (theme) {
		case "iframe":
			$.extend(settings, {
				'url': document.getElementById("iframeURL").value,
				'size': document.getElementById("iframeSIZE").value + "px",
				'title': document.getElementById("windowTITLE").value
			});
			break;
	}
	
	//Encode a URL based on the settings and the selected theme.
	var url = '/' + theme + '/?config=' + encodeURIComponent(JSON.stringify(settings));
	
	/* 1 2 */ switch (windowmode) {
		case "SameTab":
			window.open(url, "_self");
			break;
		case "NewTab":
			window.open(url, "_blank");
			break;
		case "SmallerWindow":
			window.open(url, "", "width=800, height=600");
			break;
		default:
			//window.open(url, "_self");
			break;	
	}
	

}

$(document).ready(function() {
	changeTheme();
});
