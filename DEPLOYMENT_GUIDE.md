# FlowHer Application Deployment Guide

This guide will walk you through deploying your full-stack application.
- **Backend (.NET 8 API)**: Deployed to [Render](https://render.com).
- **Database (PostgreSQL)**: Hosted on [Render](https://render.com).
- **Frontend (React + Vite)**: Deployed to [Vercel](https://vercel.com).

---

## Prerequisites
1.  Push your latest code to a GitHub repository.
2.  Create accounts on **Render** and **Vercel**.

---

## Part 1: Database (Render)
1.  Go to your Render Dashboard.
2.  Click **New +** -> **PostgreSQL**.
3.  **Name**: `flowher-db`.
4.  **Region**: Choose the one closest to you.
5.  **Plan**: Free (if available) or Starter.
6.  Click **Create Database**.
7.  Once created, copy the **Internal Connection String** (starts with `postgres://...`). You will need this for the Backend API.

---

## Part 2: Backend API (Render)
1.  Go to your Render Dashboard.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Configuration**:
    *   **Name**: `flowher-api`
    *   **Region**: Same as your database.
    *   **Runtime**: **Docker**
    *   **Build Context Directory**: `backend/FlowHerAPI`  *(Important!)*
    *   **Dockerfile Path**: `Dockerfile` (Since our context is `backend/FlowHerAPI`, the file inside it is just `Dockerfile`)
5.  **Environment Variables** (Scroll down to "Advanced" or "Environment"):
    Add the following keys and values:
    *   `ConnectionStrings__DefaultConnection`: Paste your Database External Connection String here (Note: Use "External" if you are testing connectivity from outside, but "Internal" is faster if both are on Render. For simplicity, you can use the Internal one. *If the Internal one fails to connect initially, try the External one*).
        *   *Tip: Render's internal URL looks like `postgres://user:pass@hostname/db`. Ensure it is the full string.*
    *   `Jwt__Key`: Generate a random string (at least 32 chars).
    *   `Jwt__Issuer`: `FlowHerAPI`
    *   `Jwt__Audience`: `FlowHerApp`
    *   `AllowedOrigins`: `http://localhost:5173` (We will add your Vercel URL here later).
6.  Click **Create Web Service**.
7.  Wait for the build to finish. Once "Live", copy your **Service URL** (e.g., `https://flowher-api.onrender.com`).

---

## Part 3: Frontend (Vercel)
1.  Go to your Vercel Dashboard.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configuration**:
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Root Directory**: `./` (Default).
5.  **Environment Variables**:
    *   `VITE_API_URL`: Paste your Render Backend URL + `/api`.
        *   Example: `https://flowher-api.onrender.com/api`
        *   *Note: Do not include a trailing slash.*
6.  Click **Deploy**.
7.  Once done, copy your **Vercel App Domain** (e.g., `https://flowher-app.vercel.app`).

---

## Part 4: Final Connection
1.  Go back to your **Render Web Service** -> **Environment**.
2.  Edit `AllowedOrigins`.
3.  Add your Vercel URL. You can separate multiple origins with a comma.
    *   Example: `http://localhost:5173,https://flowher-app.vercel.app`
4.  **Save Changes**. Render will redeploy the backend automatically.

---

## Troubleshooting
-   **Database**: If the backend says "Database does not exist", your code uses `EnsureCreated()`, so it should create the tables automatically. Check logs for connection errors.
-   **CORS Service Errors**: If the frontend fails to fetch data (red errors in console), ensure `AllowedOrigins` in Render matches your Vercel URL exactly (no trailing slash usually).
