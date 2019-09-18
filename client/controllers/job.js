const Offer = require("../models/offer"),
    mongoose = require('mongoose'),
    validator = require('validator'),
    axios = require('axios');
    ObjectId = mongoose.Types.ObjectId;

exports.getAddJob = (req, res) => {
    res.render('/job_offer', {
        title: 'Add Offer'
    });
};

exports.postOffer = (req, res, next)  => {

    const offer = new Offer({
        title: req.body.titleAW,
        name: req.body.jobName,
        client: req.body.companyAW,
        industry: req.body.industry,
        description: req.body.jobDescription,
        skillsRequired: req.body.skillsRequired,
        applyBy: req.body.applicationDeadline,
    });

    offer.save((err) => {
        if(err) {
            return next(err);
        }

        req.flash('sucess', {
            msg: 'Jobs updated.'
        });
        res.redirect("/jobs");
    });
};

