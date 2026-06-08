const FailedPayment = require('../models/failedpayment.model');

exports.getAll = async (req, res) => {
  try {
    const data = await FailedPayment.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await FailedPayment.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newData = new FailedPayment(req.body);
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedData = await FailedPayment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedData) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedData = await FailedPayment.findByIdAndDelete(req.params.id);
    if (!deletedData) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
