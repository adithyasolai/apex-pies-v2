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
- Run `docker build -t my_flask_app .`
- Run `docker run -p 5000:5000 my_flask_app`