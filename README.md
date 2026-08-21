# ShoeMart — Full Stack E-Commerce Project

A complete e-commerce site: **React.js + Redux Toolkit** frontend, **Node.js + Express** backend,
**PostgreSQL via Supabase** database, **JWT auth**. Features: product browsing, search & filtering,
cart, wishlist, checkout (Cash on Delivery), order history, and order cancellation.

## 🔗 Live Demo

| | Link | Hosted on |
|---|---|---|
| **Website (frontend)** | **https://shoe-mart-bay.vercel.app** | Vercel |
| **API (backend)** | https://shoemart-backend-j595.onrender.com | Render (free tier) |
| **API health check** | https://shoemart-backend-j595.onrender.com/ → `{"message":"ShoeMart API is running 🚀"}` | |
| **Sample API response** | https://shoemart-backend-j595.onrender.com/api/products?limit=4 | |
| **Source code** | https://github.com/Vuday3336/ShoeMart | GitHub |

> **Note:** the backend is on Render's free tier, which spins down after 15 minutes of inactivity.
> The **first** request after idle time can take up to ~50 seconds to wake up — this is normal free-tier
> cold-start behavior, not a bug. Once awake, it responds instantly until it goes idle again.

This guide assumes **zero prior setup** and walks through everything in order. Follow it top to bottom
if you want to run it locally or redeploy it yourself.

---

## 0. What you need installed first

1. **Node.js** (v18 or newer) — download from https://nodejs.org (LTS version). Verify with:
   ```
   node -v
   npm -v
   ```
2. **VS Code** — https://code.visualstudio.com
3. **Git** — https://git-scm.com/downloads. Verify with:
   ```
   git --version
   ```
4. A free **Supabase** account — https://supabase.com
5. A free **GitHub** account — https://github.com

---

## 1. Unzip and open the project in VS Code

1. Unzip `shoemart.zip` anywhere on your computer, e.g. `Desktop/shoemart`.
2. Open VS Code → `File > Open Folder` → select the `shoemart` folder.
3. You'll see two folders inside: `backend/` and `frontend/`. Open a terminal in VS Code with
   `` Ctrl + ` `` (backtick) — you'll use this terminal for every command below.

---

## 2. Create your Supabase project (the database)

1. Go to https://supabase.com → sign in → **New Project**.
2. Fill in:
   - **Name**: `shoemart` (or anything)
   - **Database Password**: create a strong password and **save it somewhere** — you'll need it in step 3.
   - **Region**: pick the one closest to you.
3. Click **Create new project** and wait ~2 minutes while it provisions.
4. Once it's ready, go to the left sidebar → **SQL Editor** → **New query**.
5. Open the file `backend/config/schema.sql` from this project in VS Code, copy its **entire contents**,
   paste it into the Supabase SQL editor, and click **Run**.
   - This creates all 6 tables: `users`, `products`, `cart_items`, `wishlist_items`, `orders`, `order_items`.
6. Confirm it worked: left sidebar → **Table Editor** — you should see the tables listed.

### Get your connection string

1. Left sidebar → **Project Settings** (gear icon) → **Database**.
2. Scroll to **Connection string** → select the **URI** tab.
3. Copy the string. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with the database password you created in step 2. Keep this handy for step 3.

---

## 3. Set up and run the backend

In the VS Code terminal:

```bash
cd backend
npm install
```

This installs Express, pg (PostgreSQL driver), JWT, bcrypt, etc.

### Configure environment variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
   (On Windows PowerShell, use: `copy .env.example .env`)
2. Open the new `.env` file in VS Code and fill in:
   ```
   PORT=5000
   CLIENT_URL=http://localhost:5173
   DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   JWT_SECRET=any_long_random_string_you_make_up_here
   JWT_EXPIRES_IN=7d
   ```
   - Paste your real Supabase connection string (with password filled in) as `DATABASE_URL`.
   - For `JWT_SECRET`, type any long random string (e.g. mash your keyboard) — this signs your login tokens.

### Seed sample products (optional but recommended)

```bash
npm run seed
```
This inserts 12 sample shoes into your database so the site isn't empty.

### Run the backend

```bash
npm run dev
```

You should see:
```
✅ Connected to Supabase PostgreSQL database
✅ ShoeMart backend running on http://localhost:5000
```

Leave this terminal running. Test it works by opening http://localhost:5000 in your browser —
you should see `{"message":"ShoeMart API is running 🚀"}`.

**Troubleshooting:**
- `ECONNREFUSED` or SSL errors → double check your `DATABASE_URL` password and that you copied the full string.
- `relation "products" does not exist` → you forgot to run `schema.sql` in the Supabase SQL Editor (step 2).

---

## 4. Set up and run the frontend

Open a **second** terminal in VS Code (click the `+` icon in the terminal panel, or `` Ctrl+Shift+` ``)
so the backend keeps running in the first one.

```bash
cd frontend
npm install
cp .env.example .env
```

The default `frontend/.env` already points to `http://localhost:5000/api`, which matches your backend —
no changes needed for local development.

```bash
npm run dev
```

