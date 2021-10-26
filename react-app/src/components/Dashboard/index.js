import {useSelector,useDispatch} from "react-redux"
import { useState, useEffect } from "react"
import "./Dashboard.css"
import { addBuyingPower, addWatchlistThunk, toggleModalView, addModal } from "../../store/session";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie
  } from 'recharts';
  import Odometer from 'react-odometerjs';
  import {FaPlus} from "react-icons/fa"
import { getPortfolioData, getMoversData } from "../../store/portfolio";
import { getStockGraphData } from "../../store/stocks";
import 'odometer/themes/odometer-theme-minimal.css';
import {IoIosArrowDown,IoIosArrowUp} from "react-icons/io"
import {BiDotsHorizontal} from "react-icons/bi"
import FormModal from "../Modal/Modal";
const finnhub = require('finnhub');
const apiKeys = ["c5pfejaad3i98uum8f0g","c5mtisqad3iam7tur1qg","c5riunqad3ifnpn54h4g"]
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = apiKeys[Math.floor(Math.random()*apiKeys.length)]
const finnhubClient = new finnhub.DefaultApi()
const moverAPIKeys = ["1bf1b668a4216e5a16da2e7b765aa33a"]
const nonWorkingMovers = [`ff589a311ba428d0075c8c9c152c15dc`]

const months = {
    0:"JAN",
    1:"FEB",
    2:"MAR",
    3:"APR",
    4:"MAY",
    5:"JUN",
    6:"JUL",
    7:"AUG",
    8:"SEP",
    9:"OCT",
    10:"NOV",
    11:"DEC"
}


