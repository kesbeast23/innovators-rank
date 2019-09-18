const Job = require("../models/developers/Job"),
    mongoose = require('mongoose'),
    validator = require('validator'),
    axios = require('axios');
    ObjectId = mongoose.Types.ObjectId;
/**
 * GET /
 * Jobs page.
 */
exports.getJobs = (req, res) => {
    res.render('jobs', {
        title: 'Jobs'
    });
};

exports.getJob = (req, res) => {
    res.render('job', {
        title: 'Job - '
    });
};

exports.getAddJob = (req, res) => {
    res.render('admin/add_job', {
        title: 'Add Job'
    });
};

exports.postJob = (req, res, next) => {
    const validationErrors = [];
    if (validator.isEmpty(req.body.jobName)) validationErrors.push({
        msg: 'Please enter a valid name.'
    });
    if (validator.isEmpty(req.body.jobTitle)) validationErrors.push({
        msg: 'Please enter a valid title.'
    });
    if (validator.isEmpty(req.body.companyAW)) validationErrors.push({
        msg: 'Please enter a valid company.'
    });

    if (validationErrors.length) {
        req.flash('errors', validationErrors);
        return res.redirect('/account');
    }

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
            job.update({"competency": response});
        }).catch(function (error) {
            req.flash('erros', {
            msg: 'Failed to Rank Project'
            });
        });

    });
};