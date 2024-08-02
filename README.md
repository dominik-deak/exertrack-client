# ExerTrack Mobile Client

## Overview

ExerTrack is a mobile application designed to help users track their workouts and fitness progress. Built with React Native and Expo, the app provides a user-friendly interface for logging exercises, viewing workout history, and tracking progress over time. The front-end interacts with a back-end server to fetch and display data and leverage a machine-learning model for personalized exercise recommendations.

## Features

- **User Authentication:** Users can register and log in securely. Authentication is handled using JSON Web Tokens (JWT) stored securely on the device.
- **Workout Tracking:** Users can log workouts using pre-defined templates or create custom workout routines from scratch. The app supports both template-based and free-form workout logging.
- **Progress Visualization:** Displays various charts and graphs to help users visualize their fitness progress, including workout volume and frequency.
- **Exercise Suggestions:** Leverages a TensorflowJS model to provide personalized exercise recommendations based on historical data.
- **Settings Management:** Allows users to update their profile information, switch between metric and imperial measurement units, and manage their account settings.

## Technology Stack

- **React Native:** Provides the framework for building cross-platform mobile applications.
- **Expo:** Used for rapid development and testing, provides a streamlined workflow for building React Native apps.
- **Gluestack UI:** Utilized for creating a custom, theme-able user interface with dark mode support.
- **Axios:** Handles HTTP requests to the back-end server for data retrieval and submission.
- **Secure Store:** Safely stores JWTs and other sensitive information on the device.
- **TypeScript**: Enhances code quality with static typing, preventing type-related errors and improving maintainability.

## User Interface

The app uses a file-based routing system with the Expo Router library, organizing routes similarly to Next.js. The layout is customized with Gluestack UI components, offering a consistent look and feel across different screens. The user interface includes:

- **Login and Registration Screens:** Simple and intuitive forms for user authentication.
- **Workout Logging Screen:** Interactive interface for logging exercises, weights, and repetitions.
- **Progress Charts:** Dynamic charts to visualize workout data over different time periods.
- **Settings Page:** Options for updating profile information, changing measurement units, and managing the account.

## Authentication

ExerTrack implements a robust authentication system using JWTs. Tokens are securely stored and automatically refreshed as needed, ensuring a seamless user experience. The authentication flow includes:

- **Login:** Validates user credentials and retrieves JWTs from the server.
- **Token Management:** Handles token storage and automatic refresh to maintain session integrity.
- **Secure Logout:** Ensures all tokens are cleared from the device upon logout.

## Run the app
1. Start iOS and Android virtual devices using XCode and Android Studio
2. Install packages with `npm i`
3. Run client with `npm run start`
4. Once Expo starts:
    - Press `i` to start app on iOS
    - Press `a` to start app on Android
