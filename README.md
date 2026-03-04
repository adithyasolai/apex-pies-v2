# Apex Pies

An app for people looking to invest in companies, but don’t know where to start.

Visit app at https://apex-pies.com/

___
# Dev Notes

### Starting JS Server Locally (Dev)

- Put Firebase Project ID and API key in `.env.local` file. Use the `VITE_` prefix for all env vars (e.g. `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`).

- Run `npm run dev` in `/` project directory.
  - This uses Vite + TailwindCSS v4 under the hood. HMR applies instantly to both JS/TSX changes and CSS/Tailwind changes — no separate watch process needed.
  - The Vite dev server proxies `/fetchnumsaved`, `/fetchpies`, `/savepie`, and `/fetchsavedpie` to `http://127.0.0.1:5001` automatically.

- To preview a production build locally, run `npm run build` then `npm run preview`.

### Starting Flask Server Locally (Dev)

- Run `pip3 install -r requirements.txt` from `/src` project directory.
- Run `flask run` from `/src` project directory.
- For Debug mode, run `flask run --debug` uncommented.

### Starting Flask Server via Docker Locally (Dev) (Recommended)

**Prerequisites:**
1. Configure your OpenAI API key in `apex.env` file:
   - Open the `apex.env` file in the project root directory
   - Replace `<YOUR_OPENAI_API_KEY_HERE>` with your actual OpenAI API key
   - Example: `OPENAI_API_KEY=sk-proj-abc123...`
2. Ensure you are logged into the correct AWS account via `aws configure` so that your `~/.aws/` directory contains the necessary credentials for the Flask app to fetch Firebase secrets from AWS Secrets Manager

**Run the server:**
- Run `docker-compose up --build` from the project root directory
  - This will build the Docker image and start the Flask server on port 5001
  - The server will automatically be in Debug mode
  - Press `Ctrl+C` to stop the server
  - Run `docker-compose down` to remove the container

**What's happening:**
- Docker Compose reads environment variables from `apex.env` (including your OpenAI API key)
- It mounts your local AWS credentials directory (`~/.aws`) into the container (read-only)
- The Flask server runs on port 5000 inside the container, mapped to port 5001 on your host machine
- Port 5001 is used to avoid conflicts with macOS AirPlay Receiver on port 5000

**Alternative (manual Docker commands):**
- Run `docker build -t apex-dev .`
- Run `docker run -p 5001:5000 -v ~/.aws:/root/.aws:ro --env-file apex.env apex-dev`

### Building and Sending Docker Image for ECR
- `docker buildx build --platform=linux/amd64 -t apex .`
- `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com`
- `docker tag apex:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/apex:latest`
- `docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/apex:latest`

### Triggering new deploy of backend via ECS
- After pushing the Docker Image to ECR with steps above, run this: `aws --region us-east-1 ecs update-service --cluster apex-dev --service apex --force-new-deployment`

### Other Dev Workflow Tips
- Make a copy of src/api-endpoints.json and rename it 'api-endpoints-dev.json' (which is already gitignore'd so that it won't show up in commits). Change the endpoints to localhost:5001 in the `-dev.json` version of the file to avoid pushing localhost endpoints to the prod frontend server.

### Updating requirements.txt used by Docker when adding more dependencies for Flask backend
- `pipreqs ./src/ --force`

### Apply Prettier
- `npm run format` (look at script definition in `package.json` file)