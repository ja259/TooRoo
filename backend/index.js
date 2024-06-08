const app = require('./server'); // Assuming your main Express app is in server.js

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
