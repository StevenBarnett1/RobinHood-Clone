import "./StockPage.css"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useParams } from "react-router";
import { getStockData } from "../../store/stocks";
import 'odometer/themes/odometer-theme-minimal.css';
import {IoIosArrowDown,IoIosArrowUp} from "react-icons/io"
import {BiDotsHorizontal} from "react-icons/bi"
import {BsGear, BsFillXCircleFill} from "react-icons/bs"
import FormModal from "../Modal/Modal";
import {NavLink} from "react-router-dom"
import { addBuyingPower, toggleModalView, addModal, addWatchlistThunk, editWatchlistThunk, deleteWatchlistThunk, addModalInfo} from "../../store/session";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Scatter, ScatterChart
  } from 'recharts';
  import Odometer from 'react-odometerjs';
  import {FaPlus} from "react-icons/fa"

const overviewTokens = ["3UC4IVVYIGV8RHJB","JHJY5TEK1A5HV67T","8MGCDK87SBTQ7CB5","KH07O8BLSZ2XTJTH","7LI2MOXNZKBJSW21"]
const finnhub = require('finnhub');
const apiKeys = ["c5pfejaad3i98uum8f0g","c5mtisqad3iam7tur1qg","c5riunqad3ifnpn54h4g"]
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c5riunqad3ifnpn54h4g"
const finnhubClient = new finnhub.DefaultApi()

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

