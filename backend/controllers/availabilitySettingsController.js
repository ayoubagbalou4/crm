const express = require('express');
const AvailabilitySettings = require('../models/AvailabilitySettings'); // make sure path is correct

// Get settings
const getSettings = async (req, res) => {
  try {
    const settings = await AvailabilitySettings.findOne({ userId: req.user.id });

    if (!settings) {
      const newSettings = await AvailabilitySettings.create({
        userId: req.user.id
      });
      return res.json(newSettings);
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const updatedSettings = await AvailabilitySettings.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true, upsert: true } 
    );

    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSettings, updateSettings };
