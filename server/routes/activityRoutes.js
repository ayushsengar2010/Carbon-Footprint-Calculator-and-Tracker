const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

const emissionFactors = {
  transportation: {
    car: 0.21,
    bus: 0.089,
    train: 0.041,
    flight: 0.255,
    bike: 0
  },
  electricity: {
    kwh: 0.92
  },
  food: {
    meat: 6.61,
    dairy: 1.35,
    vegetables: 0.43,
    grains: 0.76
  },
  waste: {
    landfill: 0.57,
    recycling: 0.21
  },
  water: {
    liter: 0.0003
  }
};

router.post('/', auth, async (req, res) => {
  try {
    const { type, category, amount, unit, description } = req.body;

    let carbonFootprint = 0;
    if (emissionFactors[type] && emissionFactors[type][category]) {
      carbonFootprint = amount * emissionFactors[type][category];
    }

    const activity = new Activity({
      userId: req.userId,
      type,
      category,
      amount,
      unit,
      carbonFootprint,
      description
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId }).sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId });

    const totalFootprint = activities.reduce((sum, activity) => sum + activity.carbonFootprint, 0);

    const byType = {};
    activities.forEach(activity => {
      if (!byType[activity.type]) {
        byType[activity.type] = 0;
      }
      byType[activity.type] += activity.carbonFootprint;
    });

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentActivities = activities.filter(a => new Date(a.date) >= last30Days);
    const monthlyFootprint = recentActivities.reduce((sum, activity) => sum + activity.carbonFootprint, 0);

    res.json({
      totalFootprint,
      byType,
      monthlyFootprint,
      activityCount: activities.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { type, category, amount, unit, description } = req.body;

    let carbonFootprint = 0;
    if (emissionFactors[type] && emissionFactors[type][category]) {
      carbonFootprint = amount * emissionFactors[type][category];
    }

    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { type, category, amount, unit, description, carbonFootprint },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, userId: req.userId });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, userId: req.userId });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await Activity.deleteOne({ _id: req.params.id });
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
