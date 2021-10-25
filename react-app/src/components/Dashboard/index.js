import {useSelector,useDispatch} from "react-redux"
import { useState, useEffect } from "react"
import "./Dashboard.css"
import { addBuyingPower } from "../../store/session";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie
  } from 'recharts';
import { getPortfolioData } from "../../store/portfolio";
const finnhub = require('finnhub');
const apiKeys = ["c5pfejaad3i98uum8f0g","c5mtisqad3iam7tur1qg"]
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = apiKeys[Math.floor(Math.random()*apiKeys.length)]
const finnhubClient = new finnhub.DefaultApi()


console.log("API KEYYYYYYYYYYYYYYYYY: ", api_key.apiKey)


const Dashboard = () => {
    const dispatch = useDispatch()
    const [portfolioValue,setPortfolioValue] = useState(0.00)
    const [buyingPower,toggleBuyingPower] = useState(false)
    const [openLists,setOpenLists] = useState([])
    const [currentPrices,setCurrentPrices] = useState({})
    const [graphData,setGraphData] = useState("")
    const [yMax,setYmax] = useState(0)
    const [yMin,setYmin] = useState(Infinity)
    const [totalPrices,setTotalPrices] = useState([])
    const [dates,setDates] = useState("")
    const [interval,setTimeInterval] = useState("15")
    const [unixStart,setUnixStart] = useState("")
    const [unixEnd,setUnixEnd] = useState("")
    const [news,setNews] = useState("")
    const [depositClick,setDepositClick] = useState(false)
    const user = useSelector(state=>state.session.user)
    const portfolioData = useSelector(state=>state.portfolio)

    useEffect(()=>{
        if(user){
            let total = 0
            user.holdings.forEach(holding=>{
                finnhubClient.quote(holding.symbol, (error, data, response) => {
                    total += (Number(data.c) * Number(holding.shares))
                    setPortfolioValue(portfolioValue+total)
                });
            })
            finnhubClient.marketNews("general", {}, (error, data, response) => {
                console.log(data)
                setNews(data)
              });

        }
    },[user])

    useEffect(()=>{
        if(portfolioData.data){
            setGraphData(portfolioData.data)
            setYmin(portfolioData.min)
            setYmax(portfolioData.max)

        }
    },[portfolioData])



    const toggleOpenLists = (watchlist) => {
        let newList = []
        let prices = {}
        let found = false

        for(let watchlist_stock of watchlist.stocks){
            finnhubClient.quote(watchlist_stock.symbol, (error, data, response) => {
                prices[watchlist_stock.symbol]=data.c

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
    console.log("GRAPH DATA: ",graphData)
    useEffect(()=>{
        if(interval && unixEnd){
            console.log("INT INT INT: ",interval,unixEnd,unixStart)
        dispatch(getPortfolioData(user.holdings, interval, unixStart, unixEnd, api_key.apiKey))
        }
    },[interval,unixEnd,unixStart])


    const timeFrameClick = (time,frame) => {

        console.log("FRAME: ",frame)
        if(frame === "1D"){
            console.log("IN FRAME")
            let start = new Date()
            let end = new Date()
            if(start.getDay() === 6){
                start.setDate(start.getDate()-1)
                end.setDate(end.getDate()-1)
                end.setHours(23,0,0,0)

            }
            if(start.getDay() === 0){
                start.setDate(start.getDate()-2)
                end.setDate(end.getDate()-2)
                end.setHours(23,0,0,0)
            }
            start.setHours(0,0,0,0)

            let startUnix = Math.floor(Number(start.getTime() / 1000))
            let endUnix = Math.floor(Number(end.getTime() / 1000))
            setUnixStart(startUnix)
            setUnixEnd(endUnix)
        } else if (frame === "1W"){
            let start = new Date()
            let end = new Date()
            if(start.getDay() === 6){
                start.setDate(start.getDate()-1)
                end.setDate(end.getDate()-1)
                end.setHours(23,0,0,0)

            }
            if(start.getDay() === 0){
                start.setDate(start.getDate()-2)
                end.setDate(end.getDate()-2)
                end.setHours(23,0,0,0)
            }
            start.setDate(start.getDate()-7)
            start.setHours(0,0,0,0)
            console.log("END TIME: ",end)
            let startUnix = Math.floor(Number(start.getTime() / 1000))
            let endUnix = Math.floor(Number(end.getTime() / 1000))
            setUnixStart(startUnix)
            setUnixEnd(endUnix)
        } else if (frame === "1M"){
            let start = new Date()
            let end = new Date()
            start.setMonth(start.getMonth()-1)
            start.setHours(0,0,0,0)
            end.setHours(20,0,0,0)
            let startUnix = Math.floor(Number(start.getTime() / 1000))
            let endUnix = Math.floor(Number(end.getTime() / 1000))
            setUnixStart(startUnix)
            setUnixEnd(endUnix)
        } else if (frame === "3M"){
            let start = new Date()
            let end = new Date()
            start.setMonth(start.getMonth()-3)
            start.setHours(0,0,0,0)
            end.setHours(20,0,0,0)
            let startUnix = Math.floor(Number(start.getTime() / 1000))
            let endUnix = Math.floor(Number(end.getTime() / 1000))
            setUnixStart(startUnix)
            setUnixEnd(endUnix)
        } else if (frame === "1Y"){
            let start = new Date()
            let end = new Date()
            end.setHours(20,0,0,0)
            start.setFullYear(start.getFullYear()-1)
            start.setHours(0,0,0,0)
            let startUnix = Math.floor(Number(start.getTime() / 1000))
            let endUnix = Math.floor(Number(end.getTime() / 1000))
            setUnixStart(startUnix)
            setUnixEnd(endUnix)
        } else if (frame === "ALL"){
            let start = new Date()
            let end = new Date()
            start.setHours(0,0,0,0)
            end.setHours(23,0,0,0)
            // let startUnix = Math.floor(Number(start.getTime() / 1000))
            console.log("IN ALL FRAME")
            let startUnix = 0
            let endUnix = Math.floor(Number(end.getTime() / 1000))
            setUnixStart(startUnix)
            setUnixEnd(endUnix)
        }


        setTimeInterval(time)
    }


    const deposit = (value) => {
        setDepositClick(value)
        if(!value)dispatch(addBuyingPower(user.id,buyingPower))
    }
    let renderLineChart = (
        <LineChart width={700} height={300} data={graphData}>
      <Line type="monotone" dataKey="price" stroke="#8884d8" />
      <XAxis dataKey="dateTime" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
      <YAxis domain={[yMin-1,yMax+1]} allowDecimals={false}/>
      <Tooltip/>
    </LineChart>)


    return (
        <div id = "dashboard-outer-container">
            <div id = "dashboard-left-container">
                <div id = "dashboard-upper-container">
                    <div id = "dashboard-portfolio-value"><h1>${portfolioValue.toFixed(2)}</h1></div>
                    <div id = "dashboard-graph-container">
                        <div id = "dashboard-graph">{renderLineChart}</div>
                        <div id = "dashboard-graph-timeframes-container">
                            <span className = "dashboard-graph-timeframe"><button onClick = {()=>{timeFrameClick("5","1D")}} className = "dashboard-graph-timeframe-button">1D</button></span>
                            <span className = "dashboard-graph-timeframe"><button onClick = {()=>{timeFrameClick("30","1W")}} className = "dashboard-graph-timeframe-button">1W</button></span>
                            <span className = "dashboard-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1M")}} className = "dashboard-graph-timeframe-button">1M</button></span>
                            <span className = "dashboard-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","3M")}} className = "dashboard-graph-timeframe-button">3M</button></span>
                            <span className = "dashboard-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1Y")}} className = "dashboard-graph-timeframe-button">1Y</button></span>
                            <span className = "dashboard-graph-timeframe"><button onClick = {()=>{timeFrameClick("M","ALL")}} className = "dashboard-graph-timeframe-button">ALL</button></span>
                        </div>
                    </div>
                    <div id = "dashboard-buying-power-container"  >
                        <div id = "dashboard-buying-power-container-heading" onClick={()=>toggleBuyingPower(!buyingPower)}>
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
                                <button id = "buying-power-deposit-button" onClick = {()=>deposit(!depositClick)} >{depositClick ? "Confirm" : `Deposit Funds`}</button>
                                <input type = "text" id = "buying-power-deposit-input" style = {depositClick ? {display:"block"}: {display:"none"}}></input>

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
                            {news && news.map(post => {
                                return (
                                    <div key = {post.id} className = "news-icon-container">
                                        <div className = "news-icon-source">{post.source}</div>
                                        <div className = "news-icon-date">{post.datetime*1000}</div>
                                        <div className = "news-icon-headline">{post.headline}</div>
                                        <div className = "news-icon-symbol"></div>
                                        <div className = "news-icon-change"></div>
                                    </div>
                                )
                            })}

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
