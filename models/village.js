const mongoose = require("mongoose");

const villageSchema = new mongoose.Schema({
    villageName: {
        type: String,
        required: true
    },
    population: {
        type: Number,
        required: true
    },
    houses: {
        type: Number,
        required: true
    },
    schools: {
        type: Number,
        required: true
    },
    hospitals: {
        type: Number,
        required: true
    },
    roads: {
        type: Number,
        required: true
    },
    waterTanks: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Village", villageSchema);