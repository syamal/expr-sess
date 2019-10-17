'use strict';

const express = require('express');
var app       = express();

var session   = require('express-session');
const uuid = require('uuid');

const PORT = 3000;

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  genid: function(req) {
    return uuid() // use UUIDs for session IDs
  },
  name: 'session_id',
  secret: 'random secret',
  resave: false,
  saveUninitialized: true,
  cookie: {httpOnly: false}
}))

// Regular routes
app.get("/",function(req,res){
    if(req.session.counter === undefined) {
        req.session.counter = 1;
    } else {
        req.session.counter++
    }
    req.session.msg = 'Homepage Visited : '+req.session.counter+' time(s)';
    res.sendFile(__dirname + '/index.html');
});

app.get("/end/:id",function(req,res){
    //console.log(req.params.id);

    //var session_data = req.session;

    var session_data = new Object(
        {
            session_id: req.params.id,
            data: req.session
        });

    //console.log(session_data);
    var html_message;

    if(req.session.msg !== undefined) {
        html_message = `<p> Session ID: `+ req.params.id +` </p>
                        <p>`+ req.session.msg +`</p>                        
                        <p>Session ended!</p>`
    } else {
        html_message = `<p>No Session Data!</p>`
    }

    var html_output = `<!DOCTYPE html>
                    <html>
                    <head>
                        <title>End</title>
                    </head>
                    <body>
                        <h3><u> Session Data </u> </h3>
                        `+html_message+`
                        <button onclick="redirect()"> Back to Homepage </button>
                    </body>
                    <script type="text/javascript"> 
    
                        function redirect() {       
                            location.replace("http://localhost:3000/")
                        }

                    </script>

                    </html>`;
    
    req.session.destroy(() => {
      res
        .clearCookie('session_id', {
          path: '/',
          httpOnly: false,
        }).send(html_output);     
    });
    
});

var server = app.listen(PORT, () => {
    console.log('Server runs on port ' + PORT + "!");
});


