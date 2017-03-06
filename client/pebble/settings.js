var submitButton = document.getElementById('submit');
var usernameBox = document.getElementById('username');
var return_to = getQueryParam('return_to', 'pebblejs://close#');

if(localStorage['username']) {
	usernameBox.value = JSON.parse(localStorage['high_contrast']);
} else {
	usernameBox.value = "pebble";
}

function getConfigData() {
    var backgroundColorPicker = document.getElementById('background_color_picker');
    var highContrastCheckbox = document.getElementById('high_contrast_checkbox');
 
    var options = {
    	'username': usernameBox.value,
    };
    // Save for next launch
    localStorage['username'] = options['username'];
    console.log('Got options: ' + JSON.stringify(options));
    return options;
}

function getQueryParam(variable, defaultValue) {
    var query = location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
    	var pair = vars[i].split('=');
    	if (pair[0] === variable) {
        	return decodeURIComponent(pair[1]);
    	}
    }
    return defaultValue || false;
}
 
  
submitButton.addEventListener('click', function() {
    document.location = return_to + encodeURIComponent(JSON.stringify(getConfigData()));
});
