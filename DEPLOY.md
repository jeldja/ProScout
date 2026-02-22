# Deploying ProScout: Backend on Render, Frontend on Vercel

This guide walks you through deploying the **Backend (Flask API)** on **Render** and the **Frontend (React/Vite)** on **Vercel**, then connecting them.

---

## Before you start

- Your code is pushed to **GitHub** (e.g. `github.com/your-username/ProScout`).
- You have accounts on [Render](https://render.com) and [Vercel](https://vercel.com).

---

## Part 1: Deploy the Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com) and log in.

2. Click **New +** → **Web Service**.

3. **Connect your repo**
   - Connect GitHub if you haven’t.
   - Select the **ProScout** repository.
   - Click **Connect**.

4. **Configure the service**
   - **Name:** `proscout-api` (or any name; you’ll use this in the URL).
   - **Region:** Choose one (e.g. Oregon).
   - **Branch:** `main`.
   - **Root Directory:** `Backend`  
     (Important: so Render runs commands inside the Backend folder.)
   - **Runtime:** `Python 3`.
   - **Build Command:**  
     `pip install -r requirements.txt`
   - **Start Command:**  
     `gunicorn --bind 0.0.0.0:$PORT app:app`

5. **Environment**
   - (Optional now) Add **FRONTEND_ORIGIN** later, after you have the Vercel URL (see Part 3).

6. Click **Create Web Service**. Wait for the first deploy to finish.

7. **Copy your backend URL**  
   It looks like: `https://proscout-api.onrender.com`  
   (Use the exact URL Render shows for your service.)

---

## Part 2: Deploy the Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and log in.

2. Click **Add New…** → **Project**.

3. **Import the repo**
   - Import your **ProScout** GitHub repo.
   - Click **Import**.

4. **Configure the project**
   - **Root Directory:** Click **Edit**, set to `Frontend`, then **Continue**.
   - **Framework Preset:** Vite (should be auto-detected).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default).

5. **Environment variable (required for API)**
   - Open **Environment Variables**.
   - Add:
     - **Name:** `VITE_API_BASE_URL`
     - **Value:** Your Render backend URL from Part 1, e.g.  
       `https://proscout-api.onrender.com`  
       (No trailing slash. Do **not** add `/api` unless your backend uses that path.)
   - Apply to **Production** (and Preview if you want).

6. Click **Deploy**. Wait for the build to finish.

7. **Copy your frontend URL**  
   It looks like: `https://proscout-xxx.vercel.app` (or your custom domain).

---

## Part 3: Connect Frontend and Backend (CORS)

So the browser can call your API from the Vercel site, set the backend’s allowed origin:

1. In **Render**, open your **proscout-api** service.
2. Go to **Environment**.
3. Add:
   - **Key:** `FRONTEND_ORIGIN`
   - **Value:** Your Vercel frontend URL from Part 2, e.g.  
     `https://proscout-xxx.vercel.app`  
     (No trailing slash.)
4. Save. Render will redeploy automatically.

After the redeploy, the frontend on Vercel can call the backend on Render without CORS errors.

---

## Quick reference

| Where   | What to set              | Example value                          |
|--------|---------------------------|----------------------------------------|
| Render | Root Directory           | `Backend`                              |
| Render | Build Command            | `pip install -r requirements.txt`      |
| Render | Start Command            | `gunicorn --bind 0.0.0.0:$PORT app:app`|
| Render | Env: FRONTEND_ORIGIN     | `https://proscout-xxx.vercel.app`       |
| Vercel | Root Directory           | `Frontend`                             |
| Vercel | Env: VITE_API_BASE_URL   | `https://proscout-api.onrender.com`    |

---

## Troubleshooting

- **Frontend shows “API error” or network errors**  
  - Check **VITE_API_BASE_URL** on Vercel: must be exactly your Render backend URL (no trailing slash).  
  - Redeploy the Vercel project after changing env vars (Vite bakes them in at build time).

- **CORS errors in the browser**  
  - Set **FRONTEND_ORIGIN** on Render to your exact Vercel URL (no trailing slash).  
  - Wait for Render to finish redeploying.

- **Render: “requirements.txt not found”**  
  - Set **Root Directory** to `Backend` so the build runs inside the Backend folder.

- **Vercel: 404 on refresh or direct URL**  
  - The repo includes `Frontend/vercel.json` with SPA rewrites so all routes serve `index.html`. If you still see 404s, ensure the project’s root directory is `Frontend` so `vercel.json` is used.
