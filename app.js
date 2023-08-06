
var express=require("express");
var bodyParser=require("body-parser");
var cors = require('cors');
var path = require ('path');
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app);
const io = socketio(server);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gfg');
const PORT = 3000;


var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})
 
var app=express()
app.use(cors())
 
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '../public')));



app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
 
app.post('/formFillUp', function(req,res){
    var name = req.body.name;
    var message = req.body.message;
 
    var data = {
        "name": name,
        "message":message,
    }
db.collection('details').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
             
    });
         
    res.render('index', {
        show_modal: true
    });
})
 
 
app.get('/',function(req,res){
res.set({
    'Access-control-Allow-Origin': '*'
    });
    res.render('index', {
        show_modal: false
    });

});


app.get('/tree',function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
        });
        res.render('tree', {
      
        });
    
});
 
app.listen(PORT, () => console.log(`Hello world app listening on port ${PORT}!`));
console.log("server listening at port 3000");