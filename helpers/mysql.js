"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

let sql = require('mysql');

let MysqlHelpers = (function () {
    function MysqlHelpers() {
    }
    MysqlHelpers.prototype.initialize = function () {
        let connectionProps = {
            host     : '127.0.0.1',
            user     : 'root',
            password : null,
            database : 'event_manager'
        };
        return sql.createConnection(connectionProps);
    };

    MysqlHelpers.prototype.getEvents = function (connection) {
        return new Promise(function(resolve, reject) {
            if(!connection) reject();
            connection.query('SELECT id,title,description,start,end,className  FROM `events` ORDER BY id' , function(error, rows, fields){
                if (error) reject(error);
                resolve(rows);
            });
        });
    };
    
    MysqlHelpers.prototype.getEvent = function (connection, id) {
        return new Promise(function(resolve, reject) {
            if(!connection) reject();
            connection.query('SELECT id,title,description,start,end,className FROM `events` WHERE id=' + id , function(error, rows, fields){
                if (error) reject(error);
                resolve(rows);
            });
        });
    };
    
    MysqlHelpers.prototype.addEvents = function (connection, event) {
        return new Promise(function(resolve, reject) {
            if(!connection) reject();
            connection.query('INSERT INTO `events` (title, description, start, end, className) VALUES (?, ?, ?, ?, ?)' ,[event.title, event.description, event.start, event.end, event.className],  function(error, results, fields){
                if (error) reject(error);
                resolve(results);
            });
        });
    }; 
    
    MysqlHelpers.prototype.editEvent = function (connection, event) {
        return new Promise(function(resolve, reject) {
            if(!connection) reject();
            connection.query('UPDATE `events` SET title = ?, description= ?, start = ?, end = ?, className = ? WHERE id = ? ' ,[event.title, event.description, event.start, event.end, event.className, event.id], function(error, rows, fields){
                if (error) reject(error);
                resolve(rows);
            });
        });
    }; 
    
    MysqlHelpers.prototype.deleteEvent = function (connection, id) {
        return new Promise(function(resolve, reject) {
            if(!connection) reject();
            connection.query('DELETE FROM `events` WHERE  id=' + id , function(error, rows, fields){
                if (error) reject(error);
                resolve(rows);
            });
        });
    };
    
	MysqlHelpers.prototype.getSwitch = function (connection) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.query('SELECT switch_state FROM `switch` LIMIT 1' , function(error, rows, fields){
				if (error) reject(error);
				resolve(rows);
			});
		});
	};

	MysqlHelpers.prototype.getMailconfig = function (connection) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.query('SELECT mail_username,mail_password  FROM `mail` LIMIT 1' , function(error, rows, fields){
				if (error) reject(error);
				resolve(rows);
			});
		});
	};
	
    MysqlHelpers.prototype.close = function (connection) {
        connection.end();       
    };    
    return MysqlHelpers;
}());
exports.MysqlHelpers = MysqlHelpers;
