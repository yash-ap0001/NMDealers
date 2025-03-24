import app from './app.js';
import { testConnection } from './config/database.js';

const PORT = process.env.PORT || 5000;

// Test database connection before starting server
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Unable to start server:', error);
  process.exit(1);
}); 