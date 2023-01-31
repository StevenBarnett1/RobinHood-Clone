# Stevenhood

By Steven Barnett - Visit [Stevenhood](https://stevenhood-app.herokuapp.com/)

## Description

Stevenhood is a fullstack clone of the brokerage Robinhood. It allows users to buy and sell stocks, create watchlists, add stocks to watchlists, view their portfolio value, stock prices, and how those prices have changed over time. Information on individual sections below.

## Backend Technologies Used

The backend of Stevenhood was built using Python Flask and the SQLAlchemy ORM. Flask was used to set up the backend server whilst SQLAlchemy was used as a tunnel between that server and the PostgreSQL database. The tables in the database include Users, Watchlists, Watchlist_Stocks, Holdings, and Stocks. 

## Frontend Technologies Used

The frontend of Stevenhood was built using React and Redux. Fetch requests are made to the backend server from thunk actions inside of the redux store. The results from these requests are saved to then saved to a redux slice of state. Whenever a value in redux state changes it forces a re-render on any react component using that state. Rechart was the react library used to create the line chart and scatterplot graphs. 

## Splash Page

The splash page is a direct clone of robin hoods splashpgage, with 3 main sections: Investing for everyone, introducing IPO access, and introducing fractional shares. At the bottom of this page is a footer with my name and links to my GitHub and linkedin.

![GIF of splash feature](https://i.ibb.co/hfPXHWV/Stevenhood-splash.gif)

## Signup Page

The signup page has a user type their email, first name, last name, and password. There are validations for each field, no field can be greater than 256 characters, email field must be an email, and none of the fields can be blank. There is a link to the login page for users who already have an account.

## Login Page

The login page has a user type their email and password. If an email is not found in the database, the user will be notified, if the email is found but the password is incorrect, the user will be notified. Both fields require user input. If a user does not have an account, they may click on the link to redirect them to the signup page.

![GIF of login feature](https://i.ibb.co/ZxSSS2x/Stevenhood-login.gif)

## Navbar

The navbar contains 4 components. The Robinhood logo redirects the user to the dashboard if they are logged in, and to the splash page if they are not logged in. The search bar is described below. The sun icon is a button that toggles the theme of the website from dark to light. The door is a button to log out the current user and redirect them to the splash page. 


## Dashboard Page

On the dashboard page, there are several main components that are displayed. The first is a portfolio graph displaying how the total value of your portfolio has changed throughout the day. You may also filter by different time frames, including week, month, 3 month, 1 year, and all time. Previous price data will be pulled from the finnhub API and compiled into data points for the graph. The second component is the buying power container, where a user may add buying power. The next is daily gainers and daily losers, pulling data from the financial modeling prep API. These containers display the biggest losers and winners in the stocks market today. Each of them are also links to their individual stock pages. If the stock is not in the database, on adding it to a watchlist or holdings, the stock is first added to the database. The next component is news, this pulls recent news articles from the finnhub API, calculates how long ago they were posted (in hours, minutes, days, etc.) from unix timestamps, and displays them in a list. On the right side of the dashboard is a list of a users holdings, their watchlists, and their watchlist stocks.

![GIF of dashboard feature](https://i.ibb.co/Fnzm3Hn/Stevenhood-dashboard.gif)

## Stock Page

On the stock page, there is a similar graph to the dashboard page, but it is only for that stock's data. Below the graph is an about description of the company, pulled from the alpha advantage API. Beneath that is a list of 10 key statistics for the company. These statistics were pulled from all 3 API's as one of the API's may have returned data that another did not. Beneath this is a scatterplot of the company's earnings. With both actual and estimated displayed in different colors. Lastly there is the related stocks / people also own container, which has stocks similar to the one that you are currently looking at. Each of these stocks is also a navlink to a stock page for itself.

![GIF of search & stock feature](https://i.ibb.co/7xm7pvz/Stevenhood-Search-to-stock.gif)

## Adding Buying Power

To add buying power to a users account, they must click on the buying power container underneath of the portfolio graph on the dashboard page. A dropdown will then appear, click on the "Deposit Funds" button to reveal an input box. Nothing but positive numbers may be entered into this input, and no numbers greater than or equal to 100000000000000000000. Upon pressing the confirm button, the corresponding about will be added to the users buying power. 

## Creating Watchlists

To create a watchlist on the dashboard, a user should click on the + button under the "Lists" heading. The user will be prompted to enter a name for the watchlist. The maximum length for a watchlist name is 15 characters. A user cannot have more than 10 watchlists at a time. Duplicate and blank watchlist names are not allowed.

## Editing Watchlists

To edit a watchlist on the dashboard, a user should click on the 3 horizontal dots to the right of the watchlist name. On clicking, a dropdown will appear. Clicking on the "edit" button will bring up a modal with an input pre-populated with the current watchlist name. The same rules apply to editing a watchlist name as creating a watchlist name.

## Deleting Watchlists

To delete a watchlist on the dashboard, a user should click on the 3 horizontal dots to the right of the watchlist name. On clicking, a dropdown will appear. Clicking on the "delete" button will cause the watchlist and all of its corresponding watchlist_stocks to be deleted from the database.

## Reading Watchlists

To read a watchlist, a user must click anywhere on the watchlist name box. This will open the watchlist and display the stocks currently contained in it. 

![GIF of watchlist CRUD](https://i.ibb.co/7pzr4LR/Stevenhood-Watchlist-CRUD.gif)

## Search Function

To use the search function, a user should click on the input field in the center of the navbar. On typing, the navbar will present possible listings based on your search query, highlighting the parts of the stock symbol or name that have been typed. On clicking a link, the user will be redirected to the individual stocks page.

A gif displaying this feature can be seen underneath the "Stock Page" heading.

## Creating Holdings

To create a holding, navigate to the page for an individual stock using the search function or by clicking on one of the stocks in your holdings or watchlists. Once on the page, a user can filter to buy a stock by shares or dollars, the default is shares. When either a number of shares or a dollar amount is typed into the "amount/shares" input box, the total price / total number of shares shows up beneath the input. If the user has enough buying power, they will be able to purchase shares. Purchasing the shares saves a holding to the database. A holding entry contains a number of shares, stock_id, and user_id. If the user does not have enough buying power, enters anything but a number, enters a negative number, enters 0, enters less than one ten thousandth of a share, one one hundredth of a penny, or enters an amount greater than or equal to 100000000000000000000, they will be notified and the transaction will not go through.

## Editing Holdings

To edit a holding, a user can either buy or sell shares. The same process applies as when creating a holding. If shares are added, the holding with the corresponding user_id and stock_id are found in the database, the shares column of this entry is then incremented by the corresponding number of shares purchased. Similarly, a users buying power is decremented. The opposite applies when selling shares.

## Deleting Holdings

To delete a holding, a user must sell all of their shares. The number of shares owned by a user is shown underneath the sell box inside of the stock page. When the number of shares being decremented is equal to the number of shares currently in the holding column of the selected entry, the holding is deleted entirely, rather than changing the value of the shares column. 

## Reading Holdings

There are two ways a user can effectively "Read" their current holdings. The first is to look at the stocks listed under "Your Stocks" on the dashboard page. If a user wants to see the number of shares that they own, they must go to that stocks page and check underneath the "sell" heading

![GIF of buying/selling holdings](https://i.ibb.co/7bGXmjp/Stevenhood-Buy-Sell.gif) 

## Creating Watchlist Stocks 

To create a watchlist stock, navigate to the page for the stock that you want to add. Underneath the buy/sell box, there is a button "Add to watchlists." Click this button to reveal a modal containing a list of your watchlists. In this modal you may add new watchlists by clicking the create watchlist button. The same rules apply as creating a watchlist on the dashboard page. You can also add this stock to your watchlists by clicking on the box containing the watchlist that you want to append the stock to. A checkmark will appear in the checkmark box, indicating that stock is going to be added once the "Save Changes" button is pressed. If a stock is already in a specific list, there will be a red text underneath the Watchlist name stating that the stock is already in the list.

## Deleting Watchlist Stocks

To delete watchlist stocks, navigate to the dashboard page and click on the dropdown for a watchlist that currently contains watchlist stocks. Next to each individual watchlist stock there will be a little trash can icon that can be clicked. Upon clicking, a delete request is sent to the backend for a specific watchlist id and symbol.

![GIF of creating/deleting watchlist stocks](https://i.ibb.co/Rvk1f7x/Stevenhood-add-to-watchlist.gif) 


