const SiteContent = require('../models/sitecontent.model');

exports.getBySection = async (req, res) => {
  try {
    const data = await SiteContent.findOne({ section: req.params.section });
    if (!data) return res.status(200).json(null); // Return null if not found, let frontend handle defaults
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBySection = async (req, res) => {
  try {
    const section = req.params.section;
    const { data } = req.body;
    
    // Upsert: update if exists, insert if it doesn't
    const updatedData = await SiteContent.findOneAndUpdate(
      { section },
      { section, data },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
