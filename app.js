if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
 
const User = require("./models/user.js");


const reviewRouter= require("./routes/review.js");
const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

const dbURL = process.env.ATLASDB_URL;


main().then(() =>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
})

async function main(){
   await mongoose.connect(dbURL)
};

app.set("view engine",  "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto:{
    secret : process.env.SECRET,
  },
  touchAfter : 24*3600,
});

store.on("error" , () =>{
  console.log("Error in MONGO SESSION STORE", err);
})

const sessionOption ={
  store,
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1 *1 * 60 *60 * 1000,
    maxAge: 1 *1 * 60 *60 * 1000,
    httpOnly: true,
  },
};


app.get("/" , (req, res) =>{
  res.redirect("/listings/home");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter); 

// app.get("/demouser", async(req, res) =>{
//   let fakeUser = new User({
//     email:"some@example.com",
//     username: "someusername"
//   });

//   let registeredUser =await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// })


// app.get("/testListing" , async (req, res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 2500,
//         location: "Miami, Florida",
//         country: "USA",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");

// });


// app.use((err, req, res,next) =>{
//   let {status=500, message="Something went wrong"} = err;
//   res.status(status).render("error.ejs", {message});
//   // res.status(status).send(message);
//   // res.send("something went wrong..!");
// })



app.listen(8080, () =>{
    console.log("listening on port 8080");
});
