app.filter('time', function() {
    return function(text) {
        let now = moment();
        var def = now.diff(text, 'days');
        if(def < 0){
            let filetr = def.toString().split('-')
            return filetr[1] + " " + 'Left';
        }else{
            return def + " " + 'Delays';    
        }
    }
});

app.filter('switcherState', function() {
	return function(bool) {
		if(bool == true){
			return 'Monday';
		 }else{
			return 'Sunday';
		 }
	}
});
