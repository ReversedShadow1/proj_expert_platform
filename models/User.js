const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: { type: String, unique: true },
    birthdate: Date,
    password: String,
    role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
    isExpert: { type: Boolean, default: false },
    professionalDocs: [String],  // Proof documents for becoming an expert
    skills: [String],            // List of skills (for experts)
    description: String,
    location: String,
    availability: Boolean
});

module.exports = mongoose.model('User', userSchema);
