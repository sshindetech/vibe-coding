# Vibe Coding Example: Financial Data Q&A App
This application enables users to upload Excel files containing financial data and ask questions in natural language to analyze and visualize the data. Built using the Vibe Coding approach, it combines a modern Expo React Native frontend for seamless user interaction with a robust Nest.js backend. The backend leverages LangChain with Google Gemini for advanced language understanding and xlsx for Excel parsing, allowing users to gain insights and generate charts from their data with minimal effort.

## Overview
This project is a fullstack application for uploading Excel files with multiple tabs and querying using natural language. It features:
- This is a fullstack project with Expo React Native `frontend` (using NativeWind/Tailwind and react-native-chart-kit) and a `backend` (Nest.js based microservices architecture).
- The `frontend` is a single screen for Excel upload, query input, summary, and chart display.
- The `backend` is a microservice architecture with a `gateway` and multiple services (`ai-service` and `excel-service`).
    - The `gateway` is a Nest.js application that handles and routes the incoming requests from UI to microservices
    - The `ai-service` is a Nest.js microservice application that uses LangChain with Google Gemini for financial data analysis.
    - The `excel-service` is a Nest.js microservice application that processes Excel files and extracts data for analysis.

## Usage (with Docker)
Use these steps to run application (backend and frontend) using Docker
1. Get the Google Gemini API Key from: https://aistudio.google.com/app/apikey
2. Rename the `/.env.example` to `.env`. Update the `GOOGLE_API_KEY` env variable with the Gemini API Key from step #1
3. Run command `docker compose up` from the directory where we have `docker-compose.yml` file
4. Access the backend Swagger APIs: http://localhost:3000/api
5. Access the frontend Application: http://localhost:8081

## Development Setup (without Docker)
Use these steps for local environemnt setup and run application locally
1. Get the Google Gemini API Key from: https://aistudio.google.com/app/apikey
2. Rename the `/.env.example` files to `.env` placed it in each `backend/gateway`, `backend/ai-service` and `backend/excel-service` project folders. 
3. Update the `GOOGLE_API_KEY` env variable with the Gemini API Key from step #1 in `.env` of `backend/ai-service` project
4. Run `npm install` from the main project folder (`vibe-coding`)
5. Start the ai-service microservice (`npm run ai-service:dev`). Run this command from the main project folder (`vibe-coding`)
6. Start the excel-service microservice (`npm run excel-service:dev`). Run this command from the main project folder (`vibe-coding`)
7. Start the gateway server (`npm run gateway:dev`). Run this command from the main project folder (`vibe-coding`)
8. Start the frontend server (`npm run frontend`). Run this command from the main project folder (`vibe-coding`)
9. Access the backend Swagger APIs: http://localhost:3000/api
10. Access the frontend Application: http://localhost:8081. Upload an Excel file (you can use a sample from `sample-data` folder), enter your query, and view the summary and chart.

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
