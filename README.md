

## Project Name : KisanConnect

**URL**: https://sih-project-one-zeta.vercel.app/

If you want to work locally using your own IDE, you can clone this repo and push changes. 

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- RapidAPI (Google Maps Places API)
- Google Gemini AI (Chatbot)

## AI Chatbot Setup

The platform includes a floating AI chatbot powered by Google's Gemini AI that can help with:
- Agricultural advice and farming questions
- Platform navigation and features
- Price comparisons and tool availability  
- General queries (both agriculture and non-agriculture related)

**To enable the AI chatbot:**

1. **Get a Gemini API Key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the generated key

2. **Set up the API Key:**
   - Update your `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Features:**
   - 🤖 **Floating chat bubble** in bottom-right corner
   - 💬 **Expands to full chat window** when clicked
   - 🌾 **Agriculture-focused** but handles all types of questions
   - 📱 **Mobile-responsive** design
   - 💾 **Chat history** within session
   - ⚡ **Real-time responses** powered by Gemini AI

**Note:** Without an API key, the chatbot works in demo mode with basic functionality.

## RapidAPI Setup (Recommended)

To enable the location search functionality in the Add New Land page using RapidAPI:

1. **Get a RapidAPI Account:**
   - Go to [RapidAPI.com](https://rapidapi.com/)
   - Create a free account

2. **Subscribe to Google Map Places API:**
   - Search for "Google Map Places (New V2)" on RapidAPI
   - Subscribe to the API (usually has a free tier)
   - Copy your RapidAPI key from the API dashboard

3. **Set up the API Key:**
   - Update your `.env` file with:
   ```
   VITE_RAPIDAPI_KEY=your_rapidapi_key_here
   VITE_RAPIDAPI_HOST=google-map-places-new-v2.p.rapidapi.com
   ```

4. **Restart the development server** after updating the `.env` file

**Benefits of RapidAPI:**
- ✅ Easier setup than direct Google Maps API
- ✅ Unified billing and management
- ✅ Better rate limiting and monitoring
- ✅ Often more generous free tiers

## Alternative: Direct Google Maps Setup

If you prefer to use Google Maps API directly:

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Maps JavaScript API" 
   - Create an API Key in the Credentials section

2. **Set up the API Key:**
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_api_key_here
   ```

**Note:** Without a valid API key, the location picker will show manual coordinate input functionality.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/518fa889-9c60-4e8d-b6bb-74deb62a6dfe) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
=======
# SIH_Project.
>>>>>>> d395d1bba92c17b092c05a84f2f1e0235072128d
