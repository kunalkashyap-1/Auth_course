require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const saltRound = 10;
// const encrypt = require("mongoose-encryption");
// const md5=require("md5");
// const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret:process.env.SECRETSTRING,
    resave:false,
    saveUninitialized:false,
    // cookies:{secure:true}
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27020/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId:String,
    secret:String
});

// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8383/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));



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
    req.logout((err)=>{
        if(err){
        console.log(err);
        }
    });
    res.redirect("/");
});

app.get("/submit", (req, res) => {
    if(req.isAuthenticated()){
        res.render("submit");
    }else{
        res.redirect("/login");
    }
})

app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        User.find({secret:{$ne:null}},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                if(result){
                    res.render("secrets",{userWithSecrets:result});
                }
            }
        });
    }else{
        res.redirect("/login");
    }
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });

// app.post("/register", (req, res) => {
//     bcrypt.hash(req.body.password, saltRound, (err, hash)=>{
//         if(err){
//             console.log(err);
//         }
//         if(hash){
//         const newUser = new User({
//             email: req.body.username,
//             // password:md5(req.body.password)
//             password:hash
//         });

//         newUser.save((err) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 res.render("secrets");
//             }
//         });
//     }});

// });

// app.post("/login", (req, res) => {
//     const username = req.body.username;
//     // const password = req.body.password;
//     const password = req.body.password;
//     // const password = md5(req.body.password);
//     User.findOne({ email: username }, (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//             if (result) {
//                 bcrypt.compare(password,result.password,(err,result)=>{
//                     if(result){
//                         res.render("secrets");
//                     }
//                     else{
//                         console.log(err);
//                     }
//                 }) 
//             }
//         }
//     });
// });

app.post("/register",(req,res)=>{
    User.register({username:req.body.username},
    req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets"); 
            })
        }
    })
});

app.post("/login",(req,res)=>{
    const user = new User({
        username:req.body.username,
        password:req.body.password
    });

    req.login(user,(err)=>{
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets");
            })
        }
    })
});

app.post("/submit", (req, res) => {
    const submittedSecret = req.body.secret;
    User.findById(req.user.id,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result){
                result.secret= submittedSecret;
                result.save(()=>{
                    res.redirect("/secrets");
                });
            }
        }
    });
});


app.listen(8383, () => {
    console.log("server running on port 8383");
});