const Dashboard = () => {
    const dispatch = useDispatch()
    const [portfolioValue,setPortfolioValue] = useState(0.00)
    const [portfolioValueDynamic,setPortfolioValueDynamic] = useState(0)
    const [buyingPower,toggleBuyingPower] = useState(false)
    const [buyingPowerValue,editBuyingPowerValue] = useState("")
    const [openLists,setOpenLists] = useState([])
    const [currentStockData,setCurrentStockData] = useState({})
    const [watchlistInputValue,setWatchlistInputValue] = useState("")
    const [graphData,setGraphData] = useState("")
    const [yMax,setYmax] = useState(0)
    const [yMin,setYmin] = useState(Infinity)
    const [totalPrices,setTotalPrices] = useState([])
    const [dates,setDates] = useState("")
    const [interval,setTimeInterval] = useState("5")
    const [unixStart,setUnixStart] = useState("")
    const [unixEnd,setUnixEnd] = useState("")
    const [news,setNews] = useState("")
    const [depositClick,setDepositClick] = useState(false)
    const [watchlistInput,toggleWatchlistInput] = useState(false)



    const user = useSelector(state=>state.session.user)
    const portfolioData = useSelector(state=>state.portfolio.portfolioData)
    const moversData = useSelector(state => state.portfolio.moversData)
    const stocks = useSelector(state=>state.stocks.stocks)
    const watchlistStockData = useSelector(state=>state.stocks.watchlistStockData)
    console.log(watchlistStockData)
    useEffect(()=>{
        if(watchlistStockData){
            console.log("WATCHLIST STOCK DATA: ",watchlistStockData)

            for(let symbol of Object.keys(watchlistStockData)){
                watchlistStockData[symbol].graph=(
                    // <ResponsiveContainer className = "responsive-container">
                        <LineChart width = {107} height = {45} data={watchlistStockData[symbol].data}>
                            <Line dot = {false} type="monotone" dataKey="price"  />
                            <XAxis dataKey="dateTime" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
                            <YAxis tick = {false} axisLine={false} tickline = {false} width = {10} domain={[watchlistStockData[symbol].min-1,watchlistStockData[symbol].max+1]} allowDecimals={false}/>
                            {/* <Tooltip/> */}
                        </LineChart>
                    //  </ResponsiveContainer>
    )
            }

        }
    },[watchlistStockData])

    console.log("GRAPH DATA: ",graphData)
    useEffect(()=>{
        if(user && stocks){
            let total = 0
            user.holdings.forEach(holding=>{
                finnhubClient.quote(holding.symbol, (error, data, response) => {
                    total += (Number(data.c) * Number(holding.shares))
                    setPortfolioValue(portfolioValue+total)
                });
            })
            finnhubClient.marketNews("general", {}, (error, data, response) => {
                setNews(data)
              });
              let allWatchListStocks = []
              let allWatchListStockSymbols = []
              editBuyingPowerValue(user.buyingPower)
              dispatch(getMoversData(moverAPIKeys[Math.floor(Math.random()*moverAPIKeys.length)]))
              for(let watchlist of user.watchlists){
                  console.log("WATCHLIST HERE: ",watchlist)
                  allWatchListStocks = [...allWatchListStocks,...watchlist.stocks.filter(stock => !allWatchListStockSymbols.includes(stock.symbol))]
                  allWatchListStockSymbols = [...allWatchListStockSymbols,...watchlist.stocks.map(stock => stock.symbol)]

              }
              dispatch(getStockGraphData(allWatchListStocks,apiKeys[Math.floor(Math.random()*apiKeys.length)]))

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

        }
    },[user,stocks])

    useEffect(()=>{
        if(portfolioData){
            setGraphData(portfolioData.data)
            setYmin(portfolioData.min)
            setYmax(portfolioData.max)

        }
    },[portfolioData])



    const toggleOpenLists = (watchlist) => {
        let newList = []
        let newData = {}
        let found = false

    //     for(let watchlist_stock of watchlist.stocks){
    //         finnhubClient.quote(watchlist_stock.symbol, (error, data, response) => {
    //             newData[watchlist_stock.symbol] = {}
    //             newData[watchlist_stock.symbol].price=data.c
    //             newData[watchlist_stock.symbol].graph=(
    //                 // <ResponsiveContainer className = "responsive-container">
    //                     <LineChart width = {107} height = {45} data={graphData}>
    //                         <Line type="monotone" dataKey="price" stroke="#8884d8" />
    //                         <XAxis dataKey="dateTime" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
    //                         <YAxis width = {10} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
    //                         <Tooltip/>
    //                     </LineChart>
    //                 //  </ResponsiveContainer>
    // )
    //             setCurrentStockData(newData)
    //         })
    //     }


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
    useEffect(()=>{
        if(interval && unixEnd){
        dispatch(getPortfolioData(user.holdings, interval, unixStart, unixEnd, apiKeys[Math.floor(Math.random()*apiKeys.length)]))
        }
    },[interval,unixEnd,unixStart])



    const timeFrameClick = (time,frame) => {


        if(frame === "1D"){

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

            let startUnix = 0
            let endUnix = Math.floor(Number(end.getTime() / 1000))
            setUnixStart(startUnix)
            setUnixEnd(endUnix)
        }


        setTimeInterval(time)
    }


    const deposit = (value) => {
        setDepositClick(value)
        if(!value)dispatch(addBuyingPower(user.id,Number(buyingPowerValue)))
    }

    let tooltip
    const CustomTooltip = ({ active, payload }) => {
    // if (!active || !tooltip)    return null
    if(payload && payload[0]){

            console.log("AA: ",payload)
            console.log("BB",payload[0])
            console.log("CC",payload[0].payload)
            let year = payload[0].payload.dateTime.getFullYear()
            let month = months[payload[0].payload.dateTime.getMonth()]
            let day = payload[0].payload.dateTime.getDate()
            let hours = payload[0].payload.dateTime.getHours()
            let minutes = payload[0].payload.dateTime.getMinutes()
            if(minutes === 0)minutes = "00"
            let zone
            if(hours >= 12) zone = "PM"
            else zone = "AM"
            console.log("INTERVAL: ",interval)
            setPortfolioValueDynamic(payload[0].payload.price)
            if(interval === "5"){
                return (<span className = "chart-date-label">{hours}:{minutes} {zone}</span>)
            } else if (interval === "30"){
                return (<div className = "chart-date-label">{month} {day}, {hours}:{minutes} {zone}</div>)
            } else if (interval === "D"){
                return (<div className = "chart-date-label">{month} {day}, {year}</div>)
            } else if (interval === "M"){
                return (<div className = "chart-date-label">{month}, {year}</div>)
            }



    }

    return null
}

const chartHoverFunction = (e) => {
    if(e.activePayload){
        setPortfolioValueDynamic(e.activePayload[0].payload.price);
    }
}

const handleDotsClick = () => {
    dispatch(toggleModalView(true))
    dispatch(addModal("watchlist-dots"))
}
const portfolioReset = (e) => {
    setPortfolioValueDynamic(0)
}

const addWatchlist = (e) => {
    if(watchlistInputValue)dispatch(addWatchlistThunk(watchlistInputValue,user.id))
}
    let renderLineChart = (
        <LineChart onMouseMove = {e=> chartHoverFunction(e)} onMouseLeave = {e=>portfolioReset(e)} width={700} height={300} data={graphData}>
      <Line dot = {false} type="monotone" dataKey="price" stroke="#8884d8" />
      <XAxis tick = {false} axisLine = {false} tickLine = {false} dataKey="dateTime" angle={0} textAnchor="end" />
      <YAxis tick = {false} axisLine = {false} tickLine = {false} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
      <CartesianGrid horizontal = {true}/>
      <Tooltip position={{ y: -16 }} cursor = {true} content = {<CustomTooltip/>}/>
    </LineChart>)


    return (
        <div id = "dashboard-outer-container">
            <div id = "dashboard-left-container">
                <div id = "dashboard-upper-container">
                    <div id = "dashboard-portfolio-value"><h1>$<Odometer value={portfolioValueDynamic ? Number(portfolioValueDynamic.toFixed(2)) : Number(portfolioValue.toFixed(2))} format="(,ddd).dd" /></h1></div>

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
                            <div id = "dashboard-buying-power-value" style = {buyingPower ? {display:"none"} : {display:"block"}}>${(user && user.buying_power) ? user.buying_power.toFixed(2) : 0.00.toFixed(2)}</div>
                        </div>
                        <div id = "dashboard-buying-power-container-bottom" style = {buyingPower ? {display:"flex"} : {display:"none"}}>
                            <div id = "dashboard-buying-power-container-left">
                                <div id = "brokerage-cash-container">
                                    <div>Brokerage Cash</div>
                                    <div>Infinity</div>
                                </div>
                                <div id = "buying-power-container">
                                    <div>Buying Power</div>
                                    <div>${(user && user.buying_power) ? user.buying_power.toFixed(2) : 0.00.toFixed(2)}</div>
                                </div>
                                <button id = "buying-power-deposit-button" onClick = {()=>deposit(!depositClick)} >{depositClick ? "Confirm" : `Deposit Funds`}</button>
                                <input type = "text" id = "buying-power-deposit-input" value = {buyingPowerValue} onChange = {(e)=>editBuyingPowerValue(e.target.value)} style = {depositClick ? {display:"block"}: {display:"none"}}></input>

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
                    <div id = "daily-gainers-title"><h1>Daily Gainers</h1></div>
                    <div id = "daily-gainers-container">
                        <div id = "daily-gainers-subtitle"></div>
                        <div id = "daily-gainers-icons">
                        {moversData && moversData.gainersData.map(data => {
                            return (
                                <div key = {data.ticker} className = "daily-gainers-individual">
                                    <div className = "daily-gainers-icons-title">{data.companyName}</div>
                                    <div className = "daily-numbers-container">
                                        <div className = "daily-gainers-icons-value">{data.price}</div>
                                        <div className = "daily-gainers-icons-change">+{data.changesPercentage}</div>
                                    </div>
                                </div>
                            )
                            })}
                        </div>
                    </div>
                    <div id = "daily-losers-title"><h1>Daily Losers</h1></div>
                    <div id = "daily-losers-container">
                        <div id = "daily-losers-subtitle"></div>
                        <div id = "daily-losers-icons">
                            {moversData && moversData.losersData.map(data => {
                                return (
                                <div key = {data.ticker} className = "daily-losers-individual">
                                    <div className = "daily-losers-icons-title">{data.companyName}</div>
                                    <div className = "daily-numbers-container">
                                        <div className = "daily-losers-icons-value">{data.price}</div>
                                        <div className = "daily-losers-icons-change">-{data.changesPercentage}</div>
                                    </div>

                                </div>
                                )
                            })}

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
                    <div id = "watchlist-outer-title">
                        <div id = "title-text">Lists</div>
                        <button id = "watchlist-plus-button" onClick = {()=>toggleWatchlistInput(!watchlistInput)}><FaPlus/></button>
                        <form onSubmit = {()=>addWatchlist()} style = {watchlistInput ? {display:"block"} : {display:"none"}}>
                        <input placeholder = 'Watchlist Name' value = {watchlistInputValue} type="text" onChange = {(e)=>setWatchlistInputValue(e.target.value)}/>
                        <input type="submit" value = "Submit"/>
                        </form>

                    </div>
                    {user && user.watchlists.map(watchlist=>{
                        return (
                            <div key = {watchlist.id} className = "watchlist-inner-container">
                                <div className = "watchlist-title" onClick = {()=>toggleOpenLists(watchlist)}>
                                    <div>{watchlist.name}</div>
                                    <div className = "watchlist-title-right">
                                        <div className = "watchlist-dots" onClick = {handleDotsClick}><BiDotsHorizontal/></div>
                                        <div className = "watchlist-arrow"> {openLists.includes(watchlist.id) ? (<IoIosArrowUp/>) : (<IoIosArrowDown/>)}</div>
                                    </div>


                                    </div>
                                <div className = "watchlist-stocks">
                                    {watchlist.stocks.map(stock=>{
                                        return (
                                            <div key = {stock.id} className = "watchlist-stock-container" style = {openLists.includes(watchlist.id) ? {display:"flex"} : {display:"none"}}>
                                                <div className = "watchlist-stock-symbol">{stock.symbol}</div>
                                                <div className = "watchlist-stock-graph">{watchlistStockData && watchlistStockData[stock.symbol].graph}</div>
                                                <div className = "watchlist-stock-price-container">
                                                    <div className = "watchlist-stock-price">{watchlistStockData && watchlistStockData[stock.symbol].price}</div>
                                                    <div className = "watchlist-stock-change"></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )})}
                <FormModal/>
                </div>

        </div>

    )
}

export default Dashboard
