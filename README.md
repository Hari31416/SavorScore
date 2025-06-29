# SavorScore: Dish Judgment Tracker

SavorScore is a web application for tracking and analyzing your culinary experiences across different restaurants. This application allows you to record detailed judgments of dishes using various metrics, helping you remember your favorites and make informed dining decisions.

## Features

- **User Authentication**: Secure registration and login
- **Restaurant Management**: Add, view, edit, and delete restaurant entries
- **Dish Catalog**: Build a personal database of dishes across restaurants
- **Detailed Judgments**: Score dishes on multiple criteria including:
  - Overall Flavor Experience (1-10)
  - Ingredient Quality (1-5)
  - Texture & Mouthfeel (1-5)
  - Execution & Craftsmanship (1-5)
  - Value for Money (1-5)
  - Craving & Reorder Likelihood (1-10)
- **Notes**: Add detailed notes about your dining experience
- **Filtering and Sorting**: Find judgments quickly with search and sort options
- **Analytics**: View average ratings for restaurants and dishes

## Tech Stack

- **MongoDB**: Database for storing all application data
- **Express.js**: Backend API framework
- **React.js**: Frontend user interface
- **Node.js**: JavaScript runtime for the backend
- **Bootstrap**: UI component library for responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/savorscore.git
   cd savorscore
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## Future Enhancements

- **Restaurant-Specific Analysis**: Average scores by restaurant
- **Dish-Specific Analysis**: Compare the same dish across different restaurants
- **Advanced Filtering**: Filter by date range, rating threshold, etc.
- **Data Visualization**: Charts and graphs for analytical insights
- **Image Upload**: Add photos of dishes to judgments
- **Social Sharing**: Share your judgments with friends

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspiration from personal dining experiences and the desire to remember great meals
- All the amazing restaurants and chefs who create memorable dishes
