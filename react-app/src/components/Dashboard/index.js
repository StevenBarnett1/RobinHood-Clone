import {useSelector,useDispatch} from "react-redux"
import { useState, useEffect } from "react"
import "./Dashboard.css"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie
  } from 'recharts';
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c5mtisqad3iam7tur1qg"
const finnhubClient = new finnhub.DefaultApi()


const Dashboard = () => {
    const dispatch = useDispatch()
    const [portfolioValue,setPortfolioValue] = useState(0.00)
    const [buyingPower,toggleBuyingPower] = useState(false)
    const [openLists,setOpenLists] = useState([])
    const [currentPrices,setCurrentPrices] = useState({})
    const [graphData,setGraphData] = useState("")
    const user = useSelector(state=>state.session.user)
    useEffect(()=>{
        if(user){
            let total = 0
            user.holdings.forEach(holding=>{
                finnhubClient.quote(holding.symbol, (error, data, response) => {
                    total += (Number(data.c) * Number(holding.shares))
                    setPortfolioValue(portfolioValue+total)
                });
            })

        }
    },[user])

    useEffect(()=>{
        console.log(portfolioValue)
    },[portfolioValue])


    const toggleOpenLists = (watchlist) => {
        let newList = []
        let prices = {}
        let found = false

        for(let watchlist_stock of watchlist.stocks){
            finnhubClient.quote(watchlist_stock.symbol, (error, data, response) => {
                prices[watchlist_stock.symbol]=data.c
                console.log("PRICES: ",prices)
                setCurrentPrices(prices)
            })
        }


        for(let i=0;i<openLists.length;i++){
            if(openLists[i] !== watchlist.id){
                newList.push(openLists[i])
            } else {
                found = true
            }
        }

        if (!found){
            newList.push(watchlist.id)

        }
        setOpenLists(newList)



    }
    const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400},{name: 'Page B', uv: 500, pv: 2000, amt: 2000},{name: 'Page C', uv: 600, pv: 1500, amt: 1500}];

    useEffect(()=>{
        let start = new Date()
        start.setHours(0,0,0,0)
        let end = new Date()
        end.setHours(23,59,59,999)
        let startUnix = start.getTime() / 1000
        let endUnix = start.getTime() / 1000
        finnhubClient.stockCandles("AAPL", "15", startUnix, endUnix, (error, data, response) => {

          });
    },[])


    const renderLineChart = (
        <LineChart width={400} height={400} data={data}>
          <Line type="monotone" dataKey="amt" stroke="#8884d8" />
          <XAxis dataKey="name" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
        </LineChart>
      );

    console.log("USER: ",user)
    console.log("openlists: ",openLists)
    console.log("CURRENT PRICES: ",currentPrices)
    return (
        <div id = "dashboard-outer-container">
            <div id = "dashboard-left-container">
                <div id = "dashboard-upper-container">
                    <div id = "dashboard-portfolio-value"><h1>${portfolioValue.toFixed(2)}</h1></div>
                    <div id = "dashboard-graph-container">
                        <div id = "dashboard-graph">{renderLineChart}</div>
                        <div id = "dashboard-graph-timeframes-container">
                            <span className = "dashboard-graph-timeframe">1D</span>
                            <span className = "dashboard-graph-timeframe">1W</span>
                            <span className = "dashboard-graph-timeframe">1M</span>
                            <span className = "dashboard-graph-timeframe">3M</span>
                            <span className = "dashboard-graph-timeframe">1Y</span>
                            <span className = "dashboard-graph-timeframe">ALL</span>
                        </div>
                    </div>
                    <div id = "dashboard-buying-power-container" onClick={()=>toggleBuyingPower(!buyingPower)} >
                        <div id = "dashboard-buying-power-container-heading">
                            <div id = "dashboard-buying-power-text">Buying Power</div>
                            <div id = "dashboard-buying-power-value" style = {buyingPower ? {display:"none"} : {display:"block"}}>${(user && user.buyingPower) ? user.buyingPower.toFixed(2) : 0.00.toFixed(2)}</div>
                        </div>
                        <div id = "dashboard-buying-power-container-bottom" style = {buyingPower ? {display:"flex"} : {display:"none"}}>
                            <div id = "dashboard-buying-power-container-left">
                                <div id = "brokerage-cash-container">
                                    <div>Brokerage Cash</div>
                                    <div>Infinity</div>
                                </div>
                                <div id = "buying-power-container">
                                    <div>Buying Power</div>
                                    <div>${(user && user.buyingPower) ? user.buyingPower.toFixed(2) : 0.00.toFixed(2)}</div>
                                </div>
                                <button id = "buying-power-deposit-button">Deposit Funds</button>
                            </div>

                            <div id = "dashboard-buying-power-container-right">Buying Power represents the total value of assets you can purchase. Learn More</div>
                        </div>
                    </div>
                </div>

                <div id = "dashboard-lower-container">
                    <div id = "trending-lists-container">
                        <div id = "trending-lists-title"><h1>Trending Lists</h1></div>
                        <div id = "trending-lists-icons"></div>
                    </div>
                    <div id = "daily-movers-container">
                        <div id = "daily-movers-title"><h1>Daily Movers</h1></div>
                        <div id = "daily-movers-subtitle"></div>
                        <div id = "daily-movers-icons">
                            <div className = "daily-movers-icons-title"></div>
                            <div className = "daily-movers-icons-value"></div>
                            <div className = "daily-movers-icons-change"></div>
                        </div>
                    </div>
                    <div id = "news-container">
                        <div id="news-title"><h1>News</h1></div>
                        <div id = "news-icons-container">
                            <div className = "news-icon-title"></div>
                            <div className = "news-icon-text"></div>
                            <div className = "news-icon-symbol"></div>
                            <div className = "news-icon-change"></div>
                        </div>
                    </div>
                </div>

            </div>
            <div id = "watchlist-outer-container">
                    <div id = "watchlist-outer-title">Lists</div>
                    {user && user.watchlists.map(watchlist=>{
                        return (
                            <div key = {watchlist.id} className = "watchlist-inner-container">
                                <div className = "watchlist-title" onClick = {()=>toggleOpenLists(watchlist)}>{watchlist.name}</div>
                                <div className = "watchlist-stocks">
                                    {watchlist.stocks.map(stock=>{
                                        return (
                                            <div key = {stock.id} className = "watchlist-stock-container" style = {openLists.includes(watchlist.id) ? {display:"flex"} : {display:"none"}}>
                                                <div className = "watchlist-stock-symbol">{stock.symbol}</div>
                                                <div className = "watchlist-graph">{}</div>
                                                <div className = "watchlist-stock-price-container">
                                                    <div className = "watchlist-stock-price">{currentPrices[stock.symbol]}</div>
                                                    <div className = "watchlist-stock-change"></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )})}

                </div>
        </div>

    )
}

export default Dashboard
