const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));
// Also serve static files from the root directory (for snapper_clean.png)
app.use(express.static(path.join(__dirname, '../')));

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root', // adjust as needed
  password: 'startrek', // MySQL password
  database: 'snapper_app'
};

// Initialize database connection
let db;

async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    // Create table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS click_data (
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
      )
    `);
    console.log('Database table ready');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// API Routes
app.post('/api/click', async (req, res) => {
  try {
    const { x_coordinate, y_coordinate, fisherman_type, years_experience } = req.body;
    const session_id = uuidv4();
    const user_agent = req.headers['user-agent'];

    // Validate input
    if (!x_coordinate || !y_coordinate || !fisherman_type || !years_experience) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (x_coordinate < 0 || x_coordinate > 1 || y_coordinate < 0 || y_coordinate > 1) {
      return res.status(400).json({ error: 'Coordinates must be between 0 and 1' });
    }

    if (!['recreational', 'commercial'].includes(fisherman_type)) {
      return res.status(400).json({ error: 'Invalid fisherman type' });
    }

    // Insert into database
    const [result] = await db.execute(
      'INSERT INTO click_data (x_coordinate, y_coordinate, fisherman_type, years_experience, session_id, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [x_coordinate, y_coordinate, fisherman_type, years_experience, session_id, user_agent]
    );

    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Click data saved successfully' 
    });
  } catch (error) {
    console.error('Error saving click data:', error);
    res.status(500).json({ error: 'Failed to save click data' });
  }
});

app.get('/api/heatmap', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT x_coordinate, y_coordinate, fisherman_type, years_experience FROM click_data'
    );
    
    res.json({ 
      success: true, 
      data: rows,
      count: rows.length 
    });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Handle React routing - serve React app for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  }
});

// Start server
app.listen(PORT, async () => {
  await initDatabase();
  console.log(`Server running on port ${PORT}`);
}); 