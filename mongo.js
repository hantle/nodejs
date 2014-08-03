var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var db, User, Post;

exports.connect = function() {
	mongoClient.connect('mongodb://127.0.0.1:27017/test',
			function(err,data) {
				if(err) throw err;
				db = data;
				User = db.collection('User');
                Post = db.collection('Post');
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

exports.addpost = function(value, callback) {
    Post.insert(value, function(err, item) {
        callback(err, item);
    });
};

exports.findPost = function(query, callback) {
    Post.find(query).sort({"createdDate":-1}).toArray(
            function(err, posts) {
                callback(err, posts);
            });
};

exports.findPostList = function(query, callback) {
};
