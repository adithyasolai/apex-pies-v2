# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Useful Flows

### Starting JS Server Locally (Dev)

- Put Firebase Project ID and API key in `.env.local` file.

- Run `npm start` in `/` project directory.

### Starting Flask Server Locally (Dev)

- Run `pip3 install -r requirements.txt` from `/src` project directory.
- Run `flask run` from `/src` project directory.
- For Debug mode, run `python3 /src/app.py` with `app.run(debug=True)` uncommented.

### Starting Flask Server via Docker Locally (dev)
- Run `docker build -t apex .`
- Run `docker run -p 5000:5000 apex`

### Building and Sending Docker Image for ECR
- `docker buildx build --platform=linux/amd64 -t apex .`
- `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 212840871911.dkr.ecr.us-east-1.amazonaws.com`
- `docker tag apex:latest 212840871911.dkr.ecr.us-east-1.amazonaws.com/apex:latest`
- `docker push 212840871911.dkr.ecr.us-east-1.amazonaws.com/apex:latest`