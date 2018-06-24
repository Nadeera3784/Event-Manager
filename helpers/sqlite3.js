"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

let sqlite3 = require('sqlite3');
const path = require('path');
//const app = require('electron');

let Sqlite3Helpers = (function () {
	function Sqlite3Helpers() {
	}
	Sqlite3Helpers.prototype.initialize = function (dbname) {
		const db_pth = path.join(__dirname, '..', 'database', dbname);
		const db = new sqlite3.Database(db_pth);
		db.run("CREATE TABLE IF NOT EXISTS `events` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `title` char ( 20 ) NOT NULL, `description` char ( 100 ) NOT NULL, `start` char ( 50 ) NOT NULL, `end` char ( 50 ) NOT NULL, `className` char(100) NOT NULL )");
		db.run("CREATE TABLE IF NOT EXISTS `mail` ( `mail_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `mail_username` TEXT NOT NULL, `mail_password` TEXT NOT NULL )");
		return db;
	};
	
	Sqlite3Helpers.prototype.getEvents = function (connection) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.serialize(function(){
				connection.all('SELECT id,title,description,start,end,className  FROM `events` ORDER BY id', function(err, rows){
					if (err) reject(err);
					resolve(rows);
				});
			});
		});
	};

	Sqlite3Helpers.prototype.addEvents = function (connection, event) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.serialize(function(){
				connection.run('INSERT INTO `events` (title, description, start, end, className) VALUES (?, ?, ?, ?, ?)' ,[event.title, event.description, event.start, event.end, event.className],  function(err, results){
					if (err) reject(err);
					resolve(results);
				});
			});
		});
	}; 

	Sqlite3Helpers.prototype.updateEvent = function (connection, event) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.serialize(function(){
				connection.run('UPDATE `events` SET title = ?, description= ?, start = ?, end = ?, className = ? WHERE id = ? ' ,[event.title, event.description, event.start, event.end, event.className.toString(), event.id], function(err, rows){
					if (err) reject(err);
					resolve(rows);
				});
			});
		});
	}; 

	Sqlite3Helpers.prototype.deleteEvent = function (connection, id) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.serialize(function(){
				connection.run('DELETE FROM `events` WHERE  id=' + id , function(err, rows){
					if (err) reject(err);
					resolve(rows);
				});
			});
		});
	};

	Sqlite3Helpers.prototype.getMailconfig = function (connection) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.serialize(function(){
				connection.all('SELECT mail_username,mail_password  FROM `mail` LIMIT 1', function(err, rows){
					if (err) reject(err);
					resolve(rows);
				});
			});
		});
	};
	
	Sqlite3Helpers.prototype.updateMailconfig = function (connection, config) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.serialize(function(){
				connection.run('UPDATE `mail` SET mail_username = ?, mail_password= ?', [config.mail_username, config.mail_password], function(err, rows){
					if (err) reject(err);
					resolve(rows);
				});
			});
		});
	};
	
	Sqlite3Helpers.prototype.addMailconfig = function (connection, config) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.serialize(function(){
				connection.run('INSERT INTO `mail` (mail_username, mail_password) VALUES (?, ?)', [config.mail_username, config.mail_password], function(err, rows){
					if (err) reject(err);
					resolve(rows);
				});
			});
		});
	};
	
	Sqlite3Helpers.prototype.close = function (connection) {
		connection.close();       
	};    
	return Sqlite3Helpers;
}());
exports.Sqlite3Helpers = Sqlite3Helpers;
