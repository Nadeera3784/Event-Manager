"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

let sqlite3 = require('sqlite3');
const path = require('path');

let Sqlite3Helpers = (function () {
	function Sqlite3Helpers() {
	}
	Sqlite3Helpers.prototype.initialize = function (dbname) {
		const db_pth = path.join(__dirname, '..', 'database', dbname);
		const db = new sqlite3.Database(db_pth);
		return db;
	};
	
	Sqlite3Helpers.prototype.getEvents = function (connection) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.run('SELECT id,title,description,start,end,className  FROM `events` ORDER BY id' , function(err, rows){
				if (err) reject(err);
				resolve(rows);
			});
		});
	};

	Sqlite3Helpers.prototype.addEvents = function (connection, event) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.run('INSERT INTO `events` (title, description, start, end, className) VALUES (?, ?, ?, ?, ?)' ,[event.title, event.description, event.start, event.end, event.className],  function(err, results){
				if (err) reject(err);
				resolve(results);
			});
		});
	}; 

	Sqlite3Helpers.prototype.updateEvent = function (connection, event) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.query('UPDATE `events` SET title = ?, description= ?, start = ?, end = ?, className = ? WHERE id = ? ' ,[event.title, event.description, event.start, event.end, event.className, event.id], function(err, rows){
				if (err) reject(err);
				resolve(rows);
			});
		});
	}; 

	Sqlite3Helpers.prototype.deleteEvent = function (connection, id) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.query('DELETE FROM `events` WHERE  id=' + id , function(err, rows){
				if (err) reject(err);
				resolve(rows);
			});
		});
	};

	Sqlite3Helpers.prototype.close = function (connection) {
		connection.close();       
	};    
	return Sqlite3Helpers;
}());
exports.Sqlite3Helpers = Sqlite3Helpers;
