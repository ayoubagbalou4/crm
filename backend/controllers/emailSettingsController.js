const EmailSettings = require('../models/EmailSettings');



exports.saveSettings = async (req, res) => {
  try {
    const settings = await EmailSettings.findOne({ userId: req.user.id });
    if (!settings) {
      // Create default settings if none exist
      const newSettings = new EmailSettings({ userId: req.user.id });
      await newSettings.save();
      return res.json(newSettings);
    }
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateEmailSettings = async (req, res) => {
  const {
    notifications,
    reminders,
    template
  } = req.body;

  try {
    let settings = await EmailSettings.findOne({ userId: req.user.id });

    if (!settings) {
      settings = new EmailSettings({ userId: req.user.id });
    }

    if (notifications) {
      settings.notifications = {
        ...settings.notifications,
        ...notifications
      };
    }

    if (reminders) {
      settings.reminders = {
        ...settings.reminders,
        ...reminders
      };
    }

    if (template) {
      settings.template = {
        ...settings.template,
        ...template
      };
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};