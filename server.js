var express = require('express');
var app = express();
var session = require('express-session');
var FileStore = require('session-file-store')(session);



// Controllers
var mentorControl = require('./controllers/mentor.js');
var userControl = require('./controllers/user.js');
var studentControl = require('./controllers/student.js');
var hobbyControl = require('./controllers/hobby.js');

// Set port
app.set('port', (process.env.PORT || 5000));

// Body Parser
var bodyParser = require('body-parser');
app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// Static files
app.use(express.static(__dirname + '/public'));

// Middleware express session
app.use(require('morgan')('dev'));
app.use(session({
	name: 'server-session-cookie-id',
	secret: 'myExpressSecret',
	saveUninitialized: true,
  	resave: true,
  	store: new FileStore()
}));
app.use(function printSession(req, res, next) {
  console.log('req.session', req.session);
  return next();
});

// Heroku
// app.use(cookieParser(config.cookie_secret))
// app.use(sessions(config.redis_url, config.cookie_secret));
// var RedisStore = require('connect-redis')(expressSession);

// module.exports = function Sessions(url, secret) {
//   var store = new RedisStore({ url: url });
//   var session = expressSession({
//     secret: secret,
//     store: store,
//     resave: true,
//     saveUninitialized: true
//   });

//   return session;
// };

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
              
app.get('/', function(request, response) {
	
	if (request.session.user){
		response.redirect('main.html');
		
	}
	else{
		response.redirect('signIn.html');
	}
	

});

// GETS
app.get('/getMentors', mentorControl.handleMentors);
app.get('/getStudents', studentControl.handleStudents);
app.get('/getHobbies', hobbyControl.handleHobbies);
app.get('/getHobby', hobbyControl.handleHobby);
app.get('/logOut', logout);
app.get('/checkUser', checkUser)

// /getSingleStudent
// /getSingleMentor

// POSTS
app.post('/signUp', userControl.createUser);
app.post('/signUpMentor', mentorControl.signUpMentor);
app.post('/signIn', userControl.handleSignIn);
// /submitHobby
// /contactMentor
// /signUpForMentor
// /acceptStudent

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function logout(req, res) {
	console.log("logging out");
	req.session.destroy();
	res.redirect('signIn.html');
}

function checkUser(req, res) {
	if (req.session.user){
		console.log("user exists")
		res.redirect('main.html');
	}
	else{
		console.log("no user")
		res.redirect('signIn.html');
	}
}
