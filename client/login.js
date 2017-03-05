var params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})
var textbox = document.getElementById("username");

if (params["error"]) {
	$("#error").html("Error! " + decodeURIComponent(params["error"]));
}

textbox.addEventListener("keydown", function(event) {
	if (event.keyCode == 13 && textbox.value.length > 0) {
		$(location).attr('href', '/client/?username=' + encodeURIComponent(textbox.value));
	}
}, false);
