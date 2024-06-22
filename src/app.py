from flask import Flask
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request

import pandas as pd
import random

import yfinance as yf
import requests

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from html.parser import HTMLParser

import plotly.express as px
import chart_studio
import chart_studio.plotly as py2
import chart_studio.tools as tls

import os
import pprint

'''
HOW TO USE THIS SERVER SCRIPT:
`pip install flask` and `pip install flask_cors` before running this server.

Run the `export FLASK_ENV=development` terminal command once before any subsequent `flask run` commands.
'''

# Firebase setup
# Fetch the service account key JSON file contents
cred = credentials.Certificate('./apex-pies.json')

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://apex-pies-default-rtdb.firebaseio.com'
})


'''
GET/POST Handlers that get called by front-end.
'''

app = Flask(__name__)
CORS(app)


@app.route('/health', methods=['GET'])
def health_check():
    return {'status': 'ok'}, 200

@app.route('/', methods=['POST'])
def calculatePies():
    app.logger.info("Starting / POST Run...")
    app.logger.info("Request JSON: " + pprint.pformat(request.json))
    uid = request.json['uid']
    email = request.json['email']
    age = int(request.json['age'])
    risk = int(request.json['risk'])
    sector = request.json['sector']
    is_guest = request.json['is_guest']

    app.logger.info(
        f"""
        Front-End Request:
        Age {age}
        Risk {risk}
        Sector {sector}
        UID {uid}
        Email {email}
        is_guest {is_guest}
        """
    )

    # TODO: Pie Calculation Algorithm goes here!
    publishPieToDB(
        age, 
        risk, 
        sector, 
        uid, 
        email,
        is_guest
    )

    app.logger.info("Finished / POST Run...")

    response = jsonify("POST Reply Message")

    return response

# TODO: Debug why this can't be made a GET request as it should be.
@app.route('/fetchpies', methods=['POST'])
def fetchPies():
    app.logger.info("Starting /fetchpies POST Run...")

    uid = request.json['uid']
    is_guest = request.json['is_guest']

    user_directory_ref = db.reference().child("guests") if is_guest else db.reference().child("users")

    result = user_directory_ref.child(uid)

    resultDict = result.get()

    # Append Plotly credentials to API
    resultDict['username'] = "adithyasolai"
    resultDict['apiKey'] = "TibH1jVTDgFFrOA1bbE6"

    app.logger.info("Result Dict Sent to User: \n" +
                    pprint.pformat(resultDict))

    return jsonify(resultDict)


'''
Helper methods used by GET/POST Handlers.
'''

# This function uses the diversification + balance algorithm to create a DataFrame that represents
# the final Pie Portfolio. Then, this function uses a helper function to plot the pie and publish
# the plot to the Plotly servers. Finally, this function pubilshes portfolio data and Plotly plot
# data to the FireBase DB for this user.


def publishPieToDB(age, risk, sector, userId, email, is_guest: bool):
    pieDf = makePie(age, risk, sector)
    app.logger.info("New Pie: \n" + pprint.pformat(pieDf))

    vizLink = makeViz(userId, pieDf)
    app.logger.info(pprint.pformat("New Viz Link: \n" + vizLink))

    # Get the HTML code that enables the front-end to directly embed the Pie
    # Chart from Plotly's servers
    iframe = tls.get_embed(vizLink)
    app.logger.info(pprint.pformat("New iFrame HTML: \n" + iframe))

    # Publish Pie portfolio details and Plotly embed details to the Firebase
    # DB for this user
    user_directory_ref = db.reference().child("guests") if is_guest else db.reference().child("users")
    ref = user_directory_ref.child(userId)
    ref.set({
        # 'r' records option stores each row as a dict in an overall array
        'pie': pieDf.to_dict('records'),
        'avgBeta': pieDf['Beta'].mean(),
        'vizLink': vizLink,
        'iframe': iframe,
        'email': email
    })

    app.logger.info("Published data to Firebase DB...")

# Uses the pie portfolio data in pieDf to create a Plotly Pie Chart,
# and publishes that Pie to Plotly's servers so that it can be fetched by
# the front-end later.


