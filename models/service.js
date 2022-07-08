const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')


const ImageSchema = new Schema({
    url: String,
    filename: String   
});

ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_200,h_200');
});

const ServiceSchema = new Schema({
    title:String,
    images:[ImageSchema],
    description:String,
    category:String,
    location: String, 
    price:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})


// This is the middleware to delete all the reviews alongside the service
ServiceSchema.post('findOneAndDelete', async function (doc){
    if (doc) {
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Service',ServiceSchema); 