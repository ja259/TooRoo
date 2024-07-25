import dotenv from 'dotenv';

dotenv.config();

console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);
console.log("VAPID_PUBLIC_KEY:", process.env.VAPID_PUBLIC_KEY);
console.log("VAPID_PRIVATE_KEY:", process.env.VAPID_PRIVATE_KEY);
