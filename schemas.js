const joi = require('joi')
module.exports.serviceSchema = joi.object({
    service: joi.object({
        title:joi.string().required(),
        price:joi.number().required().min(1),
        //image:joi.string().required(),
        location:joi.string().required(),
        description:joi.string().required(),
    }).required(),
    deleteImages: joi.array()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        text: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    }).required()
})
