var params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})

if (params["error"]) {
	$("#error").html("Error! " + decodeURIComponent(params["error"]));
}