const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

function generateSmartRecommendations(activities, stats) {
  const recommendations = [];
  const byType = {};
  
  activities.forEach(a => {
    if (!byType[a.type]) byType[a.type] = { total: 0, count: 0, categories: {} };
    byType[a.type].total += a.carbonFootprint;
    byType[a.type].count++;
    if (!byType[a.type].categories[a.category]) byType[a.type].categories[a.category] = 0;
    byType[a.type].categories[a.category] += a.carbonFootprint;
  });

  const sortedTypes = Object.entries(byType).sort((a, b) => b[1].total - a[1].total);
  
  if (sortedTypes.length === 0) {
    return `Start logging your daily activities to receive personalized recommendations for reducing your carbon footprint. Track your transportation, electricity usage, food consumption, waste, and water usage to get started.`;
  }

  recommendations.push(`Based on your activity data, here are personalized recommendations to reduce your carbon footprint:\n`);

  sortedTypes.forEach(([type, data], index) => {
    const percentage = ((data.total / stats.total) * 100).toFixed(1);
    
    if (type === 'transportation') {
      const topCategory = Object.entries(data.categories).sort((a, b) => b[1] - a[1])[0];
      if (topCategory && topCategory[0] === 'car') {
        recommendations.push(`${index + 1}. Your car usage accounts for ${percentage}% of emissions. Consider carpooling, using public transit, or switching to an electric vehicle for shorter commutes.`);
      } else if (topCategory && topCategory[0] === 'flight') {
        recommendations.push(`${index + 1}. Air travel makes up ${percentage}% of your footprint. Consider video calls instead of business trips, or choose trains for shorter distances when possible.`);
      } else {
        recommendations.push(`${index + 1}. Transportation contributes ${percentage}% to your emissions. Walking or cycling for trips under 2km can make a significant difference.`);
      }
    }
    
    if (type === 'electricity') {
      recommendations.push(`${index + 1}. Electricity usage represents ${percentage}% of your carbon footprint. Switch to LED bulbs, unplug devices when not in use, and consider renewable energy sources.`);
    }
    
    if (type === 'food') {
      const topCategory = Object.entries(data.categories).sort((a, b) => b[1] - a[1])[0];
      if (topCategory && topCategory[0] === 'meat') {
        recommendations.push(`${index + 1}. Meat consumption accounts for ${percentage}% of your emissions. Try incorporating more plant-based meals or choosing chicken over beef when you do eat meat.`);
      } else {
        recommendations.push(`${index + 1}. Food choices contribute ${percentage}% to your footprint. Buying local and seasonal produce can reduce food transportation emissions.`);
      }
    }
    
    if (type === 'waste') {
      recommendations.push(`${index + 1}. Waste disposal accounts for ${percentage}% of emissions. Focus on reducing single-use plastics and composting organic waste to minimize landfill contributions.`);
    }
    
    if (type === 'water') {
      recommendations.push(`${index + 1}. Water usage contributes ${percentage}% to your footprint. Taking shorter showers and fixing leaky faucets can help reduce this significantly.`);
    }
  });

  const totalFootprint = stats.total;
  if (totalFootprint > 100) {
    recommendations.push(`\nYour total footprint of ${totalFootprint.toFixed(2)} kg CO2 is above average. Small daily changes can lead to meaningful reductions over time.`);
  } else if (totalFootprint > 50) {
    recommendations.push(`\nYour footprint of ${totalFootprint.toFixed(2)} kg CO2 is moderate. Keep up the good work and focus on your highest emission areas.`);
  } else {
    recommendations.push(`\nGreat job! Your footprint of ${totalFootprint.toFixed(2)} kg CO2 is relatively low. Continue your eco-friendly habits!`);
  }

  return recommendations.join('\n\n');
}

function generateSmartInsights(activities, stats) {
  if (activities.length === 0) {
    return `No activities logged yet. Start tracking your daily activities to see detailed insights about your carbon footprint patterns.`;
  }

  const insights = [];
  const byType = stats.byType;
  const total = stats.total;
  
  insights.push(`Your Carbon Footprint Analysis\n`);
  insights.push(`Total Emissions: ${total.toFixed(2)} kg CO2 across ${activities.length} logged activities.\n`);

  const sortedTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]);
  
  if (sortedTypes.length > 0) {
    const [topType, topValue] = sortedTypes[0];
    const topPercentage = ((topValue / total) * 100).toFixed(1);
    insights.push(`Primary Emission Source: ${topType.charAt(0).toUpperCase() + topType.slice(1)} (${topPercentage}% of total emissions)`);
    insights.push(`This is your biggest area for potential improvement.\n`);
  }

  insights.push(`Breakdown by Category:`);
  sortedTypes.forEach(([type, value]) => {
    const percentage = ((value / total) * 100).toFixed(1);
    const emoji = type === 'transportation' ? '🚗' : type === 'electricity' ? '⚡' : type === 'food' ? '🍽️' : type === 'waste' ? '🗑️' : '💧';
    insights.push(`${emoji} ${type.charAt(0).toUpperCase() + type.slice(1)}: ${value.toFixed(2)} kg CO2 (${percentage}%)`);
  });

  const recentActivities = activities.slice(0, 5);
  if (recentActivities.length > 0) {
    const avgRecent = recentActivities.reduce((sum, a) => sum + a.carbonFootprint, 0) / recentActivities.length;
    insights.push(`\nRecent Activity Average: ${avgRecent.toFixed(2)} kg CO2 per activity`);
  }

  return insights.join('\n');
}

router.post('/recommendations', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId }).limit(20).sort({ date: -1 });

    if (activities.length === 0) {
      return res.json({
        recommendations: `Welcome to Carbon Tracker! You haven't logged any activities yet.

Start tracking your daily activities to receive personalized recommendations:

1. Log your transportation methods (car, bus, train, flights)
2. Track your electricity consumption
3. Record your food choices and meals
4. Monitor your waste disposal habits
5. Keep track of water usage

Once you have some data, come back here for tailored suggestions to reduce your environmental impact!`
      });
    }

    const stats = {
      total: activities.reduce((sum, a) => sum + a.carbonFootprint, 0),
      byType: {}
    };

    activities.forEach(a => {
      if (!stats.byType[a.type]) stats.byType[a.type] = 0;
      stats.byType[a.type] += a.carbonFootprint;
    });

    const recommendations = generateSmartRecommendations(activities, stats);
    res.json({ recommendations });
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      recommendations: `Here are some helpful tips to reduce your carbon footprint:

1. Use public transportation, bike, or walk instead of driving alone
2. Reduce energy consumption by turning off lights and unplugging devices
3. Choose plant-based meals more often to lower food emissions
4. Recycle and compost to minimize waste sent to landfills
5. Use water efficiently and fix any leaks in your home

Visit the Statistics page to see your detailed carbon footprint breakdown!`
    });
  }
});

router.post('/insights', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId }).sort({ date: -1 });

    const stats = {
      total: activities.reduce((sum, a) => sum + a.carbonFootprint, 0),
      byType: {}
    };

    activities.forEach(a => {
      if (!stats.byType[a.type]) stats.byType[a.type] = 0;
      stats.byType[a.type] += a.carbonFootprint;
    });

    const insights = generateSmartInsights(activities, stats);
    res.json({ insights, stats });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating insights' });
  }
});

module.exports = router;
