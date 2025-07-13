import { config } from 'dotenv';

async function globalSetup() {
  // Load environment variables from .env file
  config();
}

export default globalSetup;