const bcrypt = require('bcryptjs');

const password = 'snapper2024';

// Generate a hash
const hash = bcrypt.hashSync(password, 10);
console.log('Generated hash:', hash);

// Verify the hash works
const isValid = bcrypt.compareSync(password, hash);
console.log('Hash verification:', isValid);

// Test against our fixed hash
const fixedHash = '$2a$10$xLJXJ0bHhYqJxYT2xXgK8.kB.wGNSF1YYOHHdbWJqUBh.R0.z5qPi';
const isValidFixed = bcrypt.compareSync(password, fixedHash);
console.log('Fixed hash verification:', isValidFixed);

// Generate a new hash and show it
const newHash = bcrypt.hashSync(password, 10);
console.log('New hash to try:', newHash); 