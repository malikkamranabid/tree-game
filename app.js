
var express=require("express");
var bodyParser=require("body-parser");
var cors = require('cors');
var path = require ('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/clientdb');
const PORT = process.env.PORT || 5001;


var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})
 

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


app.get('/treedata',async function(req,res){
    const tasks = await db.collection("details").find({}).toArray();
    res.status(200).json(tasks);
});


io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('submit', message => {
        io.emit('load', message)
    })
})
 

server.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`);
});