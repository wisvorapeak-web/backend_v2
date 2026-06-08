const VenueGallery = require('../models/venueGallery.model');

exports.getAll = async (req, res) => {
  try {
    const data = await VenueGallery.find().populate('venueId');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByVenueId = async (req, res) => {
  try {
    const data = await VenueGallery.find({ venueId: req.params.venueId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newData = new VenueGallery(req.body);
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedData = await VenueGallery.findByIdAndDelete(req.params.id);
    if (!deletedData) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
