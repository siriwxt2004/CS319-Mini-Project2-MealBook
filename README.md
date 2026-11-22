# Meal Book

Meal Book is a React frontend backed by an Express API, Prisma ORM, and PostgreSQL. Runtime meal, favorite, and meal-plan data is read from the application database; the app does not fetch recipes from a third-party API.

## Run locally

1. Configure `mealbook-server/.env` using `.env.example`. Set `DATABASE_URL` to the Supabase transaction-pooler URL and `DIRECT_URL` to the Supabase direct/session-pooler URL. Keep the real `.env` private.
2. In `mealbook-server`, install dependencies and apply the database migrations:

   ```powershell
   cd mealbook-server
   npm install
   npx prisma migrate dev
   npx prisma generate
   npm run seed
   ```

   The seed script imports the local `sample-data.json` snapshot into PostgreSQL. It does not call an external API.
3. Start the backend in one terminal:

   ```powershell
   cd mealbook-server
   npm run dev
   ```

4. Start the frontend in another terminal:

   ```powershell
   cd mealbook-client
   npm install
   npm run dev
   ```

The Vite development server proxies `/api` requests to `http://localhost:3000`. Set `VITE_API_URL` when deploying the frontend separately from the API.

## Demo account

Open the login page and enter an email and password. A new email creates an account; later logins must use the same password. Passwords are intentionally stored as plain text only because this is a classroom demo. Do not use a real or reused password.
