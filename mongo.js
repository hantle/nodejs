var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var db, User;

exports.connect = function() {
	mongoClient.connect('mongodb://127.0.0.1:27017/test',
			function(err,data) {
				if(err) throw err;
				db = data;
				User = db.collection('User');
				console.log('db connected');
			});

	/*
	   // Query
	   User.find({}).toArray(function(err, items) {
	       console.log(items);
	   });

	   // Update
	   User.update({username:"admin2"}, {$set: {password:"admin3"}}, 
	           function(err, success) {
			       console.log(success);
			   }
	   );

	   // Insert
	   User.insert({username:"admin2", password:"admin2"},
	           function(err, item) {
			       console.log(item);
			   }
	   );
   */
};

exports.findOneUser = function(query, callback) {
	User.findOne(query, function(err, item) {
		callback(item);
	});
};
