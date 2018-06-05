var express = require('express');
var http = require('http');
var api = express();
var mysql_2 = require('../helpers/mysql.js');
var bodyParser = require('body-parser');


api.set('port', process.env.PORT || 3000);

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: false}));


//Create
api.post('/newEvent', function(req, res) {
      if (req.method == "POST") {
        var b = req.body;
          var event = {title:b.params.title, description:b.params.description, start:b.params.start, end:b.params.end, className:b.params.className};
        new mysql_2.MysqlHelpers().addEvents(new mysql_2.MysqlHelpers().initialize(), event).then(function (ret_val){
            res.json({'status': 200, 'msg': 'success'});
        });
        new mysql_2.MysqlHelpers().close(new mysql_2.MysqlHelpers().initialize());
      }else{
          res.json({'status': 304, 'msg': 'Not Modified'});
      }   
    
});

//Read
api.get('/getEventsbyMonth', function (req, res) {
    new mysql_2.MysqlHelpers().getEvents(new mysql_2.MysqlHelpers().initialize()).then(function (dataset){
        res.json(dataset);
    }); 
    new mysql_2.MysqlHelpers().close(new mysql_2.MysqlHelpers().initialize());
});

//Test Case 01
api.get('/getEvents', function (req, res) {
    new mysql_2.MysqlHelpers().getEvents(new mysql_2.MysqlHelpers().initialize()).then(function (dataset){
        res.json(dataset);
    }); 
    new mysql_2.MysqlHelpers().close(new mysql_2.MysqlHelpers().initialize());
});


api.delete('/deleteEvents', function (req, res) {
    var id = req.body.id;
    new mysql_2.MysqlHelpers().deleteEvent(new mysql_2.MysqlHelpers().initialize(), id).then(function (ret_val){
        res.json({'status': 200, 'msg': 'success'});
    });
    new mysql_2.MysqlHelpers().close(new mysql_2.MysqlHelpers().initialize());
});


api.post('/updateEvents', function (req, res) {
    var b = req.body;
    var event = {id:b.params.id, title:b.params.title,description:b.params.description, start:b.params.start, end:b.params.end, className:b.params.className};
    new mysql_2.MysqlHelpers().editEvent(new mysql_2.MysqlHelpers().initialize(), event).then(function (ret_val){
        res.send({'status': 200, 'msg': 'success'});
    });
    new mysql_2.MysqlHelpers().close(new mysql_2.MysqlHelpers().initialize());
});
  
http.createServer(api).listen(api.get('port'), function () {
    console.log("Express server listening on port " + api.get('port'));
});

