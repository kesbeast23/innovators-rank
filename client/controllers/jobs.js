const Job = require("../models/developers/Job"),
    mongoose = require('mongoose'),
    validator = require('validator'),
    axios = require('axios'),
    JobOffers = require("../models/Offer"),
    ObjectId = mongoose.Types.ObjectId;
/**
 * GET /
 * Jobs page.
 */
exports.getJobs = (req, res) => {
    JobOffers.find({})
        .sort({
            createdAt: -1
        })
        .exec((err, jobs) => {
            if (err) return res.send(err);
            res.render('jobs', {
                title: 'Jobs',
                jobs
            });
        });
};

exports.getJob = (req, res) => {
    console.log(1, req.params.id, req.query.id, req.body.id)
    JobOffers.findOne({
            _id: new ObjectId(req.params.id)
        })
        .sort({
            createdAt: -1
        })
        .exec((err, job) => {
            if (err) return res.send(err);
            res.render('user/job', {
                title: 'Job - ' + job.name,
                job
            });
        });
};

exports.getAddJob = (req, res) => {
    res.render('admin/add_job', {
        title: 'Add Job'
    });
};

exports.postJob = (req, res, next) => {
    // const validationErrors = [];
    // if (validator.isEmpty(req.body.titleAW)) validationErrors.push({
    //     msg: 'Please enter a valid title.'
    // });
    // if (validator.isEmpty(req.body.companyAW)) validationErrors.push({
    //     msg: 'Please enter a valid company.'
    // });
    // if (validationErrors.length) {
    //     req.flash('errors', validationErrors);
    //     return res.redirect('/account');
    // }
    const job = new Job({
        title: req.body.titleAW,
        userId: new ObjectId(req.user._id),
        company: req.body.companyAW,
        location: req.body.locationAW,
        referenceContact: req.body.referenceContact,
        technologies: req.body.technologies,
        projectDates: {
            projectStart: req.body.projectStart,
            projectEnd: Boolean(req.body.stillWorkHere) ? null : req.body.projectStart
        },
        stillWorkHere: Boolean(req.body.stillWorkHere)
    });

    job.save((err) => {
        if (err) {
            return next(err);
        }

        req.flash('success', {
            msg: 'Jobs updated.'
        });
        res.redirect("/account");

        axios.post('http://locahost:6666', {
            technologies: job.technologies
        }).then(function (response) {
            job.update({
                "competency": response
            });
        }).catch(function (error) {
            req.flash('erros', {
                msg: 'Failed to Rank Project'
            });
        });

    });
};