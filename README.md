# deploy-demo

A minimal Express app for practicing CI/CD: tests → Docker build → auto-deploy to Render on every push to `main`.

## What's in here

- `app.js` — tiny Express server (`/`, `/health`, `/version`)
- `test/app.test.js` — tests using Node's built-in test runner
- `Dockerfile` — containerizes the app
- `.github/workflows/deploy.yml` — GitHub Actions pipeline: test → build → deploy
- `render.yaml` — Render "Blueprint" so Render knows how to run the service

## Run it locally

```bash
npm install
npm start          # http://localhost:3000
npm test           # runs the test suite
```

## Deploy to Render (step by step)

1. **Push this project to a new GitHub repo.**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<you>/deploy-demo.git
   git push -u origin main
   ```

2. **Create the Render service.**
   - Go to https://dashboard.render.com → New → Web Service
   - Connect your GitHub repo
   - Render will detect `render.yaml` and configure itself (Docker runtime, health check at `/health`)
   - Click **Create Web Service** — this deploys once manually so you have a working URL

3. **Get a Deploy Hook (so GitHub Actions can trigger deploys).**
   - In the Render service → **Settings** → **Deploy Hook**
   - Copy the URL (looks like `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`)

4. **Add it as a GitHub secret.**
   - In your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - New repository secret: name `RENDER_DEPLOY_HOOK_URL`, value = the URL you copied

5. **Push to `main`.**
   - GitHub Actions runs tests → builds the Docker image → calls the deploy hook
   - Watch it in your repo's **Actions** tab
   - Render will rebuild and redeploy automatically; check the live URL after a minute or two

## Practicing the "scary parts"

Once this is working, try:
- **Break a test on purpose** and push — confirm the deploy step never runs when tests fail
- **Roll back** — in Render's dashboard, redeploy a previous successful build
- **Add an env var** (e.g. `APP_VERSION`) in Render's dashboard and confirm `/version` reflects it without a code change
- **Force a bad deploy** — introduce a syntax error, push it, and practice reverting the commit and redeploying
- **Swap platforms** — the same Dockerfile works on Railway or Fly.io with minimal changes, so try deploying the same repo there too and compare the experience
# deploy-demo
