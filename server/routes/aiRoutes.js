const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

let genAI;
let model;
if (process.env.GEMINI_API_KEY && 
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
    process.env.GEMINI_API_KEY.trim() !== '') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
}

router.post('/recommendations', auth, async (req, res) => {
  try {
    if (!model) {
      return res.json({ 
        recommendations: `AI recommendations are currently unavailable. To enable this feature, please add your Gemini API key to the .env file.

Here are some general tips to reduce your carbon footprint:

1. Use public transportation, bike, or walk instead of driving alone
2. Reduce energy consumption by turning off lights and unplugging devices
3. Choose plant-based meals more often to lower food emissions
4. Recycle and compost to minimize waste sent to landfills
5. Use water efficiently and fix any leaks in your home

Visit the Statistics page to see your detailed carbon footprint breakdown!`
      });
    }

    const activities = await Activity.find({ userId: req.userId }).limit(20).sort({ date: -1 });

    if (activities.length === 0) {
      return res.json({
        recommendations: `You haven't logged any activities yet. Start tracking your carbon footprint to get personalized AI recommendations!`
      });
    }

    const totalFootprint = activities.reduce((sum, act) => sum + act.carbonFootprint, 0);

    const activitySummary = activities.slice(0, 10).map(a => 
      `${a.type}: ${a.category} - ${a.amount} ${a.unit} (${a.carbonFootprint.toFixed(2)} kg CO2)`
    ).join('\n');

    const prompt = `As an environmental expert, analyze this carbon footprint data and provide 5 specific, actionable recommendations to reduce emissions:

Total Carbon Footprint: ${totalFootprint.toFixed(2)} kg CO2
Recent Activities:
${activitySummary}

Provide practical, personalized suggestions based on their activity patterns.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = response.text();

    res.json({ recommendations });
  } catch (error) {
    console.error('AI Error:', error);
    res.json({ 
      recommendations: `Unable to generate AI recommendations at this time. Here are some general tips:

1. Use public transportation or carpool to reduce transportation emissions
2. Switch to energy-efficient appliances and LED bulbs
3. Reduce meat consumption and choose local, seasonal produce
4. Practice the 3 R's: Reduce, Reuse, Recycle
5. Conserve water by fixing leaks and taking shorter showers

Check your Statistics page for detailed insights into your carbon footprint!`
    });
  }
});

router.post('/insights', auth, async (req, res) => {
  try {
    if (!model) {
      return res.json({
        insights: `AI insights are currently unavailable. Please add your Gemini API key to the .env file to enable this feature.`
      });
    }

    const activities = await Activity.find({ userId: req.userId });

    const stats = {
      total: activities.reduce((sum, a) => sum + a.carbonFootprint, 0),
      byType: {}
    };

    activities.forEach(a => {
      if (!stats.byType[a.type]) stats.byType[a.type] = 0;
      stats.byType[a.type] += a.carbonFootprint;
    });

    const prompt = `Analyze this carbon footprint data and provide insights:

Total Emissions: ${stats.total.toFixed(2)} kg CO2
Breakdown by category:
${Object.entries(stats.byType).map(([type, value]) => `${type}: ${value.toFixed(2)} kg CO2`).join('\n')}

Provide a brief analysis of their biggest emission sources and potential areas for improvement.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    res.json({ insights, stats });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error generating insights' });
  }
});

module.exports = router;