You should see something like:
```
VITE v5.x.x  ready in 400 ms
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser. You should see the ShoeMart homepage with products
(if you ran the seed script). Register an account, browse products, add to cart, and place a test order.

---

## 5. Project structure reference

```
shoemart/
├── backend/
│   ├── config/
│   │   ├── db.js            # PostgreSQL connection pool
│   │   └── schema.sql       # Run this in Supabase SQL Editor
│   ├── controllers/         # Business logic (auth, products, cart, wishlist, orders)
│   ├── middleware/auth.js   # JWT verification
│   ├── routes/               # API route definitions
│   ├── seed.js               # Sample product data loader
│   ├── server.js             # Express app entry point
│   └── .env                  # Your secrets (never commit this)
└── frontend/
    ├── src/
    │   ├── api/axios.js      # Axios instance with JWT auto-attach
    │   ├── components/       # Navbar, Footer, ProductCard, etc.
    │   ├── pages/             # Home, Products, Cart, Checkout, Orders, etc.
    │   ├── store/             # Redux Toolkit store + slices (auth, cart, wishlist)
    │   └── App.jsx             # Routes
    └── .env                   # Points to your backend API URL
```

### API endpoints (for reference)

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/products | No | List products (supports `?q=&category=&minPrice=&maxPrice=&sort=&page=`) |
| GET | /api/products/:id | No | Product detail |
| POST | /api/cart | Yes | Add item to cart |
| GET | /api/cart | Yes | Get current user's cart |
| PUT | /api/cart/:id | Yes | Update quantity |
| DELETE | /api/cart/:id | Yes | Remove item |
| GET | /api/wishlist | Yes | Get wishlist |
| POST | /api/wishlist | Yes | Add to wishlist |
| POST | /api/orders | Yes | Place order (COD), from cart |
| GET | /api/orders | Yes | Order history |
| PUT | /api/orders/:id/cancel | Yes | Cancel a pending order |

---

## 6. Push the project to GitHub

In the VS Code terminal, from the **root** `shoemart` folder (not inside backend or frontend):

```bash
git init
git add .
git status
```

Check the output of `git status` — you should **not** see `.env` files listed (they're excluded by
`.gitignore`). If you do see them, stop and check your `.gitignore` files before continuing.

```bash
git commit -m "Initial commit: ShoeMart full stack e-commerce app"
```

### Create the GitHub repo

1. Go to https://github.com/new
2. Repository name: `shoemart`
3. Keep it **Public** (or Private if you prefer) — do **not** initialize with a README (you already have one).
4. Click **Create repository**.
5. Copy the commands GitHub shows under "…or push an existing repository from the command line", or run:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shoemart.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. If prompted, log in via the browser popup or a
personal access token.

Your code is now on GitHub. Add the repo link to your resume/portfolio.

---

## 7. Deploy it live (free tier)

### Backend → Render.com

This repo includes a `render.yaml` Blueprint, so Render can configure the service automatically.

1. Go to https://render.com → sign up/log in with GitHub.
2. **New +** → **Blueprint** → connect your `shoemart` GitHub repo. Render reads `render.yaml` and
   pre-fills the service (root dir `backend`, build/start commands).
3. It will prompt you for the secret env vars marked `sync: false`: paste in `DATABASE_URL` (your
   Supabase connection string), `JWT_SECRET` (from your local `backend/.env`), and `CLIENT_URL`
   (leave as `http://localhost:5173` for now — you'll update it after deploying the frontend).
4. Click **Apply**. Render gives you a URL like `https://shoemart-backend.onrender.com`.

(No Blueprint? You can also do **New + → Web Service** manually with Root Directory `backend`,
Build Command `npm install`, Start Command `npm start`, and the same env vars.)

### Frontend → Vercel

1. Go to https://vercel.com → sign up/log in with GitHub.
2. **Add New** → **Project** → import your `shoemart` repo.
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable: `VITE_API_URL` = `https://shoemart-backend.onrender.com/api`
   (use your actual Render URL from above, with `/api` at the end).
5. Click **Deploy**. Vercel gives you a URL like `https://shoemart.vercel.app`.

### Final step: connect them

Go back to Render → your backend service → Environment → update `CLIENT_URL` to your Vercel URL
(e.g. `https://shoemart.vercel.app`) so CORS allows requests from your live frontend. Save — Render
will redeploy automatically.

Your app is now live end-to-end.

---

## 8. Common issues

| Problem | Fix |
|---|---|
| Frontend shows "Network Error" | Backend isn't running, or `VITE_API_URL` in frontend `.env` is wrong |
| "Not authorized, no token" on cart/orders | You're not logged in, or the token expired — log in again |
| Products page is empty | Run `npm run seed` in the backend folder |
| CORS error in browser console | `CLIENT_URL` in backend `.env` doesn't match the frontend's actual URL |
| Supabase SSL connection error | Make sure you're using the connection string from Supabase exactly, with your real password |

---

## 9. What to say about this project (for your resume/interviews)

- Built a full-stack e-commerce platform (React.js, Redux Toolkit, Node.js, Express.js, PostgreSQL/Supabase)
- Implemented JWT authentication with protected routes on both frontend (route guards) and backend (middleware)
- Designed a normalized relational schema (users, products, cart_items, wishlist_items, orders, order_items)
  with foreign keys and transactional order placement (`BEGIN`/`COMMIT`/`ROLLBACK`) to keep stock counts consistent
- Built REST APIs with search, filtering, sorting, and pagination for product discovery
- Used Redux Toolkit with async thunks for cart/wishlist state, synced with the backend for persistence across sessions
- Implemented COD checkout, order history, and order cancellation with stock restoration
