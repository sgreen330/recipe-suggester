import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for both GitHub Pages and Vercel frontend domains
app.use(cors({
    origin: ['https://sgreen330.github.io', 'https://recipe-suggester-xi.vercel.app'], // Allow requests from both your GitHub Pages site and Vercel
    methods: ['GET', 'POST'],
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
            throw new Error(`OpenAI API returned an error: ${response.statusText}`);
        }

        const data = await response.json();
        // Split the response text into an array of recipe suggestions
        const recipes = data.choices[0].text.split('\n').filter(line => line.trim() !== '');
        res.json(recipes);
    } catch (error) {
        console.error("Error during API request:", error);
        res.status(500).send("There was an error fetching the recipes. Please try again.");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
