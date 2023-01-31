import "./StockPage.css"
import { useDispatch, useSelector } from "react-redux"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router";
import { getStockData } from "../../store/stocks";
import 'odometer/themes/odometer-theme-minimal.css';
import {IoIosArrowDown,IoIosArrowUp} from "react-icons/io"
import {BiDotsHorizontal} from "react-icons/bi"
import {BsGear, BsFillXCircleFill} from "react-icons/bs"
import {AiOutlinePlus} from "react-icons/ai"
import FormModal from "../Modal/Modal";
import {NavLink} from "react-router-dom"
import ReactLoading from "react-loading"
import { addBuyingPower, toggleModalView, addModal, addWatchlistThunk, editWatchlistThunk, deleteWatchlistThunk, addModalInfo, addHolding, sellHolding} from "../../store/session";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Scatter, ScatterChart
  } from 'recharts';
  import Odometer from 'react-odometerjs';
  import {FaPlus} from "react-icons/fa"

const alphaAdvantageKeys = ["3UC4IVVYIGV8RHJB","JHJY5TEK1A5HV67T","8MGCDK87SBTQ7CB5","KH07O8BLSZ2XTJTH","7LI2MOXNZKBJSW21"]
const financialModelingPrepKeys = ["f54821126586727a0b1f5c527bbfa065","ff567560f2ecaf815b36d6a3ce51a55f","80301e4cb2194f8bb4150f755f36511a",`ff589a311ba428d0075c8c9c152c15dc`,"1bf1b668a4216e5a16da2e7b765aa33a","738b215d43b9f00852b64cd8ea4feeb9",'3dac763828badc9259ab8183641048be',"c5700bbd889a9a10692570136dd649cb","b1109d24db8e39fc3bb93acf0ebb8ce8","93902979e35374e3150c471c62d09750","28731869e94e62f83ca251a5139ee8ca","170664b4221b88a7b017599fe3009dca","50189556b9b25cb35a625c5e7e07a8d4"]
const finnhub = require('finnhub');
const apiKeys = ["c5pfejaad3i98uum8f0g","c5mtisqad3iam7tur1qg","c5riunqad3ifnpn54h4g","c5vl882ad3ibtqnn9te0","c5vl8jaad3ibtqnn9tt0","c5vlb92ad3ibtqnn9uug"]
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = apiKeys[Math.floor(Math.random(apiKeys.length))]
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
    const [render,forceRerender] = useState(false)
    const [investType,setInvestType] = useState("shares")
    const [buySell,setBuySell] = useState("buy")
    const [investValue,setInvestValue] = useState("")
    const [readMore,toggleReadMore] = useState(false)
    const [currentShares,setCurrentShares] = useState("")
    const [performance,setPerformance] = useState(true)
    const [errors,setErrors] = useState([])
    const [pageLoaded,setPageLoaded] = useState("")
    const theme = useSelector(state=>state.session.theme)

    const user = useSelector(state=>state.session.user)
    const stockData = useSelector(state=>state.stocks.stockData)

    useEffect(()=>{
        setErrors([])
    },[investValue])
    useEffect(()=>{
        document.title = `${params.symbol}`
        forceRerender(!render)
    },[params])
    useEffect(()=>{
        if(stockData && stockData.symbol){
            if(!isNaN(Number(stockData.price)))setStockValue(stockData.price)
            if(stockData.data){
                if(stockData.data[0]){
                    if(stockData.data.length > 3){
                        setGraphData(stockData.data)
                        setYmin(stockData.min)
                        setYmax(stockData.max)
                    }
                }

            }


            setActualScatterData(stockData.actual)
            setEstimatedScatterData(stockData.estimated)
            if(interval === "5"){
                setDailyHigh(stockData.max)
                setDailyLow(stockData.min)
                if(stockData.data[0])setOpenPrice(stockData.data[0].price)
            }
            if(params){
                if(stockData.symbol === params.symbol){
                    setPageLoaded(params.symbol)
                }
            }

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
                if(hours >= 12){
                    zone = "PM"
                    if(hours > 12){
                        hours = hours % 12
                    }
                }
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
        setErrors([])
        setInvestValue("")
    },[investType,buySell])
    useEffect(()=>{
        if(user && stockData){
            let holding = user.holdings.filter(holding => holding.symbol === stockData.symbol)
            if(holding.length){
                setCurrentShares(Number(holding[0].shares))
            } else setCurrentShares(0)
        }
    },[user,stockData])

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
              } else if (start.getHours() < 6 || (start.getHours() === 6 && start.getMinutes() < 30)){
                  if(start.getDate() === 1){
                    start.setDate(start.getDate()-3)
                    end.setDate(end.getDate()-3)
                    end.setHours(23,0,0,0)
                  }
                  else {
                    start.setDate(start.getDate()-1)
                    end.setDate(end.getDate()-1)
                    end.setHours(23,0,0,0)
                  }

              }
              start.setHours(0,0,0,0)

              let startUnix = Math.floor(Number(start.getTime() / 1000))
              let endUnix = Math.floor(Number(end.getTime() / 1000))
              setUnixStart(startUnix)
              setUnixEnd(endUnix)

    },[params])
    useEffect(()=>{
        setErrors([])
    },[buySell])
    useEffect(()=>{
        if(unixEnd && interval) {

            dispatch(getStockData(params.symbol,interval,unixStart,unixEnd,apiKeys,financialModelingPrepKeys,alphaAdvantageKeys))
        }
    },[render,interval,unixEnd,unixStart])

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

    const getAbbreviatedNumber = (num) => {
        if(num >= 1000000000000000000000000000000000000000){
            return "Unk."
        }
        if (num >= 1000000000000000000000000000000000000){
            return `${(num / 1000000000000000000000000000000000000).toFixed(3)}U`
        }
        if (num >= 1000000000000000000000000000000000){
            return `${(num / 1000000000000000000000000000000000).toFixed(3)}D`
        }
        if (num >= 1000000000000000000000000000000){
            return `${(num / 1000000000000000000000000000000).toFixed(3)}N`
        }
        if (num >= 1000000000000000000000000000){
            return `${(num / 1000000000000000000000000000).toFixed(3)}O`
        }
        if (num >= 1000000000000000000000000){
            return `${(num / 1000000000000000000000000).toFixed(3)}S`
        }
        if (num >= 1000000000000000000000){
            return `${(num / 1000000000000000000000).toFixed(3)}S`
        }
        if (num >= 1000000000000000000){
            return `${(num / 1000000000000000000).toFixed(3)}P`
        }
        if (num >= 1000000000000000){
            return `${(num / 1000000000000000).toFixed(3)}Q`
        }
        if (num >= 1000000000000){
            return `${(num / 1000000000000).toFixed(3)}T`
        }
        else if (num >= 1000000000){
            return `${(num / 1000000000).toFixed(3)}B`
        }
        else if(num >= 1000000){
            return `${(num / 1000000).toFixed(3)}M`
        } else return Number(Number(num).toFixed(4))
    }

    useEffect(()=>{

        if(graphData){
            if(graphData[graphData.length-1]){
                if(graphData[graphData.length-1].price > graphData[0].price){
                    setPerformance(true)
                    setRenderLineChart((
                        <LineChart onMouseMove = {e=> chartHoverFunction(e)} onMouseLeave = {e=>stockReset(e)} width={700} height={300} data={graphData}>
                      <Line dot = {false} type="monotone" dataKey="price" stroke="rgb(0, 200, 5)" />
                      <XAxis tick = {false} tickSize = {1.5} interval={0} axisLine = {false} dataKey="dateTime" angle={0} textAnchor="end" />
                      <YAxis tick = {false} axisLine = {false} tickLine = {false} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
                      <Tooltip position={{ y: -16 }} cursor = {true} content = {<CustomTooltip/>}/>
                    </LineChart>))
                } else {
                    setPerformance(false)
                    setRenderLineChart((
                        <LineChart onMouseMove = {e=> chartHoverFunction(e)} onMouseLeave = {e=>stockReset(e)} width={700} height={300} data={graphData}>
                      <Line dot = {false} type="monotone" dataKey="price" stroke="rgb(255, 80, 0)" />
                      <XAxis  tick = {false} axisLine = {false} dataKey="dateTime" angle={0} textAnchor="end" />
                      <YAxis tick = {false} axisLine = {false} tickLine = {false} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
                      <Tooltip position={{ y: -16 }} cursor = {true} content = {<CustomTooltip/>}/>
                    </LineChart>))
                }
            } else {
                setRenderLineChart((
                    <LineChart onMouseMove = {e=> chartHoverFunction(e)} onMouseLeave = {e=>stockReset(e)} width={700} height={300}>
                  <Line dot = {false} type="monotone" dataKey="price" stroke="rgb(255, 80, 0)" />
                  <XAxis  tick = {false} axisLine = {false} dataKey="dateTime" angle={0} textAnchor="end" />
                  <YAxis tick = {false} axisLine = {false} tickLine = {false} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
                  <Tooltip position={{ y: -16 }} cursor = {true} content = {<CustomTooltip/>}/>
                </LineChart>))
            }
        }
    },[graphData])
    const submitOrder = (type) => {
        let errors = []
        if(isNaN(Number(investValue))){
            errors.push("Letters are not allowed")
            setErrors(errors)
            return
        }
        if(investValue.toString()[0] === "-"){
            setErrors(["Negative numbers are not allowed"])
            return
        }
        if(!Number(investValue) && type === "buy"){
            setErrors(["You must enter an amount to purchase"])
            return
        }
        setErrors([])
        if(investValue >= 100000000000000000000){
            setErrors(['You must enter a smaller number'])
            return
        }
        let num = Number(investValue).toFixed(5)
        if(num[num.length-1] !== "0"){
            num = Number(num)
            if(investType === "shares"){
                setErrors(['Less than one ten-thousandth of a share'])
            }
            else if (investType === "dollars"){
                setErrors(["Less than one one-hundredth of a penny"])
            }

            return
        }

        if(!Number(investValue) && type === "sell"){
            setErrors(["You must enter an amount to sell"])
            return
        }
        if(investValue && investType === "shares" && type === "buy"){
            if(investValue*stockData.price > user.buying_power)errors.push("Not enough funds")
            if(!errors.length){
                dispatch(addHolding(stockData.symbol,Number(Number(investValue).toFixed(4)),user.id))
                dispatch(addBuyingPower(user.id,Number(-Number(stockData.price*investValue).toFixed(4))))
                setInvestValue(0)
            } else setErrors(errors)
        } else if (investValue && investType === "dollars" && type === "buy"){
            if(investValue > user.buying_power)errors.push("Not enough funds")
            if(!errors.length){
                dispatch(addHolding(stockData.symbol,Number((Number(investValue/stockData.price).toFixed(4))),user.id))
                dispatch(addBuyingPower(user.id,Number(-Number(investValue).toFixed(4))))
                setInvestValue(0)
            } else setErrors(errors)

        } else if (investValue && investType === "shares" && type === "sell"){
            if(user.holdings.filter(holding=>holding.symbol === stockData.symbol.toUpperCase()).length && user.holdings.filter(holding=>holding.symbol === stockData.symbol.toUpperCase())[0].shares >= investValue){
                dispatch(sellHolding(stockData.symbol,Number(Number(investValue).toFixed(4)),user.id))
                dispatch(addBuyingPower(user.id,Number(Number(stockData.price*investValue).toFixed(4))))
                setInvestValue(0)
            } else setErrors(["Not enough shares"])

        } else if (investValue && investType === "dollars" && type === "sell"){
            if(user.holdings.filter(holding=>holding.symbol === stockData.symbol.toUpperCase()).length && user.holdings.filter(holding=>holding.symbol === stockData.symbol.toUpperCase())[0].shares >= (investValue/stockData.price)){
                dispatch(sellHolding(stockData.symbol,Number((Number(investValue/stockData.price).toFixed(4))),user.id))
                dispatch(addBuyingPower(user.id,Number(Number(investValue).toFixed(4))))
                setInvestValue(0)
            } else setErrors(["Not enough shares"])

        }
    }

    let scatterChart = (
    <ScatterChart width={600} height={300} >

        <CartesianGrid />
        <XAxis dataKey="period" interval = {0} allowDuplicatedCategory={false}/>
        <YAxis type="number" dataKey="data" />
        <Legend height = {1}/>
        <Scatter name = "Actual" data={actualScatterData} fill={performance ? "rgb(0, 200, 5)" :"rgb(255, 80, 0)"} />
        <Scatter name = "Estimated" data={estimatedScatterData} fill={performance ? "rgb(0, 122, 4)" :"rgb(167, 53, 0)"} />
        <Tooltip/>
    </ScatterChart>
    )

        const addToList = (symbol) => {
            dispatch(toggleModalView(true))
            dispatch(addModal("add-to-watchlist"))
        }

    if(pageLoaded !== params.symbol){
        return (<div id = "react-loading-container" style = {theme === "light" ? {backgroundColor:"white"} : {backgroundColor:"black"}}><div id = "react-loading"><ReactLoading color = {theme === "light" ? "black" : "white"} height={100} width={700}/></div></div>
            );
    }
    return (
        <div id = "stockpage-outermost" style = {theme === "dark" ? {backgroundColor:"black"} : {backgroundColor:"white"}}>
        <div id = "stockpage-outer-container" style = {theme === "dark" ? {backgroundColor:"black"} : {backgroundColor:"white"}}>
            <div id = "stockpage-left-container">
                <div id = "stockpage-upper-container">
                    <div id = "stockpage-stock-value"><h1>$<Odometer value={(!isNaN(Number(stockValueDynamic)) && stockValueDynamic)? Number(stockValueDynamic.toFixed(2)) : Number(stockValue.toFixed(2))} format="(,ddd).dd" /></h1></div>

                    <div id = "stockpage-graph-container">
                        <div id = "stockpage-graph">
                            {renderLineChart}
                        </div>
                        <div id = "stockpage-graph-timeframes-container">
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("5","1D")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>1D</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("30","1W")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>1W</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1M")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>1M</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","3M")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>3M</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1Y")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>1Y</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("M","ALL")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>ALL</button></span>
                        </div>
                    </div>
                </div>
                <div id = "stockpage-lower-container">
                    <div id = "about-container"  > {/*style = {readMore ? {height:'auto'} : {height:"200px"}}*/}
                        <div id = "about-title" >About</div>
                        <div id = "about-description" style = {(stockData && !stockData.description) ? {display:"none"}:{}}>
                            {stockData && stockData.description}
                        </div>
                        {/* <span onClick = {()=>toggleReadMore(!readMore)} id = "read-more">Read More</span> */}

                    </div>
                    <div id = "about-lower-container" style = {(stockData && !stockData.description) ? {marginTop:"40px"}:{}}>
                            <div className = "about-individual-container" id = "ceo-container">
                                <div id = "ceo-title" className = "about-subtitle">CEO</div>
                                <div id = "ceo-value">{(stockData && stockData.ceo) ? stockData.ceo : "-"}</div>
                            </div>
                            <div className = "about-individual-container" id = "employees-container">
                            <div id = "employees-title" className = "about-subtitle">Employees</div>
                                <div id = "employees-value">{(stockData && stockData.employees) ? stockData.employees : "-"}</div>
                            </div>
                            <div className = "about-individual-container" id = "headquarters-container">
                            <div id = "headquarters-title" className = "about-subtitle">Headquarters</div>
                                <div id = "headquarters-value">{(stockData && stockData.headquarters) ? stockData.headquarters : "-"}</div>
                            </div>
                        </div>
                    <div id = "key-statistics-container">
                        <h2 id = "key-statistics-title">Key Statistics</h2>
                        <div id = "key-statistics-lower-container">
                            <div className = "key-statistic-container">
                                <div className = "key-statistic">Market Cap</div>
                                <div className = "key-statistic-value">{(stockData && stockData.marketCap) ? `$${getAbbreviatedNumber(stockData.marketCap)}` : "-"}</div>
                            </div>
                            <div className = "key-statistic-container" id = "revenue">
                                <div className = "key-statistic">Revenue</div>
                                <div className = "key-statistic-value">{(stockData && stockData.revenue) ? `$${getAbbreviatedNumber(stockData.revenue)}`: "-"}</div>
                            </div>
                            <div className = "key-statistic-container" id = "price-to-earnings">
                                <div className = "key-statistic">Price-Earnings Ratio</div>
                                <div className = "key-statistic-value">{(stockData && stockData.peRatio) ? stockData.peRatio : "-"}</div>
                            </div>
                            <div className = "key-statistic-container" id = "dividend-yield">
                                <div className = "key-statistic">Dividend Yield</div>
                                <div className = "key-statistic-value">{(stockData && stockData.dividendYield) ? stockData.dividendYield : "-"}</div>
                            </div>
                            <div className = "key-statistic-container" id = "eps">
                                <div className = "key-statistic">Earnings Per Share</div>
                                <div className = "key-statistic-value">{(stockData && stockData.eps) ? `$${stockData.eps}` : "-"}</div>
                            </div>
                            <div className = "key-statistic-container" id = "high-today">
                                <div className = "key-statistic">High Today</div>
                                <div className = "key-statistic-value">{dailyHigh ? `$${dailyHigh}` : "-"}</div>
                            </div>
                            <div className = "key-statistic-container" id = "low-today">
                                <div className = "key-statistic">Low Today</div>
                                <div className = "key-statistic-value">{dailyLow ? `$${dailyLow}` : "-"}</div>
                            </div>
                            <div className = "key-statistic-container" id = "open-today">
                                <div className = "key-statistic">Open Price</div>
                                <div className = "key-statistic-value">{openPrice ? `$${openPrice}` : "-"}</div>
                            </div>
                            <div className = "key-statistic-container" id = "high">
                                <div className = "key-statistic">52 Week High</div>
                                <div className = "key-statistic-value">{(stockData && stockData['52WeekHigh']) ? `$${stockData['52WeekHigh']}` : "-"}</div>
                            </div>
                            <div className = "key-statistic-container" id = "low">
                                <div className = "key-statistic">52 Week Low</div>
                                <div className = "key-statistic-value">{(stockData && stockData['52WeekLow']) ? `$${stockData['52WeekLow']}` : "-"}</div>
                            </div>
                        </div>
                    </div>


                    <div id = "earnings-container" style = {(estimatedScatterData && estimatedScatterData.length===4) ? {display:"block"}: {display:"none"} }>
                        <h2 id = "earnings-title">Earnings</h2>
                        <div id = "earnings-lower-container">
                            <div id ="earnings-chart-container">
                                {scatterChart}
                            </div>
                        </div>
                    </div>
                    <div id = "related-stocks-container" style = {(stockData && stockData.peers) ? (stockData.peers.length ? {} : {display:"none"}) : {}}>
                        <h2 id = "related-stocks-title">People Also Own</h2>
                        <div id = "related-stocks-subtitle">This list is based on the portfolios of people on Robinhood who own {stockData && stockData.symbol}. It’s not an investment recommendation.</div>
                        <div id = "related-stocks-inner-container">
                        <div id = "related-stocks-lower-container">
                            {(stockData && stockData.peers) ? stockData.peers.map(peer => (

                                    <NavLink to = {`/stocks/${peer.symbol}`} key = {peer.symbol} className = "peer-container">
                                        <div className = "peer-title">{peer.symbol}</div>
                                        <div className = "peer-numbers-container">
                                            <div className = "peer-value">${peer.price}</div>
                                        </div>
                                    </NavLink>
                        )): null}
                        </div>
                        </div>

                    </div>
                    <div id = "stockpage-disclosure" style = {(stockData && stockData.peers) ? (stockData.peers.length ? {} : {marginTop:"60px"}) : {}}>All investments involve risks, including the loss of principal. Securities trading offered through Robinhood Financial LLC, a registered broker-dealer and Member SIPC.</div>
                    {/* <NavLink id = "stock-disclosure-navlink" to = {{pathname:`https://robinhood.com/stocks/${stockData && stockData.symbol}#`}} target="_blank"> Full disclosure</NavLink> */}
                </div>
            </div>
            <div id = "stockpage-right-container">
                <div id = "stockpage-right-inner-container">
                <div id = "stock-purchase-container" style = {investType === "shares" ? {} : {height:"365px"}}>
                    <div id = "stock-purchase-titles">
                        <div id = {performance ? "stock-buy-title-good" : "stock-buy-title-bad"} style = {buySell === "buy" ? {borderBottom:"30px"} : {}} onClick = {()=>setBuySell('buy')}>Buy {(stockData && stockData.symbol) ? stockData.symbol.toUpperCase(): ""}</div>
                        <div id = {performance ? "stock-sell-title-good" : "stock-sell-title-bad"} style = {buySell === "sell" ? {borderBottomWidth:"1px"} : {borderBottomWidth:"0px"}} onClick = {()=>setBuySell('sell')}>Sell {(stockData && stockData.symbol) ? stockData.symbol.toUpperCase(): ""}</div>
                    </div>
                    <div id = "stock-purchase-middle">
                    {errors.map((error, ind) => (
                <div className = "errors" style = {{color:"red",position:"absolute",top:"49px",width:"100%"}}key={ind}>{error}</div>
              ))}
                        <div id ="stock-purchase-inner">
                            <div id = "invest-in-container">
                                <div id = "invest-in-label">{buySell === "buy" ? "Invest In" : "Sell"}</div>
                                <select id = "invest-in-value" value = {investType} onChange = {e=>setInvestType(e.target.value)}>
                                    <option value = "shares" >Shares</option>
                                    <option value = "dollars">Dollars</option>
                                </select>
                            </div>
                            <div id = "amount-container" style = {investType === "shares" ? {borderBottom:"none"} : {marginBottom:"15px", paddingBottom:"7px", borderBottom:"1px solid var(--border-color)"}}>
                                <div id = "amount-label">{investType === "shares" ? 'Shares' : 'Amount'}</div>
                                <input id = "amount-value" autoComplete = "off" value = {investValue} onChange = {e=>setInvestValue(e.target.value)} type = "text" placeholder = {investType === "shares" ? 0 :'$0.00'}></input>
                            </div>
                                {investType === "shares" ? (
                                    <div id = "market-price-container">
                                        <div id = {performance ? "market-price-label-good" : "market-price-label-bad"}>Market Price</div>
                                        <div id ="market-price-value">{(stockData && stockData.price) ? `$${stockData.price}`: "-"}</div>
                                    </div>
                                ) : null}

                            <div id = "est-quantity-container">
                                <div id = "est-quantity-label">{investType === "shares" ? 'Estimated Cost' : 'Est. Shares' }</div>
                                {investType === "shares" ? (
                                    <div id = "est-quantity-value">{((stockData && stockData.price) && !isNaN(Number(investValue))) ? `$${getAbbreviatedNumber(Number((stockData.price * investValue).toFixed(4)))}` : "-"}</div>
                                ) : (
                                    <div id = "est-quantity-value">{((stockData && stockData.price) && !isNaN(Number(investValue))) ? getAbbreviatedNumber(Number((investValue / stockData.price).toFixed(4))) : "-"}</div>
                                )}
                            </div>
                        </div>
                        <button id = {performance ? "review-order-button-good":"review-order-button-bad"} onClick = {()=>submitOrder(buySell)} >{buySell === "buy" ? "Purchase Stock" : "Sell Stock"}</button>
                    </div>
                    <div id = {performance ? "stock-purchase-lower-good" : "stock-purchase-lower-bad"}>
                        {(buySell === "buy" && user) ? `$${getAbbreviatedNumber(user.buying_power)} buying power available`: `${currentShares === 0 ? `You have no shares available to sell` : `${currentShares === 1 ? `${getAbbreviatedNumber(currentShares)} share available`: `${getAbbreviatedNumber(currentShares)} shares available`}` }`}
                    </div>
                </div>
                <div id = "add-to-list-container">
                    <button onClick = {()=>addToList(stockData.symbol)}id = {performance ? "add-to-list-button-good" : "add-to-list-button-bad"}><AiOutlinePlus/> Add to Lists</button>
                </div>
                </div>
            </div>
            <FormModal symbol={stockData && stockData.symbol} performance = {performance}/>
        </div>
        </div>
    )
}

export default Stockpage
