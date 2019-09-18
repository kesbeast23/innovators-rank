const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const applicationSchema = new mongoose.Schema({
    userId: ObjectId,

}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;