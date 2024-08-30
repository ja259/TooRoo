import twilio from 'twilio';
import config from '../config/config.js'; // Assuming you have your Twilio credentials in your config

const accountSid = config.twilioAccountSid;
const authToken = config.twilioAuthToken;
const twilioPhoneNumber = config.twilioPhoneNumber;

const client = twilio(accountSid, authToken);

/**
 * Sends an SMS message to the specified phone number.
 * @param {string} to - The recipient's phone number.
 * @param {string} message - The message content.
 * @returns {Promise} - A promise that resolves with the message details if the SMS was sent successfully, or rejects with an error.
 */
const sendSMS = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: to
        });
        console.log(`SMS sent to ${to}: ${response.sid}`);
        return response;
    } catch (error) {
        console.error(`Failed to send SMS to ${to}: ${error.message}`);
        throw new Error(`Failed to send SMS: ${error.message}`);
    }
};

export default sendSMS;