def makeViz(userID, pieDf):
    username = 'adithyasolai'
    api_key = 'TibH1jVTDgFFrOA1bbE6'

    # Fetch data needed for the Pie plot from `pieDf`
    tickers_list = pieDf['Ticker'].tolist()
    name_list = pieDf['Name'].tolist()
    sectors_list = pieDf['Sector'].tolist()
    marketcap_list = pieDf['Market Cap'].round(2).tolist()
    beta_list = pieDf['Beta'].tolist()

    # Just giving equal % weightage to each slice of the pie
    vals = [100 / len(pieDf.index)] * len(pieDf.index)

    # This map determines what data is available to be shown in the hovertext
    # of each slice
    df = pd.DataFrame({"Ticker": tickers_list,
                       "Name": name_list,
                       "Percentage": vals,
                       "Sector": sectors_list,
                       "Market Cap": marketcap_list,
                       "Beta": beta_list
                       })

    # Determines which data should be shown on the slices itself, the legend
    # on the right, and which data should be used for hovertext
    fig = px.pie(df, values="Percentage", names="Ticker",
                 hover_data=["Name", "Sector", "Market Cap", "Beta"])

    # Configure hovertext formatting. Omitting Percentage because that is
    # shown on the slice itself.
    fig.update_traces(
        hovertemplate=' Ticker: %{label} <br> Name: %{customdata[0][0]} <br> Sector: %{customdata[0][1]} <br> Market Cap: $%{customdata[0][2]} M <br> Beta: %{customdata[0][3]}')

    # make plot's background color transparent so that front-end background color can show
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)', 
        plot_bgcolor='rgba(0,0,0,0)',
        showlegend=False
    )

    # Publishes this Pie to the Plotly server
    chart_studio.tools.set_credentials_file(username=username, api_key=api_key)
    fileName = str(userID) + "-viz"
    vizLink = py2.plot(fig, filename=fileName, auto_open=False)

    return vizLink


'''
Pie-Making Diversification + Beta Balancing Logic
'''


def makePie(userAge, userRiskTolerance, userSectorOfInterest):
    targetPortfolioBeta = calculateTargetPortfolioBeta(
        userAge, userRiskTolerance)

    # Now that we have finalized a target beta for the portfolio,
    # we can start the stock-picking algorithm that tries to balance
    # the final portfolio to meet the target portfolio beta.

    # Fetch stock data from csv
    stocksDataDf = pd.read_csv(os.path.join(os.path.dirname(
        __file__), "./resources/stocks_from_script.csv"))

    # A df that describes the final overall Pie.
    # Each row is information about one stock chosen for the Pie.
    pieDf = pd.DataFrame(columns=stocksDataDf.columns)

    # Choose a first stock for the portfolio that has a beta close to the target portfolio beta
    # to assist the beta balancing algorithm.
    # Choose the first stock from the user's selected Sector of Interest
    firstStockData = pickFirstStock(
        userSectorOfInterest, targetPortfolioBeta, stocksDataDf)

    # Add the first chosen stock to the portfolio
    pieDf = pieDf._append(firstStockData)

    # fetch the beta of the first stock
    firstStockBeta = firstStockData['Beta']

    # If the first chosen stock's beta is less than the target portfolio beta, then the next chosen stock
    # should raise the beta. Otherwise, the next chosen stock should reduce
    # the beta.
    raiseBeta = firstStockBeta < targetPortfolioBeta

    # Choose the remaining stocks using the `raiseBeta` from the first chosen stock as a starting point.
    # The space at the end of "Energy " IS REQUIRED BECAUSE OF THE DATA FORMAT
    # TODO: Remove this extra space in the df cleaning or in the csv data
    # itself. (probably better to clean the df)
    sectors = ["Technology", "Health Care", "Banking", "Energy "]
    for sector in sectors:
        # If we are picking stocks for the user's selected Sector of Interest, then
        # pick 10 stocks in that sector. Otherwise, pick only 3 stocks for each of the remaining sectors.
        # We have already picked the first stock in the portfolio from the user's selected Sector of Interest.
        # Therefore, the final portfolio will have 11 stocks from the user's selected Sector after we pick 10
        # more stocks from that Sector. The final portfolio will also have 9 stocks combined from the other 3
        # sectors because we pick 3 stocks in each. In total, there will be 20 stocks in the portfolio with
        # equal 5% weightage given to each.
        if (sector == userSectorOfInterest):
            numberOfStocksToPick = 10
        else:
            numberOfStocksToPick = 3

        for _ in range(numberOfStocksToPick):
            chosenStockData = pickRandomStock(
                sector, targetPortfolioBeta, raiseBeta, stocksDataDf)

            # Add the chosen stock to the portfolio
            pieDf = pieDf._append(chosenStockData)

            # Re-calculate the new average beta of the portfolio
            newPortfolioBeta = pieDf['Beta'].mean()

            # Re-evaluate whether the next chosen stock should raise or reduce
            # the portfolio's beta
            raiseBeta = newPortfolioBeta < targetPortfolioBeta

    return pieDf


