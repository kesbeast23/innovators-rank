const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    userId: ObjectId,
    link: String,
    description: String,
    projectCompletionDate: Date,
    client: String,
    clientRating: Number,
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;