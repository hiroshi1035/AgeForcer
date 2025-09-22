const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/update-roblox-birthday', async (req, res) => {
    try {
        const { cookie, password, birthYear, birthMonth, birthDay } = req.body;

        if (!cookie || !password || !birthYear || !birthMonth || !birthDay) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const session = axios.create({
            headers: { 'Cookie': `.ROBLOSECURITY=${cookie}` }
        });

        // Step 1: Get the CSRF token
        let csrfToken;
        try {
            const response = await session.post('https://accountinformation.roblox.com/v1/birthdate');
            csrfToken = response.headers['x-csrf-token'];
            if (!csrfToken) {
                return res.status(500).json({ error: 'Failed to get CSRF token from Roblox.' });
            }
        } catch (error) {
            console.error('CSRF token request failed:', error.message);
            return res.status(500).json({ error: 'Failed to connect to Roblox to get CSRF token.' });
        }
        
        // Step 2: Send the birthdate update request
        const payload = { birthYear, birthMonth, birthDay, password };
        const headers = {
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json'
        };

        const updateResponse = await session.post(
            'https://accountinformation.roblox.com/v1/birthdate',
            payload,
            { headers }
        );

        res.json({
            status_code: updateResponse.status,
            message: updateResponse.data.message || 'Birthday updated successfully!'
        });

    } catch (error) {
        console.error('An error occurred:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'An unexpected error occurred',
            details: error.response ? error.response.data : error.message
        });
    }
});

module.exports = app;        // Step 2: Send the birthdate update request
        const payload = { birthYear, birthMonth, birthDay, password };
        const headers = {
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json'
        };

        const updateResponse = await session.post(
            'https://accountinformation.roblox.com/v1/birthdate',
            payload,
            { headers }
        );

        // Send the response from the Roblox API back to the frontend
        res.json({
            status_code: updateResponse.status,
            message: updateResponse.data.message || 'Birthday updated successfully!'
        });

    } catch (error) {
        // Handle any errors that occur during the process
        console.error('An error occurred:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'An unexpected error occurred',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Vercel requires the app to be exported as a module
module.exports = app;
