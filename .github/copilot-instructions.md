// Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file

# Project Instructions

- This is a fullstack project with Expo React Native `frontend` (using NativeWind/Tailwind and react-native-chart-kit) and a `backend` (Nest.js based microservices architecture).
- The `frontend` is a single screen for Excel upload, query input, summary, and chart display.
- The `backend` is a microservice architecture with a `gateway` and multiple services (`ai-service` and `excel-service`).
- The `gateway` is a Nest.js application that handles file uploads and queries, processes Excel files, and uses LangChain with Google Gemini for financial data analysis.
- The `ai-service` is a Nest.js application that uses LangChain with Google Gemini for financial data analysis.
- The `excel-service` is a Nest.js application that processes Excel files and extracts data for analysis.