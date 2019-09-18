const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;

const jobSchema = new mongoose.Schema({
    userId: ObjectId,
    jobType: String,
    title: String,
    link: String,
    description: String,
    location: String,
    competency: [Number],
    projectDates: {
        projectStart: String,
        projectEnd: String
    },
    stillWorkHere: Boolean,
    referenceContact: String,
    company: String,
    technologies: [{
        type: String
    }]
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;