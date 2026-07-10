const Club = require('../models/Club');
const { cacheGet, cacheSet, cacheDelete } = require('../services/otpService');

const CLUBS_CACHE_KEY='all_clubs';

const getClubs = async (req, res) => {
  try {
    const cached=await cacheGet(CLUBS_CACHE_KEY);
    if(cached){
      console.log('Clubs served from Redis cache');
      return res.json(cached);
    }
    const clubs = await Club.find().sort({ name: 1 });
    await cacheSet(CLUBS_CACHE_KEY, clubs,600);
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createClub = async (req, res) => {
  try {
    const { name, description, contactEmail, contactPhone } = req.body;
    const club = await Club.create({ name, description, contactEmail, contactPhone });
    await cacheDelete(CLUBS_CACHE_KEY);
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getClubs, createClub };