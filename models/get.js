// Model for getting the mentors from the database
// Postgres
var pg = require('pg');
// const connectionString = "postgres://postgres:postgres@localhost:5432/hobbyspotdb";
const connectionString = process.env.DATABASE_URL;

function getAllMentors(hobby,callback) {
		
		//for connecting to heroku database
		pg.defaults.ssl = true;
		pg.connect(connectionString, function(err, client) {
  			if (err){
  				console.log("Error: Could not connect to DB");
				console.log(err);
				callback(err,null);
  			} 

  			console.log('Connected to postgres! Getting schemas...');
    		console.log("finding mentors for %s", hobby);

			var sql = "SELECT u.first, u.last, l.town, hm.mentor_id, h.name, hm.greeting FROM _user u \
				JOIN hobby_mentor hm ON u.id = hm.mentor_id \
				JOIN hobby h ON h.id = hm.hobby_id \
				JOIN location l ON u.location_id = l.id \
				WHERE h.name = $1 ;"

			var params = [hobby];

			var query = client.query(sql, params, function(err, result) {

				client.end(function(err) {
					if (err) throw err;
				});

				if (err) {
					console.log("Error in query: ")
					console.log(err);
					callback(err, null);
				}

				console.log("Results: " + JSON.stringify(result.rows));
				callback(null, result.rows);
			});

		});

	   //  var client = new pg.Client(connectionString);

				// client.connect(function(err) {

				// 	if (err) {
				// 		
				// 	}

				// })
		
		
}

module.exports = {
		getAllMentors: getAllMentors
}