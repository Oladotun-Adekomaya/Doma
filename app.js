if (process.env.NODE_ENV  !==  "production") {
    require('dotenv').config()
}
const express = require('express');  // Requiring express
const path = require('path');  
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user')

const MongoStore = require('connect-mongo');

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/doma';
const dbUrl = 'mongodb://localhost:27017/doma';

mongoose.connect( dbUrl ,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connection established"))
    .catch((e) => {
        console.log('MongoDB connection failed');
        console.log(e);
    });




const userRoutes = require('./routes/users')
const serviceRoutes = require('./routes/services');
const reviewRoutes = require('./routes/reviews');



const app = express()

app.engine('ejs',ejsMate)

app.set('views', path.join(__dirname, 'views'));  // this deals with any path issue
app.set('view engine', 'ejs');  // Setting the view engine to ejs

app.use(express.urlencoded({ extended: true}));  // this tells express to parse the body of the url sent by the post request 
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SESSION_SECRET || 'thisisasecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})




const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
} 

app.use(session(sessionConfig));
app.use(flash());





app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy())
//  passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next) =>{
    res.locals.user = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    //console.log(req.session)
    next()
})


app.use('/', userRoutes)
app.use('/services', serviceRoutes)
app.use('/services/:id/reviews', reviewRoutes)

app.get('/',(req,res) =>{
    res.redirect('/services')
})




app.all('*', (req,res,next) =>{ // for all types of request, for all routes
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next) => {      // Error handler
    if(!err.message)err.message = 'Something went wrong'
    res.render('error',{err})
})

const port = process.env.PORT || 3000

app.listen(port, () => {  // listening on port 3000
    console.log(`Serving on port ${port}`)
})


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://dotunolly:<password>@cluster0.o9exbyl.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
