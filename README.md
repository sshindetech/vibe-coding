# Vibe Coding Example: Financial Data Q&A App
This application enables users to upload Excel files containing financial data and ask questions in natural language to analyze and visualize the data. Built using the Vibe Coding approach, it combines a modern Expo React Native frontend for seamless user interaction with a robust Nest.js backend. The backend leverages LangChain with Google Gemini for advanced language understanding and xlsx for Excel parsing, allowing users to gain insights and generate charts from their data with minimal effort.

## Overview
This project is a fullstack application for uploading Excel files with multiple tabs and querying financial data using natural language. It features:
- **Frontend:** Expo React Native (TypeScript, NativeWind/Tailwind, react-native-chart-kit)
- **Backend:** Nest.js (TypeScript, LangChain with Google Gemini, xlsx for Excel parsing)

## Usage (with Docker)
Use these steps to run application (backend and frontend) using Docker
1. Get the Google Gemini API Key from: https://aistudio.google.com/app/apikey
2. Rename the `/.env.example` to `.env`. Update the `GOOGLE_API_KEY` env variable with the Gemini API Key from step #1
3. Run command `docker compose up` from the directory where we have `docker-compose.yml` file
4. Access the backend Swagger APIs: http://localhost:3000/api
4. Access the frontend Application: http://localhost:8080

## Development Setup (without Docker)
Use these steps for local environemnt setup and run application locally
1. Get the Google Gemini API Key from: https://aistudio.google.com/app/apikey
2. Rename the `/.env.example` to `.env` and placed it in `backend` project folder. Update the `GOOGLE_API_KEY` env variable with the Gemini API Key from step #1
3. Run `npm install` from the main project folder (`vibe-coding`)
4. Start the backend server (`npm run backend`). Run this command from the main project folder (`vibe-coding`)
5. Start the frontend app (`npm run frontend`). Run this command from the main project folder (`vibe-coding`)
6. Upload an Excel file (you can use a sample from `sample-data` folder), enter your query, and view the summary and chart.

## Example queries
- Show top five products sold in Canada
- Shopw top five contries by sales revenue

## Features
- Upload Excel files with multiple sheets
- Ask questions about the data in natural language
- Get a text summary and a chart visualization

## Tech Stack
- **Frontend:** Expo, React Native, NativeWind, react-native-chart-kit
- **Backend:** Nest.js, LangChain, Google Gemini, xlsx, multer

## Screenshots
Below screenshots are examples that shows the chat feature, dynamic graph and theme switching

![Line Graph](./sample-data/screen_1.png)
![Pie Screen 2](./sample-data/screen_2.png)
![Green Theme](./sample-data/screen_3.png)
![Swagger Open API](./sample-data/screen_4.png)
---
