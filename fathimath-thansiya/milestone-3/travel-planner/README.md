# Nomadica Travel Planner

A premium travel planning app built with React, Vite, Redux Toolkit, and a curated destination dataset. It includes destination discovery, saved favourites, trip creation, itinerary planning, expense tracking, and weather/country integrations.

## Features

- Editorial-style landing page and destination catalogue
- Destination search, budget and style filters, sorting, and pagination
- Favourites with localStorage persistence
- Trip creation and trip dashboard
- Itinerary planning with add/reorder/delete activity flow
- Expense tracking with category summaries and remaining budget calculations
- Weather data via Open-Meteo and country metadata via REST Countries
- Responsive, mobile-friendly UI with polished cards and premium styling

## Stack

- React + Vite
- Redux Toolkit + React Redux
- React Router DOM
- Axios
- Lucide React
- localStorage persistence

## Local setup

1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev -- --host 0.0.0.0
3. Open the local URL shown in the terminal, typically http://localhost:5173/

## Production build

npm run build

## Linting

npm run lint

## Deployment

### Netlify

1. Push the project to GitHub.
2. In Netlify, select Add new site > Import an existing project.
3. Choose the repository and set the build command to:
   npm run build
4. Set the publish directory to:
   dist
5. Deploy.

### Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Use the default Vite settings.
4. Vercel will run:
   npm install
   npm run build
5. Deploy the generated static app.

## Project architecture

- src/app/store.js — Redux store configuration
- src/data/destinations.js — local destination dataset
- src/features — Redux slices for destinations, trips, budget, and weather
- src/services — Axios API service modules
- src/components — reusable UI elements
- src/pages — app pages and screens
- src/utils — formatting helpers

## API notes

This app uses:

- Open-Meteo for weather data
- REST Countries for country metadata

The app is designed to degrade gracefully if either API is unavailable, and it avoids breaking the user experience when network data is missing.
