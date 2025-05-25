const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    username: { type: String, required: true },
    code: { type: String, default: "" }
});

module.exports = mongoose.model('Code', CodeSchema);
