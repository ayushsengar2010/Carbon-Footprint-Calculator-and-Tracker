# Carbon Footprint Calculator and Tracker

A web application that helps individuals track their daily carbon emissions and get personalized recommendations to reduce their environmental impact.

## Features

### User Authentication
- Secure registration and login with JWT tokens
- Profile management with password change option
- Persistent sessions

### Activity Tracking
- Log activities across 5 categories: Transportation, Electricity, Food, Waste, Water
- Quick add buttons for common activities
- Edit and delete past entries
- Automatic carbon footprint calculation

### Dashboard
- Overview of total emissions
- Monthly footprint tracking
- Recent activity list with edit/delete options
- Quick add functionality for common activities

### Statistics & Analytics
- Interactive charts (Pie, Bar, Line)
- Time range filters (7, 30, 90 days)
- Weekly trend comparison
- Category breakdown visualization

### AI-Powered Insights
- Chat-style interface for recommendations
- Personalized suggestions based on activity patterns
- Detailed carbon footprint analysis

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Chart.js with react-chartjs-2
- Recharts
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddActivity.jsx
│   │   │   ├── EditActivity.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── AIRecommendations.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Activity.js
│   │   └── User.js
│   ├── routes/
│   │   ├── activityRoutes.js
│   │   ├── aiRoutes.js
│   │   └── userRoutes.js
│   └── server.js
└── package.json
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/carbon-footprint-tracker.git
cd carbon-footprint-tracker
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/carbon-footprint
PORT=5000
JWT_SECRET=your_secret_key_here
```

4. Make sure MongoDB is running on your system

5. Start the development server:
```bash
npm run dev
```

The app will open at http://localhost:3000

## Carbon Emission Factors

The application uses the following emission factors for calculations:

| Activity | Category | CO2 per unit |
|----------|----------|--------------|
| Transportation | Car | 0.21 kg/km |
| Transportation | Bus | 0.089 kg/km |
| Transportation | Train | 0.041 kg/km |
| Transportation | Flight | 0.255 kg/km |
| Transportation | Bike | 0 kg/km |
| Electricity | kWh | 0.92 kg/kWh |
| Food | Meat | 6.61 kg/kg |
| Food | Dairy | 1.35 kg/kg |
| Food | Vegetables | 0.43 kg/kg |
| Food | Grains | 0.76 kg/kg |
| Waste | Landfill | 0.57 kg/kg |
| Waste | Recycling | 0.21 kg/kg |
| Water | Liter | 0.0003 kg/L |

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password

### Activities
- `GET /api/activities` - Get all user activities
- `GET /api/activities/:id` - Get single activity
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/stats` - Get statistics

### AI Recommendations
- `POST /api/ai/recommendations` - Get personalized recommendations
- `POST /api/ai/insights` - Get carbon footprint analysis

## Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production

## Usage Guide

1. **Register/Login**: Create an account or login to access the dashboard
2. **Add Activities**: Use the Add Activity page or Quick Add buttons on the dashboard
3. **View Statistics**: Check the Statistics page for charts and trends
4. **Get AI Insights**: Visit AI Insights for personalized recommendations
5. **Manage Profile**: Update your profile settings or change password

## Screenshots

The application includes:
- Clean login/register interface
- Interactive dashboard with quick actions
- Visual statistics with multiple chart types
- Chat-style AI recommendation interface
- Responsive design for mobile devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License
