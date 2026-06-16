const CustomPaymentLink = require('../models/customPaymentLink.model');
const emailService = require('../services/email.service');

exports.getAll = async (req, res) => {
  try {
    const data = await CustomPaymentLink.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await CustomPaymentLink.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { email, publicLinkUrl, ...linkData } = req.body;
    const newData = new CustomPaymentLink(linkData);
    const savedData = await newData.save();

    if (email && publicLinkUrl) {
      // Append the actual ID to the base URL
      const fullUrl = `${publicLinkUrl}/${savedData._id}`;
      await emailService.sendCustomPaymentLinkEmail(email, savedData, fullUrl);
    }

    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedData = await CustomPaymentLink.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedData) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedData = await CustomPaymentLink.findByIdAndDelete(req.params.id);
    if (!deletedData) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
