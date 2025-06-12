# Red Snapper Venting Location Tracker

A web application for collecting data on optimal Red Snapper venting locations for research purposes.

## Features

- Interactive fish image with click-to-select functionality
- Modal dialog to collect fisherman type and experience data
- Real-time heatmap generation showing popular venting locations
- MySQL database storage for research data
- Responsive design for desktop and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server running on localhost:3306
- Database named `snapper_app` already created

## Setup Instructions

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Database**
   - Ensure MySQL server is running on localhost:3306
   - Create a database named `snapper_app`
   - Update database credentials in `backend/server.js` if needed:
     ```javascript
     const dbConfig = {
       host: 'localhost',
       port: 3306,
       user: 'root', // update as needed
       password: '', // update as needed
       database: 'snapper_app'
     };
     ```

3. **Start the Server**
   ```bash
   cd backend
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser and go to: `http://localhost:5000`

## How It Works

1. **User Interaction**: Users click on the fish image where they think the best venting location is
2. **Data Collection**: A modal appears asking for:
   - Fisherman type (recreational or commercial)
   - Years of fishing experience
3. **Data Storage**: Click coordinates (normalized 0-1) and metadata are stored in MySQL
4. **Heatmap Display**: After submission, a heatmap shows all previous responses

## Database Schema

The application creates a `click_data` table with the following structure:

```sql
CREATE TABLE click_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    x_coordinate DECIMAL(10, 8) NOT NULL,
    y_coordinate DECIMAL(10, 8) NOT NULL,
    fisherman_type ENUM('recreational', 'commercial') NOT NULL,
    years_experience INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(50),
    user_agent TEXT,
    INDEX idx_coordinates (x_coordinate, y_coordinate),
    INDEX idx_timestamp (timestamp)
);
```

## API Endpoints

- `POST /api/click` - Submit click data and metadata
- `GET /api/heatmap` - Retrieve all click data for heatmap generation
- `GET /` - Serve the main application page

## Project Structure

```
snapper_app/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   └── index.html
├── snapper_clean.png
└── README.md
```

## Development Notes

- Coordinates are stored as normalized values (0-1) to handle different screen sizes
- The heatmap uses heatmap.js library for visualization
- Session IDs are generated for potential future analytics
- User agent strings are stored for device tracking

## Troubleshooting

- **Database Connection Issues**: Verify MySQL is running and credentials are correct
- **Image Not Loading**: Ensure `snapper_clean.png` is in the root directory
- **Port Conflicts**: Change the PORT variable in `server.js` if 5000 is occupied 