const Job = require("../models/Job"),
    mongoose = require('mongoose'),
    validator = require('validator'),
    axios = require('axios');
    ObjectId = mongoose.Types.ObjectId;

exports.getAddJob = (req, res) => {
    res.render('/job_offer', {
        title: 'Add Job'
    });
};

exports.postOffer = (req, res, next)  => {

    const offer = new Job({
        title: req.body.titleAW,
        name: new ObjectId(req.body.jobName),
        client: req.body.companyAW,
        industry: req.body.industry,
        description: req.body.jobDescription,
        skillsRequired: req.body.technologies,
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

