# 🌍 Carbon Footprint Calculator and Tracker

A comprehensive web application to track and analyze your carbon footprint with AI-powered recommendations.

## Features

- **User Authentication**: Secure registration and login system
- **Activity Tracking**: Log various activities (transportation, electricity, food, waste, water)
- **Real-time Carbon Calculations**: Automatic CO2 emission calculations
- **Interactive Dashboard**: View recent activities and overall statistics
- **Data Visualization**: Beautiful charts using Chart.js (Pie, Bar, Line charts)
- **AI-Powered Insights**: Get personalized recommendations using OpenAI GPT-3.5
- **Responsive Design**: Works seamlessly on mobile and desktop
- **MongoDB Database**: Persistent data storage

## Tech Stack

### Frontend
- React 18
- Vite (Build tool)
- React Router DOM (Navigation)
- Chart.js & React-Chartjs-2 (Data visualization)
- Axios (API calls)
- CSS3 (Styling)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- bcryptjs (Password hashing)

### AI Integration
- Google Gemini AI (Gemini Pro model)

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API Key

## Installation

1. **Clone the repository**
```bash
cd "Carbon Footprint Calculator and Tracker"
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Setup environment variables**

Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/carbon-footprint
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**To get your Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

5. **Start MongoDB**

Make sure MongoDB is running on your system.

## Running the Application

### Development Mode

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. **Register**: Create a new account
2. **Login**: Access your dashboard
3. **Add Activities**: Track your carbon-generating activities
4. **View Dashboard**: See recent activities and statistics
5. **Statistics Page**: Analyze your footprint with interactive charts
6. **AI Recommendations**: Get personalized suggestions to reduce emissions

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Activities
- `POST /api/activities` - Add new activity
- `GET /api/activities` - Get user's activities
- `GET /api/activities/stats` - Get statistics
- `DELETE /api/activities/:id` - Delete activity

### AI
- `POST /api/ai/recommendations` - Get AI recommendations
- `POST /api/ai/insights` - Get AI insights

## Project Structure

```
carbon-footprint-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API utilities
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                # Backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Server entry point
├── .env                  # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Emission Factors Used

- **Car**: 0.21 kg CO2/km
- **Bus**: 0.089 kg CO2/km
- **Train**: 0.041 kg CO2/km
- **Flight**: 0.255 kg CO2/km
- **Electricity**: 0.92 kg CO2/kWh
- **Meat**: 6.61 kg CO2/kg
- **Dairy**: 1.35 kg CO2/kg
- **Vegetables**: 0.43 kg CO2/kg
- **Waste (Landfill)**: 0.57 kg CO2/kg
- **Water**: 0.0003 kg CO2/liter

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
