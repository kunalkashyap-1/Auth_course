require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const saltRound = 10;
// const encrypt = require("mongoose-encryption");
// const md5=require("md5");
const bcrypt = require("bcrypt");

const app = express();


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27020/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/logout", (req, res) => {
    res.render("home");
});

app.get("/submit", (req, res) => {
    res.render("submit");
})

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRound, (err, hash)=>{
        if(err){
            console.log(err);
        }
        if(hash){
        const newUser = new User({
            email: req.body.username,
            // password:md5(req.body.password)
            password:hash
        });

        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    }});

});

app.post("/login", (req, res) => {
    const username = req.body.username;
    // const password = req.body.password;
    const password = req.body.password;
    // const password = md5(req.body.password);
    User.findOne({ email: username }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result) {
                bcrypt.compare(password,result.password,(err,result)=>{
                    if(result){
                        res.render("secrets");
                    }
                    else{
                        console.log(err);
                    }
                }) 
            }
        }
    });
});

app.post("/submit", (req, res) => {
    res.send("hoga abhi database se integrate hoga");
});


app.listen(8383, () => {
    console.log("server running on port 8383");
});