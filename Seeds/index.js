const axios = require('axios').default;
const mongoose = require('mongoose');
const Service = require('../models/service.js');
const {hotels} = require('./seedHelpers')
const { cities } = require('./cities')


mongoose.connect('mongodb://localhost:27017/doma',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connection established"))
    .catch((e) => {
        console.log('MongoDB connection failed')
        console.log(e)
    }) 
    

index = 0

const seedDB = async () => {
    await Service.deleteMany({})
    for (const hotel of hotels) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1000) + 10; 
        const service = new Service({
            author:'62bac6a0d78e8c3a3237b820',
            title:`${hotel}`,
            images:  [
                {
                  url: 'https://res.cloudinary.com/dotuncloud/image/upload/v1657784487/Doma/adriana-saraceanu-_ixNdO62FSg-unsplash_xdzdbw.jpg',
                  filename: 'Doma/adriana-saraceanu-_ixNdO62FSg-unsplash_xdzdbw.jpg'
                },
                {
                  url: 'https://res.cloudinary.com/dotuncloud/image/upload/v1657784529/Doma/the-anam-XA6vchunFJk-unsplash_cbxbdq.jpg',
                  filename: 'Doma/the-anam-XA6vchunFJk-unsplash_cbxbdq'
                }
              ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae voluptas, quasi consectetur dolore eius sit corporis autem facere et quae iure ipsum nulla harum magnam, perspiciatis sunt aperiam porro labore.',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            price,
            geometry: {
                type : "Point", 
                coordinates : [
                     cities[random1000].longitude, 
                     cities[random1000].latitude 
                    ] }    
        })
        await service.save() 
        index++
    }
}
seedDB()//.then(() => {
 //   mongoose.connection.close()  //  this is to close the connection with the db
//})

// for (const n of categories) {
//     a = seedCity(cities,categories)
//     console.log(a);
// }  

// fetch('https://api.unsplash.com/photos/random/?client_id=MyvnyUHN1P4kH0zE-T73aVkzxbbPpDIpsgx36TyFYIo&count=1')
// .then(response => response.json())
// .then(data => console.log(data));


// // How to use FETCH()
// fetch(url)
//     .then(res => {
//         console.log("RESOLVED",res)
//         return res.json()
//     })
//     .then((data) => {
//         console.log(data)
//         return fetch(url2) // to make another req after the first req
//     })
//     .then(res => console.log('SECOND REQ',res.json())) // for second req
//     .then(data => console.log(data)) // for second req
//     .catch(e => console.log('ERROR',e))

//     // To make the above code look cleaner, we can use an async funtion

//     const fetchData = async () =>{
//       try {
//         const res = await fetch(url)
//         const data = await res.json
//         console.log(data)
//         const res2 = await fetch(url2)
//         const data2 = await res2.json
//         console.log(data2)
//       } catch (error) {
//          console.log(error); 
//       }
//     };