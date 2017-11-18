
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var morgan = require('morgan');
var mongojs = require('mongojs');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');


var port = process.env.PORT || config.port;
var hostname = config.hostname;
mongoose.connect(config.database);
var db = mongojs('mongodb://kittiya:450550@ds251845.mlab.com:51845/adv405', ['user']);

//mongodb://<dbuser>:<dbpassword>@ds251845.mlab.com:51845/adv405

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    db.user.find(function (err, users) {
        if (err) {
            console.error(err);
        }
        res.render('index', {
            title: 'Welcome',
            users: users

        });
        
    });
});

app.get('/user', function (req, res) {
    db.user.find((err, users) => {
        if (err) throw err;
        res.json(users);
    });
});

  
app.get('/user/:id',function (req, res){
    var id = parseInt(req.params.id);
    db.user.findOne({id: id}, function(err, doc) {
        if (doc) {
            res.json(doc);
        } 
        else {
            res.json({ status: false });
        }
    });
});

app.post('/user', (req, res) => {
    db.user.count(function (err, num){
        if(num!=0){
    //db.user.find().toArray(function (err, results) {
            db.user.find().sort({id: -1}).limit(1).toArray(function(err1,num1){
            var newUsers = {
                id : num1[0]['id'] + 1,
                name: req.body.name,
                age: parseInt(req.body.age),
                email: req.body.email
                }
                db.user.insert(newUsers, function(err, result) {
                if(err){
                console.log(err);
                }
                res.redirect('/');
                console.log('New user has beed added.')
                });

            });
        }
        else{
            var newUsers = {
                id : 1,
                name: req.body.name,
                age: parseInt(req.body.age),
                email: req.body.email
                }
                db.user.insert(newUsers, function(err, result) {
                if(err){

                console.log(err);
                }
                res.redirect('/');
                console.log('New user has beed added.')
                });
        } 
    });  
});

app.put('/user/:id',(req ,res)=>{
    var id = parseInt(req.params.id);
    db.user.findOne({id: id}, function(err, result) {
        if (err){
            console.log(err);
        } 
        else {
            var updateUsers = {
                id : parseInt(req.params.id),
                name: req.body.name,
                age: parseInt(req.body.age),
                email: req.body.email
            }
            db.user.update({id:id},updateUsers, function(err, result) {
                if(err){
                console.log(err);
                }
                res.redirect('/');
                console.log(' user has beed update.')
                });
        }
    });
            
            
        
           //res.json({ status: false });
        
    
});

app.delete('/user/:id',(req ,res)=>{
    var id = parseInt(req.params.id);
    db.user.findOne({id: id}, function(err, doc) {
        db.user.remove({id},function(err,obj){
            if(err){
                console.log(err);
                }
                res.redirect('/');
                console.log(' user has beed delete.');
                });
        });
});


app.listen(port, hostname, function () {
    console.log('Simple API started at http://localhost:' + port);
});
