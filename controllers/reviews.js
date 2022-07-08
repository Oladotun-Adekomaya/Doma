const Review = require('../models/review');
const Service = require('../models/service.js');


module.exports.createReview = async (req,res) => {
    const service = await Service.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    service.reviews.push(review);
    await review.save();
    await service.save();
    req.flash('success', 'Created New Review!')
    res.redirect(`/services/${service._id}`);
}

module.exports.deleteReview = async (req,res) => {
    const { id, reviewId} = req.params;
    await Service.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // this removes the reference to the review from the service
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted Review')
    res.redirect(`/services/${id}`);
}