def calculateTargetPortfolioBeta(userAge, userRiskTolerance):
    # The Keys are the possible Risk Tolerance levels (1-10) from the user.
    # The Values are baseline betas for a portfolio made with the key's Risk Tolerance level.
    # TODO: May need to consider storing this in the Firebase DB, or at least
    # as a global variable.
    riskToleranceBetaDict = {
        1: 0.7,
        2: 0.75,
        3: 0.8,
        4: 0.9,
        5: 1.0,
        6: 1.05,
        7: 1.1,
        8: 1.2,
        9: 1.25,
        10: 1.35}

    # Fetch the baseline portfolio beta for the current customer based on
    # their selected Risk Tolerance level.
    riskToleranceBaselineBeta = riskToleranceBetaDict[userRiskTolerance]

    # Calculate a cumulative portfolio beta for the current customer using a weighted
    # average between the beta associated with the customer's age and the beta associated
    # with the customer's selected Risk Tolerance.
    #
    # The baseline beta associated with age is larger for younger customers, and it steadily
    # decreases as the customer age increases. This is because younger customers have more time
    # in their life to earn income and offset any losses in the market, so they can afford to be
    # more risky.
    #
    # The baseline beta associated with the customer's selected Risk Tolerance was calculated above.
    #
    # Younger customers have more weight given towards their selected Risk Tolerance than the beta
    # associated with their age. This allows younger customers to have more control over the riskiness
    # of their portfolio. Older customers have more weight given towards the baseline beta for their age.
    # Since the baseline beta for older customers is low, they don't have the freedom to create riskier
    # portfolios.
    #
    # TODO: This goes against Benjamin Graham's philosophy that the amount of risk in your portfolio should be
    # determined not by age, but rather by how much effort one is willing to put into the management of
    # their portfolio.
    if (userAge >= 18 and userAge <= 25):
        ageRisk = 1.25
        return (0.4 * ageRisk) + (0.6 * riskToleranceBaselineBeta)
    elif (userAge >= 26 and userAge <= 40):
        ageRisk = 1.1
        return (0.45 * ageRisk) + (0.55 * riskToleranceBaselineBeta)
    elif (userAge >= 41 and userAge <= 50):
        ageRisk = 1.0
        return (0.5 * ageRisk) + (0.5 * riskToleranceBaselineBeta)
    elif (userAge >= 51 and userAge <= 60):
        ageRisk = 0.9
        return (0.55 * ageRisk) + (0.45 * riskToleranceBaselineBeta)
    elif (userAge >= 61 and userAge <= 70):
        ageRisk = 0.75
        return (0.6 * ageRisk) + (0.4 * riskToleranceBaselineBeta)
    else:
        ageRisk = 0.7
        return (0.65 * ageRisk) + (0.35 * riskToleranceBaselineBeta)

# Picks a stock from the given sector that is within +/- 0.2 beta
# from the target portfolio beta to serve as a good starting point
# for the balancing algorithm.


def pickFirstStock(sector, targetBeta, stocksDataDf):
    # Get only the stocks info for the given sector
    currSectorStocksDataDf = stocksDataDf.loc[stocksDataDf['Sector'] == sector]

    # Filter down to stocks that have a beta that is within +/- 0.2 of the
    # target portfolio beta
    closeBetaStocksDataDf = currSectorStocksDataDf.loc[(currSectorStocksDataDf['Beta'] >= (
        targetBeta - 0.2)) & (currSectorStocksDataDf['Beta'] <= (targetBeta + 0.2))]

    # Pick a random stock from the list of stocks with a beta close to the
    # target portfolio beta
    randomStockIndex = random.randint(0, len(closeBetaStocksDataDf.index) - 1)
    chosenStockData = closeBetaStocksDataDf.iloc[randomStockIndex]

    # This data is in the form of a pd.Series
    return chosenStockData

# Picks a random stock in the given sector that has a beta higher than targetBeta when raiseBeta is True,
# and lower than targetBeta when raiseBeta is False.


def pickRandomStock(sector, targetBeta, raiseBeta, stocksDataDf):

    # Get only the stocks info for the given sector
    selectedSectorStocksDataDf = stocksDataDf.loc[stocksDataDf['Sector'] == sector]

    # if raiseBeta is True, filter down to only stocks that have a beta > targetBeta
    # if raiseBeta is False, filter down to only stocks that have a beta <=
    # targetBeta
    if raiseBeta:
        correctBetaRangeDf = selectedSectorStocksDataDf.loc[
            selectedSectorStocksDataDf['Beta'] > targetBeta]
    else:
        correctBetaRangeDf = selectedSectorStocksDataDf.loc[
            selectedSectorStocksDataDf['Beta'] <= targetBeta]

    # Pick a random stock from the list of stocks within the right sector and
    # the right beta range
    randomStockIndex = random.randint(0, len(correctBetaRangeDf.index) - 1)
    chosenStockData = correctBetaRangeDf.iloc[randomStockIndex]

    # This data is in the form of a pd.Series
    return chosenStockData
