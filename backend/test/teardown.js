import { disconnectDB } from '../db.js';

// Hook to run after all tests are completed
after(async () => {
    await disconnectDB();
});
