const express = require('express');  // Requiring express
const path = require('path');  
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Service = require('./models/service.js');



mongoose.connect('mongodb://localhost:27017/doma',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connection established"))
    .catch((e) => {
        console.log('MongoDB connection failed')
        console.log(e)
    })   

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// })

const app = express()

app.engine('ejs',ejsMate)

app.set('views', path.join(__dirname, 'views'));  // this deals with any path issue
app.set('view engine', 'ejs');  // Setting the view engine to ejs

app.use(express.urlencoded({ extended: true}));  // this tells express to parse the body of the url sent by the post request 
app.use(methodOverride('_method'));



app.get('/services', async (req,res) => {  // route to display all services
    const services = await Service.find({});
    res.render('Services/index', { services })
})

app.get('/services/new', (req,res) => {  // route to serve form that will create new services
    res.render('Services/new')
})

app.post('/services', async(req,res) => {  // route to post the newly created service
    const service = new Service(req.body.service) 
    await service.save()
    res.redirect(`/services/${service._id}`)
})


app.get('/services/:id', async (req,res) => { // route to display the details of a specific service
    const {id} = req.params
    const service = await Service.findById(id);
    res.render('Services/details', {service, id})
})

app.get('/services/:id/edit', async (req,res) => {  // route to serve the edit form
    const {id } = req.params
    const service = await Service.findById(id)
    res.render('Services/edit', { id,service }) 
})

app.put('/services/:id', async (req,res) => { // route to edit the entry
    const { id } = req.params
    console.log(req.body.service)
    const service = await Service.findByIdAndUpdate(id,{...req.body.service})
    res.redirect(`/services/${service._id}`)
})

app.delete('/services/:id', async(req,res) => {
    const { id } = req.params
    await Service.findByIdAndDelete(id)
    res.redirect('/services')
})

app.listen(3000, () => {  // listening on port 3000
    console.log('Serving on port 3000')
})