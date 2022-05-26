const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    title:String,
    image:String,
    description:String,
    category:String,
    location: String, 
    price:Number,  
})

module.exports = mongoose.model('Service',ServiceSchema); 