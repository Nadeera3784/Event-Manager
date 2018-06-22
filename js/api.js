var express       = require('express');
var http          = require('http');
var api           = express();
var sqlite_2      = require('../helpers/sqlite3.js');
var bodyParser    = require('body-parser');
var moment        = require('./moment.min.js');
api.set('port', process.env.PORT || 3000);

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: false}));

api.disable('x-powered-by');

api.post('/newEvent', function(req, res) {
	if (req.method == "POST") {
		var b = req.body;
		var event = {title:b.params.title, description:b.params.description, start:b.params.start, end:b.params.end, className:b.params.className};
		new sqlite_2.Sqlite3Helpers().addEvents(new sqlite_2.Sqlite3Helpers().initialize('database.db'), event).then(function (ret_val){
			res.json({'status': 200, 'msg': 'success'});
		});
		new sqlite_2.Sqlite3Helpers().close(new sqlite_2.Sqlite3Helpers().initialize('database.db'));
	}else{
		res.json({'status': 304, 'msg': 'Not Modified'});
	}   

});

api.get('/getEvents', function (req, res) {
	new sqlite_2.Sqlite3Helpers().getEvents(new sqlite_2.Sqlite3Helpers().initialize('database.db')).then(function (dataset){
		res.json(dataset);
	}); 
	new sqlite_2.Sqlite3Helpers().close(new sqlite_2.Sqlite3Helpers().initialize('database.db'));
});

api.delete('/deleteEvents', function (req, res) {
	var id = req.body.id;
	new sqlite_2.Sqlite3Helpers().deleteEvent(new sqlite_2.Sqlite3Helpers().initialize('database.db'), id).then(function (ret_val){
		res.json({'status': 200, 'msg': 'success'});
	});
	new sqlite_2.Sqlite3Helpers().close(new sqlite_2.Sqlite3Helpers().initialize('database.db'));
});

api.post('/updateEvents', function (req, res) {
	var b = req.body;
	var event = {id:b.params.id, title:b.params.title,description:b.params.description, start:b.params.start, end:b.params.end, className:b.params.className};
	new sqlite_2.Sqlite3Helpers().updateEvent(new sqlite_2.Sqlite3Helpers().initialize('database.db'), event).then(function (ret_val){
		res.send({'status': 200, 'msg': 'success'});
	});
	new sqlite_2.Sqlite3Helpers().close(new sqlite_2.Sqlite3Helpers().initialize('database.db'));
});

api.get('/getMailconfig', function (req, res) {
	new sqlite_2.Sqlite3Helpers().getMailconfig(new sqlite_2.Sqlite3Helpers().initialize('database.db')).then(function (dataset){
		res.json(dataset);
	}); 
	new sqlite_2.Sqlite3Helpers().close(new sqlite_2.Sqlite3Helpers().initialize('database.db'));
});


api.put('/updateMailconfig', function (req, res) {
	var b = req.body;
	var config = {mail_username:b.params.username, mail_password:b.params.password};
	new sqlite_2.Sqlite3Helpers().updateMailconfig(new sqlite_2.Sqlite3Helpers().initialize('database.db'), config).then(function (ret_val){
		res.send({'status': 200, 'msg': 'success'});
	});
	new sqlite_2.Sqlite3Helpers().close(new sqlite_2.Sqlite3Helpers().initialize('database.db'));
});

api.post('/addMailconfig', function (req, res) {
	var b = req.body;
	var config = {mail_username:b.params.username, mail_password:b.params.password};
	new sqlite_2.Sqlite3Helpers().addMailconfig(new sqlite_2.Sqlite3Helpers().initialize('database.db'), config).then(function (ret_val){
		res.send({'status': 200, 'msg': 'success'});
	});
	new sqlite_2.Sqlite3Helpers().close(new sqlite_2.Sqlite3Helpers().initialize('database.db'));
});

http.createServer(api).listen(api.get('port'), function () {
    console.log("Express server listening on port " + api.get('port'));
});

