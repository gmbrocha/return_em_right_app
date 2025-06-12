const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'startrek',
  database: 'snapper_app'
};

// Test data points - simulating various venting locations on the fish
const testData = [
  // Around the gills (popular venting spot)
  { x: 0.15, y: 0.35, fisherman_type: 'recreational', years_experience: 10 },
  { x: 0.18, y: 0.32, fisherman_type: 'commercial', years_experience: 25 },
  { x: 0.16, y: 0.38, fisherman_type: 'recreational', years_experience: 5 },
  { x: 0.14, y: 0.34, fisherman_type: 'recreational', years_experience: 15 },
  { x: 0.17, y: 0.36, fisherman_type: 'commercial', years_experience: 30 },
  
  // Behind the head area
  { x: 0.25, y: 0.28, fisherman_type: 'recreational', years_experience: 2 },
  { x: 0.23, y: 0.30, fisherman_type: 'commercial', years_experience: 20 },
  { x: 0.26, y: 0.26, fisherman_type: 'recreational', years_experience: 8 },
  
  // Mid-body area (less popular)
  { x: 0.45, y: 0.40, fisherman_type: 'recreational', years_experience: 1 },
  { x: 0.42, y: 0.38, fisherman_type: 'recreational', years_experience: 3 },
  
  // Near the dorsal fin
  { x: 0.35, y: 0.25, fisherman_type: 'commercial', years_experience: 35 },
  { x: 0.33, y: 0.22, fisherman_type: 'recreational', years_experience: 12 },
  { x: 0.37, y: 0.27, fisherman_type: 'commercial', years_experience: 15 },
  
  // Some scattered points
  { x: 0.28, y: 0.45, fisherman_type: 'recreational', years_experience: 7 },
  { x: 0.52, y: 0.35, fisherman_type: 'recreational', years_experience: 4 },
  { x: 0.31, y: 0.42, fisherman_type: 'commercial', years_experience: 18 },
  { x: 0.19, y: 0.29, fisherman_type: 'recreational', years_experience: 6 },
  { x: 0.41, y: 0.32, fisherman_type: 'commercial', years_experience: 22 },
  
  // Additional points around popular areas
  { x: 0.13, y: 0.37, fisherman_type: 'recreational', years_experience: 9 },
  { x: 0.20, y: 0.33, fisherman_type: 'commercial', years_experience: 28 }
];

async function generateTestData() {
  let db;
  
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    console.log('Inserting test data...');
    
    for (const point of testData) {
      const session_id = uuidv4();
      const user_agent = 'Test Data Generator';
      
      await db.execute(
        'INSERT INTO click_data (x_coordinate, y_coordinate, fisherman_type, years_experience, session_id, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
        [point.x, point.y, point.fisherman_type, point.years_experience, session_id, user_agent]
      );
    }
    
    console.log(`Successfully inserted ${testData.length} test data points!`);
    
    // Query to show the data was inserted
    const [rows] = await db.execute('SELECT COUNT(*) as total FROM click_data');
    console.log(`Total records in database: ${rows[0].total}`);
    
  } catch (error) {
    console.error('Error generating test data:', error);
  } finally {
    if (db) {
      await db.end();
      console.log('Database connection closed');
    }
  }
}

// Run the script
generateTestData(); 