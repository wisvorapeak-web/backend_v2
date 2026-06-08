const TeamMember = require('../models/teammember.model');

exports.getAll = async (req, res) => {
  try {
    const data = await TeamMember.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await TeamMember.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newData = new TeamMember(req.body);
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedData = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedData) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedData = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deletedData) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
