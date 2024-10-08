# Apex Pies

An app for people looking to invest in companies, but don’t know where to start.

Visit app at https://apex-pies.com/

___
# Dev Notes

### Starting JS Server Locally (Dev)

- Put Firebase Project ID and API key in `.env.local` file.

- Run `npm run start` in `/` project directory.
  - Since this uses `react-scripts`, it uses webpack under the hood, which means any local code changes will automatically restart the local JS server with your changes.
  - However, this only works well for JS changes. SCSS code changes will not be automatically re-compiled into the output css file. To do this, open a separate terminal and run `npm run watch-scss` from the `/` project directory.

### Starting Flask Server Locally (Dev)

- Run `pip3 install -r requirements.txt` from `/src` project directory.
- Run `flask run` from `/src` project directory.
- For Debug mode, run `flask run --debug` uncommented.

### Starting Flask Server via Docker Locally (Dev) (Recommended)
- Run `docker build -t apex-dev .`
- Run `docker run -p 5000:5000 apex-dev` (this will automatically be in Debug mode)

### Building and Sending Docker Image for ECR
- `docker buildx build --platform=linux/amd64 -t apex .`
- `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com`
- `docker tag apex:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/apex:latest`
- `docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/apex:latest`

### Triggering new deploy of backend via ECS
- After pushing the Docker Image to ECR with steps above, run this: `aws --region us-east-1 ecs update-service --cluster apex-dev --service apex --force-new-deployment`

### Other Dev Workflow Tips
- Make a copy of src/api-endpoints.json and rename it 'api-endpoints-dev.json' (which is already gitignore'd so that it won't show up in commits). Change the endpoints to localhost in the `-dev.json` version of the file to avoid pushing localhost endpoints to the prod frontend server.

### Updating requirements.txt used by Docker when adding more dependencies for Flask backend
- `pipreqs ./src/ --force`