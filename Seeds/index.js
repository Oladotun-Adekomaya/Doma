const axios = require('axios').default;
const mongoose = require('mongoose');
const Service = require('../models/service.js');
const {categories} = require('./seedHelpers')
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
    

const seedCity = function (cities,categories) {
    for (let index = 0; index < categories.length; index++) {
        const city = cities[index].city;
        const state = cities[index].state;
        return `${city}, ${state}`
        
    }
}



const fetchImage = async () => {
    try {
        const res = await axios.get('https://api.unsplash.com/photos/random/?client_id=MyvnyUHN1P4kH0zE-T73aVkzxbbPpDIpsgx36TyFYIo&count=1')
        image= res.data[0].urls.small
        return image
    } catch (error) {
        console.log('ERROR',error);
    }
}

index = 0

const seedDB = async () => {
    await Service.deleteMany({})
    for (const n of categories) {
        const city = cities[index].city;
        const state = cities[index].state
        const imageUrl = await fetchImage()
        const price = Math.floor(Math.random() * 20) + 10; 
        const service = new Service({
            title:`I will provide ${n} services for you`,
            image: imageUrl,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae voluptas, quasi consectetur dolore eius sit corporis autem facere et quae iure ipsum nulla harum magnam, perspiciatis sunt aperiam porro labore.' +
            'Eligendi dolor voluptas libero, repellat possimus, cum ut sapiente quisquam voluptatem fuga non et molestiae? Nulla nostrum laboriosam tempora, magnam molestias illum nemo tenetur cupiditate pariatur, voluptatum ratione, beatae aut?' +
            ' Quidem harum esse numquam odio similique aliquid, sequi officia voluptatibus rerum vitae iusto enim quia, minima architecto explicabo fuga sapiente dolores, mollitia ipsam dignissimos sint? Quisquam numquam dolores ad expedita.',
            category: `${n}`,
            location: `${city}, ${state}`,
            price,
            
        })
        service.save() 
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
