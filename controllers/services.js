const Service = require('../models/service');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });

module.exports.index = async (req,res,next) => {  // route to display all services
    const services = await Service.find({});
    res.render('Services/index', { services })
}

module.exports.renderNewForm = (req,res) => {  // route to serve form that will create new services
    res.render('Services/new')
}

module.exports.createService = async(req,res) => {  // route to post the newly created service
    
    const geoData = await geocoder.forwardGeocode({
        query: req.body.service.location,
        limit: 1
      }).send()
    const service = new Service(req.body.service);
    service.geometry = geoData.body.features[0].geometry;
    service.images = req.files.map(f => ({url:f.path, filename: f.filename}))
    service.author = req.user._id;
    await service.save();
    console.log(service);
    req.flash('success','Successfully Made A New Service');
    res.redirect(`/services/${service._id}`);
}

module.exports.serviceDetail =async (req,res) => { // route to display the details of a specific service
    const {id} = req.params
    const service = await Service.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    })
        .populate('author');
    if (!service) {
        req.flash('error', 'Cannot find that service')
        return res.redirect('/services')
    }
    res.render('Services/details', {service, id})
}

module.exports.renderEditForm = async (req,res) => {  // route to serve the edit form
    const {id } = req.params
    const service = await Service.findById(id)
    if (!service) {
        req.flash('error', 'Cannot find that service')
        return res.redirect('/services')
    }
    res.render('Services/edit', { id,service }) 
}

module.exports.updateService = async (req,res) => { // route to edit the service
    const { id } = req.params
    const service = await Service.findByIdAndUpdate( id, req.body.service )
    const imgs = req.files.map(f => ({url:f.path, filename: f.filename}))
    console.log(req.body)
    service.images.push(...imgs)
    await service.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await  cloudinary.uploader.destroy(filename)
        }
        await service.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
        console.log(service)
    }
    req.flash('success', 'Successfully Updated Service')
    res.redirect(`/services/${service._id}`)
}

module.exports.deleteService = async(req,res) => {
    const { id } = req.params
    await Service.findByIdAndDelete(id)
    req.flash('success', 'Successfully Deleted Service')
    res.redirect('/services')
}