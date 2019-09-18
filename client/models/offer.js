const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const offerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    // userId: ObjectId,
    attachments: [{
        link: String
    }],
    industry: [{
        type: String
    }],
    jobType: String,
    link: String,
    description: String,
    applyBy: String,
    client: String,
    skillsRequired: [{
        type: String
    }]
}, {
    timestamps: true
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;