//express is the framework we're going to use to handle requests
const express = require('express')
//Create a new instance of express
const app = express()

//Access the connection to Heroku Database
const pool = require('./utilities').pool

let middleware = require('./middleware')

/*
 * This middleware function parses JASOn in the body of POST requests
 */
app.use(express.json())

/*
 * This middleware function will respond to improperly formed JSON in 
 * request parameters.
 */
app.use(middleware.jsonErrorInBody)

app.use('/sendResetVerify', require('./routes/email_verif/sendResetVerify.js'))
app.use('/resetVerify', require('./routes/email_verif/resetVerify.js'))
app.use('/changePassword', require('./routes/password/changePassword.js'))
app.use('/resetPassword', require('./routes/password/resetPassword.js'))
app.use('/changeNickname', require('./routes/changeNickname.js'))
app.use('/getNickname', require('./routes/getNickname.js'))
app.use('/verify', require('./routes/email_verif/verify.js')) // GET Request to verify email
app.use('/auth', require('./routes/signin.js')) // GET Request to sign in a user
app.use('/auth', require('./routes/register.js')) // POST Request to sign up a user
app.use('/friendsList',require("./routes/friendsList.js"))
app.use('/search',require("./routes/search.js"))

app.use('/messages', middleware.checkToken, require('./routes/messages.js')) // Create and Retrieve Chat Messages
app.use('/chats', middleware.checkToken, require('./routes/chat.js')) // Create and Retrieve Chat Rooms
app.use('/auth', middleware.checkToken, require('./routes/pushyregister.js')) //accept Pushy Tokens

//Weather
app.use('/weather', require('./routes/weather/5DayWeather.js'))
app.use('/currentWeather', require('./routes/weather/currentWeather.js'))
app.use('/5DayWeather', require('./routes/weather/5DayWeather.js'))

/*
 * Return HTML for the / end point. 
 * This is a nice location to document your web service API
 * Create a web page in HTML/CSS and have this end point return it. 
 * Look up the node module 'fs' ex: require('fs');
 */
app.get("/", (request, response) => {

    //this is a Web page so set the content-type to HTML
    response.writeHead(200, {'Content-Type': 'text/html'});
    for (i = 1; i < 7; i++) {
        //write a response to the client
        response.write('<h' + i + ' style="color:blue">Hello World TEST 2!</h' + i + '>'); 
    }
    response.end(); //end the response
});

/*
 * Serve the API documentation generated by apidoc as HTML. 
 * https://apidocjs.com/
 */
app.use("/doc", express.static('apidoc'))

/* 
* Heroku will assign a port you can use via the 'PORT' environment variable
* To access an environment variable, use process.env.<ENV>
* If there isn't an environment variable, process.env.PORT will be null (or undefined)
* If a value is 'falsy', i.e. null or undefined, javascript will evaluate the rest of the 'or'
* In this case, we assign the port to be 5000 if the PORT variable isn't set
* You can consider 'let port = process.env.PORT || 5000' to be equivalent to:
* let port; = process.env.PORT;
* if(port == null) {port = 5000} 
*/ 
app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 5000));
});