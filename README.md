# Carbon Footprint Calculator and Tracker

Track your daily carbon emissions and get tips to reduce them.

## What it does

- Log activities like driving, electricity use, food, etc.
- See how much CO2 you're producing
- Get personalized tips to reduce your footprint
- View charts and stats

## Tech used

**Frontend:** React, Vite, Chart.js  
**Backend:** Node.js, Express, MongoDB  
**Auth:** JWT tokens

## Setup

1. Install dependencies:
```
npm install
cd client && npm install && cd ..
```

2. Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/carbon-footprint
PORT=5000
JWT_SECRET=your_secret_key
```

3. Make sure MongoDB is running

4. Start the app:
```
npm run dev
```

Opens at http://localhost:3000

## How to use

1. Register an account
2. Log in
3. Add your activities (car trips, electricity, meals, etc.)
4. Check your dashboard for stats
5. Visit AI Insights for tips

## Emission factors

| Activity | CO2 per unit |
|----------|-------------|
| Car | 0.21 kg/km |
| Bus | 0.089 kg/km |
| Train | 0.041 kg/km |
| Flight | 0.255 kg/km |
| Electricity | 0.92 kg/kWh |
| Meat | 6.61 kg/kg |
| Dairy | 1.35 kg/kg |
