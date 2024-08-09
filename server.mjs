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
                prompt: `Suggest some recipes using the fol