const Stockpage = () => {
    const dispatch = useDispatch()
    const params = useParams()

    const [graphData,setGraphData] = useState("")
    const [actualScatterData,setActualScatterData] = useState("")
    const [estimatedScatterData,setEstimatedScatterData] = useState("")
    const [renderLineChart,setRenderLineChart] = useState("")
    const [stockValue,setStockValue] = useState(0.00)
    const [stockValueDynamic,setStockValueDynamic] = useState(0)
    const [unixStart,setUnixStart] = useState("")
    const [unixEnd,setUnixEnd] = useState("")
    const [dailyLow,setDailyLow] = useState("")
    const [dailyHigh,setDailyHigh] = useState("")
    const [openPrice,setOpenPrice] = useState("")
    const [interval,setTimeInterval] = useState("5")
    const [yMax,setYmax] = useState(0)
    const [yMin,setYmin] = useState(Infinity)
    const user = useSelector(state=>state.session.user)
    const stockData = useSelector(state=>state.stocks.stockData)

    useEffect(()=>{
        if(stockData && stockData.symbol){
            console.log("STOCDNFGIBIERBNo: ",stockData)
            setStockValue(stockData.price)
            setGraphData(stockData.data)
            setYmin(stockData.min)
            setYmax(stockData.max)
            let estimated = []
            let actual = []
            console.log(stockData.earnings)
            for(let i = 0 ; i<stockData.earnings.length;i++){
                const mapper = {
                    3:"Q3 FY20",
                    2:"Q4 FY20",
                    1:"Q1 FY21",
                    0:"Q2 FY21"
                }
                const newEst = {'estimated':stockData.earnings[i].estimate,'period':mapper[i]}
                const newAct = {'actual':stockData.earnings[i].actual,'period':mapper[i]}
                estimated.push(newEst)
                actual.push(newAct)

            }
            setActualScatterData(actual)
            setEstimatedScatterData(estimated)
            if(interval === "5"){
                setDailyHigh(stockData.max)
                setDailyLow(stockData.min)
                setOpenPrice(stockData.data[0].price)
            }
            console.log("STOCKDATA AFTER ADDITIONS: ",stockData)
        }
    },[stockData])

    const CustomTooltip = ({ active, payload }) => {
        // if (!active || !tooltip)    return null
        if(payload && payload[0]){

                let year = payload[0].payload.dateTime.getFullYear()
                let month = months[payload[0].payload.dateTime.getMonth()]
                let day = payload[0].payload.dateTime.getDate()
                let hours = payload[0].payload.dateTime.getHours()
                let minutes = payload[0].payload.dateTime.getMinutes()
                if(minutes === 0)minutes = "00"
                if(minutes === 5)minutes = "05"
                let zone
                if(hours >= 12) zone = "PM"
                else zone = "AM"

                setStockValueDynamic(payload[0].payload.price)
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

    useEffect(()=>{
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

    },[])

    useEffect(()=>{
        if(unixEnd && interval) {

            dispatch(getStockData(params.symbol,interval,unixStart,unixEnd,apiKeys[Math.floor(Math.random()*apiKeys.length)],overviewTokens[Math.floor(Math.random()*overviewTokens.length)]))
        }
    },[interval,unixEnd,unixStart])

    const chartHoverFunction = (e) => {
        if(e.activePayload){
            setStockValueDynamic(e.activePayload[0].payload.price);
        }
    }

    const stockReset = (e) => {
        setStockValueDynamic(0)
    }

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

    useEffect(()=>{

        if(graphData){

            if(graphData[graphData.length-1].price > graphData[0].price){
                setRenderLineChart((
                    <LineChart onMouseMove = {e=> chartHoverFunction(e)} onMouseLeave = {e=>stockReset(e)} width={700} height={300} data={graphData}>
                  <Line dot = {false} type="monotone" dataKey="price" stroke="rgb(0, 200, 5)" />
                  <XAxis tickSize = {1.5} interval={0} axisLine = {false} dataKey="dateTime" angle={0} textAnchor="end" />
                  <YAxis tick = {false} axisLine = {false} tickLine = {false} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
                  <Tooltip position={{ y: -16 }} cursor = {true} content = {<CustomTooltip/>}/>
                </LineChart>))
            } else {
                setRenderLineChart((
                    <LineChart onMouseMove = {e=> chartHoverFunction(e)} onMouseLeave = {e=>stockReset(e)} width={700} height={300} data={graphData}>
                  <Line dot = {false} type="monotone" dataKey="price" stroke="rgb(255, 80, 0)" />
                  <XAxis  axisLine = {false} dataKey="dateTime" angle={0} textAnchor="end" />
                  <YAxis tick = {false} axisLine = {false} tickLine = {false} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
                  <Tooltip position={{ y: -16 }} cursor = {true} content = {<CustomTooltip/>}/>
                </LineChart>))
            }
        }

    },[graphData])

    useEffect(()=>{
        if(interval && unixEnd){

        dispatch(getStockData(params.symbol, interval, unixStart, unixEnd, apiKeys[Math.floor(Math.random()*apiKeys.length)],overviewTokens[Math.floor(Math.random()*overviewTokens.length)]))
        }
    },[interval,unixEnd,unixStart])

    const data = [
        { x: 1, y: 23 },
        { x: 2, y: 3 },
        { x: 3, y: 15 },
        { x: 4, y: 35 },
        { x: 5, y: 45 },
        { x: 6, y: 25 },
        { x: 7, y: 17 },
        { x: 8, y: 32 },
        { x: 9, y: 43 },
    ];
    let scatterChart = (
    <ScatterChart width={400} height={400}>
        <CartesianGrid />
        <XAxis dataKey="period" />
        <YAxis type="number" dataKey="actual" />
        <Legend/>
        <Scatter name = "actual" data={actualScatterData} fill="green" />
        <Scatter name = "estimated" data={estimatedScatterData} fill="red" />
    </ScatterChart>
    )


    return (
        <div id = "stockpage-outer-container">
            <div id = "stockpage-left-container">
                <div id = "stockpage-upper-container">
                    <div id = "stockpage-stock-value"><h1>$<Odometer value={stockValueDynamic ? Number(stockValueDynamic.toFixed(2)) : Number(stockValue.toFixed(2))} format="(,ddd).dd" /></h1></div>

                    <div id = "stockpage-graph-container">
                        <div id = "stockpage-graph">{renderLineChart}</div>
                        <div id = "stockpage-graph-timeframes-container">
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("5","1D")}} className = "dashboard-graph-timeframe-button">1D</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("30","1W")}} className = "dashboard-graph-timeframe-button">1W</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1M")}} className = "dashboard-graph-timeframe-button">1M</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","3M")}} className = "dashboard-graph-timeframe-button">3M</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1Y")}} className = "dashboard-graph-timeframe-button">1Y</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("M","ALL")}} className = "dashboard-graph-timeframe-button">ALL</button></span>
                        </div>
                    </div>
                </div>
                <div id = "stockpage-lower-container">
                    <div id = "about-container">
                        <div id = "about-title">About</div>
                        <div id = "about-description">
                            {stockData && stockData.description}
                        </div>
                        <div id = "about-lower-container">
                            <div id = "ceo-container">
                                <div id = "ceo-title"></div>
                                <div id = "ceo-value"></div>
                            </div>
                            <div id = "employees-container">
                            <div id = "employees-title"></div>
                                <div id = "employees-value"></div>
                            </div>
                            <div id = "headquarters-container">
                            <div id = "headquarters-title"></div>
                                <div id = "headquarters-value"></div>
                            </div>
                            <div id = "founded-container">
                            <div id = "founded-title"></div>
                                <div id = "founded-value"></div>
                            </div>
                        </div>
                    </div>
                    <div id = "key-statistics-container">
                        <div id = "key-statistics-title">Key Statistics</div>
                        <div id = "key-statistics-lower-container">
                            <div className = "key-statistic-container">
                                <div className = "key-statistic">Market Cap</div>
                                <div className = "key-statistic-value">{stockData && stockData.marketCap}</div>
                            </div>
                            <div className = "key-statistic-container">
                                <div className = "key-statistic">Revenue</div>
                                <div className = "key-statistic-value">{stockData && stockData.revenue}</div>
                            </div>
                            <div className = "key-statistic-container">
                                <div className = "key-statistic">Price-Earnings Ratio</div>
                                <div className = "key-statistic-value">{stockData && stockData.peRatio}</div>
                            </div>
                            <div className = "key-statistic-container">
                                <div className = "key-statistic">Dividend Yield</div>
                                <div className = "key-statistic-value">{stockData && stockData.dividendYield}</div>
                            </div>
                            <div className = "key-statistic-container" id = "eps">
                                <div className = "key-statistic">Earnings Per Share</div>
                                <div className = "key-statistic-value">{stockData && stockData.eps}</div>
                            </div>
                            <div className = "key-statistic-container" id = "high-today">
                                <div className = "key-statistic">High Today</div>
                                <div className = "key-statistic-value">{dailyHigh}</div>
                            </div>
                            <div className = "key-statistic-container" id = "low-today">
                                <div className = "key-statistic">Low Today</div>
                                <div className = "key-statistic-value">{dailyLow}</div>
                            </div>
                            <div className = "key-statistic-container" id = "open-today">
                                <div className = "key-statistic">Open Price</div>
                                <div className = "key-statistic-value">{openPrice}</div>
                            </div>
                            <div className = "key-statistic-container" id = "high">
                                <div className = "key-statistic">52 Week High</div>
                                <div className = "key-statistic-value">{stockData && stockData['52WeekHigh']}</div>
                            </div>
                            <div className = "key-statistic-container" id = "low">
                                <div className = "key-statistic">52 Week Low</div>
                                <div className = "key-statistic-value">{stockData && stockData['52WeekLow']}</div>
                            </div>
                        </div>
                    </div>


                    <div id = "earnings-container">
                        <div id = "earnings-title">Earnings</div>
                        <div id = "earnings-lower-container">
                            <div id ="earnings-chart-container">
                                {scatterChart}
                            </div>
                            <div id = "earnings-labels-container">
                                <div id = "estimated-container">
                                    <div>Color dot here</div>
                                    <div id = "estimated-container-left">
                                        <div>Estimated</div>
                                        <div>--per share</div>
                                    </div>
                                </div>
                                <div id = "actual-container">
                                    <div>Color dot here</div>
                                    <div id = "actual-container-left">
                                        <div>Actual</div>
                                        <div>--per share</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id = "related-stocks-container">
                        <div id = "related-stocks-title">Related Stocks</div>
                        <div id = "related-stocks-lower-container">
                            {(stockData && stockData.peers) ? stockData.peers.map(peer => {
                                return (
                                    <NavLink to = {`/stocks/${peer.symbol}`}key = {peer.symbol} className = "peer-container">
                                        <div className = "peer-title">{peer.symbol}</div>
                                        <div className = "peer-numbers-container">
                                            <div className = "peer-value">{peer.price}</div>
                                        </div>
                                    </NavLink>
                                )
                            }): null}
                        </div>

                    </div>

                </div>
            </div>
            <div id = "stockpage-right-container">
                <div id = "stock-purchase-container">
                    <div id = "stock-purchase-title">Buy {stockData && stockData.symbol}</div>
                    <div id = "stock-purchase-middle">
                        <div id ="stock-purchase-inner">
                            <div id = "invest-in-container">
                                <div>Invest In</div>
                                <select>
                                    <option value = "shares">Shares</option>
                                    <option value = "dollars">Dollars</option>
                                </select>
                            </div>
                            <div id = "amount-container">
                                <div>Amount</div>
                                <input type = "text" placeholder = "$0.00"></input>
                            </div>
                            <div id = "est-quantity-container">
                                <div>Est. Quantity</div>
                                <div>Value here</div>
                            </div>
                        </div>
                        <button id = "review-order-button">Review Order</button>
                    </div>
                    <div id = "stock-purchase-lower">
                        Buying Power Available here
                    </div>
                </div>
                <div id = "add-to-list-container">
                    <button id = "add-to-list-button">Add to Lists</button>
                </div>
            </div>
        </div>
    )
}

export default Stockpage
