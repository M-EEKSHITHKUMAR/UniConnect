const Club = require('../models/Club');


const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ name: 1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createClub = async (req, res) => {
  try {
    const { name, description, contactEmail, contactPhone } = req.body;
    const club = await Club.create({ name, description, contactEmail, contactPhone });
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getClubs, createClub };