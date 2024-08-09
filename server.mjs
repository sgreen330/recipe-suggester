import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Import cors
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for your frontend domain
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST'], // Specify allowed methods
}));

app.use(express.json());

// Endpoint to handle the recipe request
app.post('/get-recipes', async (req, res) => {
    const ingredients = req.body.ingredients;

    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: `Suggest some recipes using the following ingredients: ${ingredients}.`,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        res.json(data.choices[0].text.trim().split('\n').filter(line => line));
    } catch (error) {
        console.error("Error during API request:", error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
