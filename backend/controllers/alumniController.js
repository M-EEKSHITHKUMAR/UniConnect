const Alumni = require('../models/Alumni');
const { cacheGet, cacheSet, cacheDelete } = require('../services/otpService');

const ALUMNI_CACHE_KEY='all_alumni';
const getAlumni = async (req, res) => {
  try {
    const cached=await cacheGet(ALUMNI_CACHE_KEY);
    if(cached) {
      console.log('Alumni served from Redis cache');
      return res.json(cached);
    }
    const alumni = await Alumni.find().sort({ graduationYear: -1 });
    await cacheSet(ALUMNI_CACHE_KEY, alumni, 600);
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAlumni = async (req, res) => {
  try {
    const { name, email, phone, graduationYear, currentRole, company, department } = req.body;
    const alumni = await Alumni.create({
      name, email, phone, graduationYear, currentRole, company, department,
    });
    await cacheDelete(ALUMNI_CACHE_KEY);
    res.status(201).json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAlumni, createAlumni };