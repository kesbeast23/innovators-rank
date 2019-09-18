const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    // userId: ObjectId,
    attachments: [{
        link: String
    }],
    industry: String,
    jobType: String,
    link: String,
    description: String,
    applyBy: Date,
    client: String,
    skillsRequired: String
}, {
    timestamps: true
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;