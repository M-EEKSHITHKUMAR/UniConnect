const Alumni = require('../models/Alumni');

const getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find().sort({ graduationYear: -1 });
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
    res.status(201).json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAlumni, createAlumni };