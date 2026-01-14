# Marine Species Recognition POC
Built by Ocean's 4 Team, Thomas More, Digital Product Architecture
for testing AI powered marine species identification.
Live Demo: https://marine-species-spotting.vercel.app/

## What We Did
We built a proof of concept app to test if we could use Google's Gemini AI
to identify marine species from photos and videos.
The idea was to see if this could work for dive logs where you take
heaps of photos underwater and want to know what species you saw.

The app has 2 modes. Single photo mode where you upload
one image and it tells you what species it is with all the details
like habitat, size, behaviour and if its dangerous.
Then theres dive log mode where you can upload multiple photos
at once and it analyses everything and organises it into categories
like new species discovered, rare ones, dangerous ones and common ones
sorted by fish, corals, crabs etc.

We used Next.js for the frontend,
Gemini 2.5 Flash model for the AI analysis,
and Tailwind for styling.
No heavy visuals.
The API endpoints are protected with API keys
so other apps can use it too.

## How to Run It
We installed Node.js, Gemini API key from Google AI Studio,
and we wrote code at Webstorm IDE

Run `npm install`,
create a `.env.local` file
with `GEMINI_API_KEY`,
then run `npm run dev` and go to localhost:3000

For deployment we used Vercel.
We added Gemini API key as an environment variable.

## Test Results
The AI identification works pretty well for common marine species.
It can handle single photos and bulk uploads.
The categorisation into new, rare, dangerous and common species is working.
We added detailed modals that pop up when you click on any
species card showing all the info.

## Our Challenges & Limitations
Main limitation we found is the free tier quota.
Gemini 2.5 Flash gives way better quality for marine species identification
but only has 20 requests per day free.
We also tested Gemini 1.5 Flash which has 1500 requests per day
but it doesn't work as well for identifying species accurately.
For production we definitely need a paid version to handle real usage.

## API Endpoints
If you want to use our API from another app go
to `/api-docs` and generate an API key.
Then send requests to:
`/api/classify` for single photos
`/api/batch-classify` for multiple photos
And then, include the header `x-api-key` with your generated key.

## Tech Stack
Next.js 15 + Node.js
(full-stack with API routes,
Next.js runs on Node.js runtime)
TypeScript
Tailwind CSS (in globals.css)
Google Gemini AI
Custom API key auth
