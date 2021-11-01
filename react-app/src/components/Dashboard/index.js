import {useSelector,useDispatch} from "react-redux"
import { useState, useEffect } from "react"
import "./Dashboard.css"
import { addBuyingPower, toggleModalView, addModal, addWatchlistThunk, editWatchlistThunk, deleteWatchlistThunk, addModalInfo, deleteWatchlistStock} from "../../store/session";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie
  } from 'recharts';
  import Odometer from 'react-odometerjs';
  import {FaPlus} from "react-icons/fa"
  import {CgInfinity} from "react-icons/cg"
import { getPortfolioData, getMoversData } from "../../store/portfolio";
import ReactLoading from "react-loading"
import { getWatchlistGraphData,getHoldingGraphData } from "../../store/stocks";
import 'odometer/themes/odometer-theme-minimal.css';
import {IoIosArrowDown,IoIosArrowUp} from "react-icons/io"
import {BiDotsHorizontal} from "react-icons/bi"
import {BsGear, BsFillXCircleFill} from "react-icons/bs"
import FormModal from "../Modal/Modal";
import {NavLink} from "react-router-dom"
import {MdDeleteOutline} from "react-icons/md"
const finnhub = require('finnhub');
const apiKeys = ["c5pfejaad3i98uum8f0g","c5mtisqad3iam7tur1qg","c5riunqad3ifnpn54h4g","c5vl882ad3ibtqnn9te0","c5vl8jaad3ibtqnn9tt0","c5vlb92ad3ibtqnn9uug"]
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = apiKeys[Math.floor(Math.random(apiKeys.length))]
const finnhubClient = new finnhub.DefaultApi()
const moverAPIKeys = ["f54821126586727a0b1f5c527bbfa065","ff567560f2ecaf815b36d6a3ce51a55f","80301e4cb2194f8bb4150f755f36511a",`ff589a311ba428d0075c8c9c152c15dc`,"1bf1b668a4216e5a16da2e7b765aa33a","738b215d43b9f00852b64cd8ea4feeb9",'3dac763828badc9259ab8183641048be',"c5700bbd889a9a10692570136dd649cb","b1109d24db8e39fc3bb93acf0ebb8ce8","93902979e35374e3150c471c62d09750","28731869e94e62f83ca251a5139ee8ca","170664b4221b88a7b017599fe3009dca","50189556b9b25cb35a625c5e7e07a8d4"]

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
    const [watchlistInputValue,setWatchlistInputValue] = useState("")
    const [graphData,setGraphData] = useState("")
    const [yMax,setYmax] = useState(0)
    const [yMin,setYmin] = useState(Infinity)
    const [dotsOpen,setDotsOpen] = useState([])
    const [interval,setTimeInterval] = useState("5")
    const [unixStart,setUnixStart] = useState("")
    const [unixEnd,setUnixEnd] = useState("")
    const [news,setNews] = useState("")
    const [depositClick,setDepositClick] = useState(false)
    const [watchlistInput,toggleWatchlistInput] = useState(false)
    const [renderLineChart,setRenderLineChart] = useState("")
    const [performance,setPerformance] = useState(true)
    const [errors,setErrors] = useState([])
    const [watchlistChanges,setWatchlistChanges] = useState({})
    const [watchlistPrices,setWatchlistPrices] = useState({})
    const [holdingChanges,setHoldingChanges] = useState({})
    const [holdingPrices,setHoldingPrices] = useState({})
    const theme = useSelector(state=>state.session.theme)
    const user = useSelector(state=>state.session.user)
    const portfolioData = useSelector(state=>state.portfolio.portfolioData)
    const moversData = useSelector(state => state.portfolio.moversData)
    const watchlistStockData = useSelector(state=>state.stocks.watchlistStockData)
    const holdingStockData = useSelector(state => state.stocks.holdingStockData)

    const [pageLoaded,setPageLoaded] = useState("")

    const getAbbreviatedNumber = (num) => {
        console.log("ABBREVIATED NUMBER: ",num)
        if(num >= 1000000000000000000000000000000000000000){
            return "Unk."
        }
        if (num >= 1000000000000000000000000000000000000){
            return `${(num / 1000000000000000000000000000000000000).toFixed(2)}U`
        }
        if (num >= 1000000000000000000000000000000000){
            return `${(num / 1000000000000000000000000000000000).toFixed(2)}D`
        }
        if (num >= 1000000000000000000000000000000){
            return `${(num / 1000000000000000000000000000000).toFixed(2)}N`
        }
        if (num >= 1000000000000000000000000000){
            return `${(num / 1000000000000000000000000000).toFixed(2)}O`
        }
        if (num >= 1000000000000000000000000){
            return `${(num / 1000000000000000000000000).toFixed(2)}S`
        }
        if (num >= 1000000000000000000000){
            return `${(num / 1000000000000000000000).toFixed(2)}S`
        }
        if (num >= 1000000000000000000){
            return `${(num / 1000000000000000000).toFixed(2)}P`
        }
        if (num >= 1000000000000000){
            return `${(num / 1000000000000000).toFixed(2)}Q`
        }
        if (num >= 1000000000000){
            return `${(num / 1000000000000).toFixed(2)}T`
        }
        else if (num >= 1000000000){
            return `${(num / 1000000000).toFixed(2)}B`
        }
        else if(num >= 1000000){
            return `${(num / 1000000).toFixed(2)}M`
        } else return Number(Number(num).toFixed(2))
    }

    useEffect(()=>{setErrors([])},[watchlistInputValue])
    useEffect(()=>{
        if(watchlistStockData){
          console.log("WATCHLIST STOCK DATA",Object.keys(watchlistStockData))
          let newChanges = {}
          let newPrices = {}
          for(let symbol of Object.keys(watchlistStockData)){
            newChanges[symbol] = watchlistStockData[symbol].change
            newPrices[symbol] = watchlistStockData[symbol].price
          }
          setWatchlistChanges(newChanges)
          setWatchlistPrices(newPrices)

            for(let symbol of Object.keys(watchlistStockData)){
                if(watchlistStockData[symbol].data[watchlistStockData[symbol].data.length-1]){
                    if(watchlistStockData[symbol].data[watchlistStockData[symbol].data.length-1].price > watchlistStockData[symbol].data[0].price){
                        watchlistStockData[symbol].graph=(
                            // <ResponsiveContainer className = "responsive-container">
                                <LineChart width = {90} height = {45} data={watchlistStockData[symbol].data}>
                                    <Line dot = {false} type="monotone" dataKey="price" stroke = "rgb(0, 200, 5)"/>
                                    <XAxis dataKey="dateTime" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
                                    <YAxis tick = {false} axisLine={false} tickline = {false} width = {10} domain={[watchlistStockData[symbol].min,watchlistStockData[symbol].max]} allowDecimals={false}/>
                                    {/* <Tooltip/> */}
                                </LineChart>
                            //  </ResponsiveContainer>

                        )
                    } else {
                        watchlistStockData[symbol].graph=(
                            // <ResponsiveContainer className = "responsive-container">
                                <LineChart width = {90} height = {45} data={watchlistStockData[symbol].data}>
                                    <Line dot = {false} type="monotone" dataKey="price" stroke = "rgb(255, 80, 0)"/>
                                    <XAxis dataKey="dateTime" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
                                    <YAxis tick = {false} axisLine={false} tickline = {false} width = {10} domain={[watchlistStockData[symbol].min,watchlistStockData[symbol].max]} allowDecimals={false}/>
                                    {/* <Tooltip/> */}
                                </LineChart>
                            //  </ResponsiveContainer>

                        )
                    }
                }
            }
            let foundAll = true
            for(let symbol of Object.keys(watchlistStockData)){
                if(watchlistStockData[symbol]){
                    if(!watchlistStockData[symbol].graph){
                        foundAll = false
                    }
                }}
                if(foundAll)setPageLoaded("Dashboard")

        }
    },[watchlistStockData])


    useEffect(()=>{
        if(holdingStockData){
          console.log("WATCHLIST STOCK DATA",Object.keys(holdingStockData))
          let newChanges = {}
          let newPrices = {}
          for(let symbol of Object.keys(holdingStockData)){
            newChanges[symbol] = holdingStockData[symbol].change
            newPrices[symbol] = holdingStockData[symbol].price
          }
          setHoldingChanges(newChanges)
          setHoldingPrices(newPrices)

            for(let symbol of Object.keys(holdingStockData)){
                if(holdingStockData[symbol].data[holdingStockData[symbol].data.length-1]){
                if(holdingStockData[symbol].data[holdingStockData[symbol].data.length-1].price > holdingStockData[symbol].data[0].price){
                    holdingStockData[symbol].graph=(
                        // <ResponsiveContainer className = "responsive-container">
                            <LineChart width = {90} height = {45} data={holdingStockData[symbol].data}>
                                <Line dot = {false} type="monotone" dataKey="price" stroke = "rgb(0, 200, 5)"/>
                                <XAxis dataKey="dateTime" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
                                <YAxis tick = {false} axisLine={false} tickline = {false} width = {10} domain={[holdingStockData[symbol].min,holdingStockData[symbol].max]} allowDecimals={false}/>
                                {/* <Tooltip/> */}
                            </LineChart>
                        //  </ResponsiveContainer>

                    )
                } else {
                    holdingStockData[symbol].graph=(
                        // <ResponsiveContainer className = "responsive-container">
                            <LineChart width = {90} height = {45} data={holdingStockData[symbol].data}>
                                <Line dot = {false} type="monotone" dataKey="price" stroke = "rgb(255, 80, 0)"/>
                                <XAxis dataKey="dateTime" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
                                <YAxis tick = {false} axisLine={false} tickline = {false} width = {10} domain={[holdingStockData[symbol].min,holdingStockData[symbol].max]} allowDecimals={false}/>
                                {/* <Tooltip/> */}
                            </LineChart>
                        //  </ResponsiveContainer>

                    )
                }

            }}
        }
    },[holdingStockData])

    if(portfolioData){
        if(portfolioData[0]){
            let data = portfolioData.map(data=> data.dateTime)
        console.log(data)
        }

    }


    useEffect(()=>{
        document.title = "Stevenhood"
        if(user){
            let total = 0
            user.holdings.forEach(holding=>{
                finnhubClient.quote(holding.symbol, (error, data, response) => {
                    if(data){
                        if(data.c){
                            total += (Number(data.c) * Number(holding.shares))
                        setPortfolioValue(portfolioValue+total)
                        }
                    }


                });
            })
            finnhubClient.marketNews("general", {}, (error, data, response) => {
                const currentTime = new Date().getTime()/1000
                if(data){
                    data.sort((a,b)=>a.datetime > b.datetime)
                console.log("DATA: ",data)
                data.forEach(article => {
                    let seconds = currentTime - article.datetime
                    let timeInHours = seconds/3600
                    let timeInDays
                    let timeInMinutes
                    if(timeInHours >= 24){
                        timeInDays = timeInHours / 24
                    }
                    if(timeInDays)article.time = `${timeInDays} D`
                    else {
                        if(timeInHours < 1){
                            timeInMinutes = timeInHours*60
                            article.time = `${timeInMinutes.toFixed(0)} Min`
                        }
                        else {
                            if(timeInHours % 1 == 0) article.time = `${Math.floor(timeInHours).toFixed(0)}H`
                            else article.time = `${Math.floor(timeInHours).toFixed(0)}H ${((timeInHours % 1) * 60).toFixed(0)} Min`
                            }
                    }
                })
                setNews(data)
                }

              });
              let allWatchListStocks = []
              let allWatchListStockSymbols = []
              editBuyingPowerValue(user.buyingPower)
              dispatch(getMoversData(moverAPIKeys))
              for(let watchlist of user.watchlists){
                  console.log("WATCHLIST: ",watchlist)
                  allWatchListStocks = [...allWatchListStocks,...watchlist.stocks.filter(stock => !allWatchListStockSymbols.includes(stock.symbol))]
                  allWatchListStockSymbols = [...allWatchListStockSymbols,...watchlist.stocks.map(stock => stock.symbol)]

              }
              dispatch(getWatchlistGraphData(allWatchListStocks,apiKeys))
              dispatch(getHoldingGraphData(user.holdings,apiKeys))

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
                start.setDate(start.getDate()-1)
                end.setDate(end.getDate()-1)
                end.setHours(23,0,0,0)
              }
              start.setHours(0,0,0,0)

              let startUnix = Math.floor(Number(start.getTime() / 1000))
              let endUnix = Math.floor(Number(end.getTime() / 1000))
              setUnixStart(startUnix)
              setUnixEnd(endUnix)

        }
    },[])

    useEffect(()=>{
        if(portfolioData){
            setGraphData(portfolioData.data)
            setYmin(portfolioData.min)
            setYmax(portfolioData.max)
        }
    },[portfolioData])


    const handleWatchlistStockDelete = (stock,watchlist) => {
        console.log("HANDLER: ",watchlist,stock)
        dispatch(deleteWatchlistStock(watchlist.id,stock.symbol,user.id))
    }

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
        dispatch(getPortfolioData(user.holdings, interval, unixStart, unixEnd, apiKeys))
        }
    },[interval,unixEnd,unixStart])


    console.log("NEWS: ",news)
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
            console.log("IN TOO:LTIP: ",hours)
            let zone
            if(hours >= 12) {
                zone = "PM"
                if(hours > 12){
                    console.log("HOURS BEFORE: ",hours)
                    hours = hours % 12
                    console.log("HOURS AFTER: ",hours)
                }
            }
            else zone = "AM"

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

useEffect(()=>{
    setErrors([])
},[buyingPowerValue])

const chartHoverFunction = (e) => {
    if(e.activePayload){
        setPortfolioValueDynamic(e.activePayload[0].payload.price);
    }
}

const deposit = (value) => {
    console.log("RJGNPRIGUNBERPIGUNRE: ",!value)
    if(!value){
        if(isNaN(Number(buyingPowerValue))){
            setErrors(["Letters are not allowed"])
            return
        }
        if(buyingPowerValue.toString()[0] === "-"){
            setErrors(["Negative numbers are not allowed"])
            return
        }
        if(!Number(buyingPowerValue)){
            setErrors(["You must enter an amount to purchase"])
            return
        }
        console.log("BEAR: ",Number(buyingPowerValue).toFixed(5))
        let num = Number(buyingPowerValue).toFixed(5)
        console.log(num[num.length-1])

        if(buyingPowerValue>= 100000000000000000000){
            setErrors(['You must enter a smaller number'])
            return
        }
        if(num[num.length-1] !== "0"){
            num = Number(num)
            setErrors(["Less than one one-hundredth of a penny"])
            return
        }


        dispatch(addBuyingPower(user.id,Number(Number(buyingPowerValue).toFixed(4))))
    }
    setDepositClick(value)
    editBuyingPowerValue("")
}

const handleDotsClick = () => {
    dispatch(toggleModalView(true))
    dispatch(addModal("watchlist-dots"))
}
const portfolioReset = (e) => {
    setPortfolioValueDynamic(0)
}

const addWatchlist = (e) => {
    e.preventDefault()
    let errors = []
    let filteredList = user.watchlists.filter(watchlist=>watchlist.name===watchlistInputValue)
    if(!watchlistInputValue)errors.push("Watchlist name cannot be empty")
    if(watchlistInputValue.length > 15)errors.push("Watchlist name more than 15 characters")
    if(filteredList.length)errors.push("Watchlist name already exists")
    if(user.watchlists.length >=10){
        setErrors(["You cannot have more than 10 watchlists"])
        return
    }
    if(!errors.length){
        toggleWatchlistInput(false)
        dispatch(addWatchlistThunk(watchlistInputValue,user.id))
    }
    else setErrors(errors)
}

const deleteListHandler = (watchlist) => {
    setDotsOpen(false)
    console.log("WATCHLISTTTTTTTTTT: ",watchlist)
    dispatch(deleteWatchlistThunk(watchlist.id))
}

const editListHandler = (watchlist) => {
    setDotsOpen(false)
    dispatch(addModal("edit-watchlist"))
    dispatch(addModalInfo(watchlist))
    dispatch(toggleModalView(true))

}

const handleOpenDots = (e,watchlist) => {

    e.stopPropagation()

    if(dotsOpen === watchlist.id){
        setDotsOpen("")
    }
    else setDotsOpen(watchlist.id)
}
console.log(user)
console.log("WATCHLIST STOCK DATA: ",watchlistStockData)

    useEffect(()=>{
        if(graphData.length && graphData[0] !== "no_data"){

            if(graphData[graphData.length-1].price > graphData[0].price){
                setPerformance(true)
                setRenderLineChart((
                    <LineChart onMouseMove = {e=> chartHoverFunction(e)} onMouseLeave = {e=>portfolioReset(e)} width={700} height={300} data={graphData}>
                  <Line dot = {false} type="monotone" dataKey="price" stroke="rgb(0, 200, 5)" />
                  <XAxis tickSize = {1.5} tick = {false} interval={0} axisLine = {false} dataKey="dateTime" angle={0} textAnchor="end" />
                  <YAxis tick = {false} axisLine = {false} tickLine = {false} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
                  <Tooltip position={{ y: -16 }} cursor = {true} content = {<CustomTooltip/>}/>
                </LineChart>))
            } else {
                setPerformance(false)
                setRenderLineChart((
                    <LineChart onMouseMove = {e=> chartHoverFunction(e)} onMouseLeave = {e=>portfolioReset(e)} width={700} height={300} data={graphData}>
                  <Line dot = {false} type="monotone" dataKey="price" stroke="rgb(255, 80, 0)" />
                  <XAxis  tick = {false} axisLine = {false} dataKey="dateTime" angle={0} textAnchor="end" />
                  <YAxis tick = {false} axisLine = {false} tickLine = {false} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
                  <Tooltip position={{ y: -16 }} cursor = {true} content = {<CustomTooltip/>}/>
                </LineChart>))
            }
        }
        else if (portfolioData && portfolioData.data[0] === "no_data"){
            setRenderLineChart((
                <LineChart onMouseMove = {e=> chartHoverFunction(e)} onMouseLeave = {e=>portfolioReset(e)} width={700} height={300} data={graphData}>
              <Line dot = {false} type="monotone" dataKey="price" stroke="rgb(255, 80, 0)" />
              <XAxis  axisLine = {false} dataKey="dateTime" angle={0} textAnchor="end" />
              <YAxis tick = {false} axisLine = {false} tickLine = {false} domain={[yMin-1,yMax+1]} allowDecimals={false}/>
              <Tooltip position={{ y: -16 }} cursor = {true} content = {<CustomTooltip/>}/>
            </LineChart>))
        }
    },[graphData])


    if(moversData){
        console.log("LOSERS DATA: ",moversData.losersData)
        console.log("WINNERS DATA: ",moversData.gainersData)
    }

    console.log("PORTFOLIO DATA: ",portfolioData)

    if(pageLoaded !== "Dashboard"){
        return (<div id = "react-loading"><ReactLoading color = {"black"} height={100} width={700}/></div>
            );
    }

    return (
        <div id = "dashboard-outer-container">

            <div id = "dashboard-left-container">
                <div id = "dashboard-upper-container">
                    <div id = "dashboard-portfolio-value"><h1>$<Odometer value={portfolioValueDynamic ? Number(portfolioValueDynamic.toFixed(2)) : Number(portfolioValue.toFixed(2))} format="(,ddd).dd" /></h1></div>


                        <div id = "dashboard-graph-container">

                        <div id = "dashboard-graph">{renderLineChart}</div>
                        <div id = "dashboard-graph-timeframes-container">
                        <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("5","1D")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>1D</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("30","1W")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>1W</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1M")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>1M</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","3M")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>3M</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1Y")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>1Y</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("M","ALL")}} className = {performance ? "dashboard-graph-timeframe-button-good" : "dashboard-graph-timeframe-button-bad"}>ALL</button></span>
                        </div>
                    </div>

                    <div id = {buyingPower ? "dashboard-buying-power-container-closed" : "dashboard-buying-power-container" } >
                        <div id = {buyingPower ? "dashboard-buying-power-container-heading-open" : "dashboard-buying-power-container-heading-closed"} onClick={()=>toggleBuyingPower(!buyingPower)}>
                            <div id = "dashboard-buying-power-text">Buying Power</div>
                            <div id = {buyingPower ? "dashboard-buying-power-value-invisible" : "dashboard-buying-power-value-visible" }>${(user && user.buying_power) ? getAbbreviatedNumber(user.buying_power) : 0.00.toFixed(2)}</div>
                        </div>
                            <div id = {buyingPower ? "dashboard-buying-power-container-bottom-visible" : "dashboard-buying-power-container-bottom-invisible"}>
                                <div id = "dashboard-buying-power-container-left">
                                    <div id = "brokerage-cash-container">
                                        <div>Brokerage Cash</div>
                                        <div style = {{fontSize:"30px"}}><CgInfinity/></div>
                                    </div>
                                    <div id = "buying-power-container">
                                        <div>Buying Power</div>
                                        <div>${(user && user.buying_power) ? getAbbreviatedNumber(user.buying_power) : 0.00.toFixed(2)}</div>
                                    </div>
                                    <button id = {performance ? "buying-power-deposit-button-good" : "buying-power-deposit-button-bad"} onClick = {()=>deposit(!depositClick)} >{depositClick ? "Confirm" : `Deposit Funds`}</button>
                                </div>
                                <div id = "dashboard-buying-power-container-right">
                                    <div id = "buying-power-description">Buying Power represents the total value of assets you can purchase.</div>
                                    {errors.map((error, ind) => (
                        <div className = "errors" style = {{color:"red",position:"absolute",top:"115px",right:"25px",width:"100%"}}key={ind}>{error}</div>
                    ))}
                                    <input type = "text" placeholder = "Deposit Amount" id = "buying-power-deposit-input" value = {buyingPowerValue} onChange = {(e)=>editBuyingPowerValue(e.target.value)} style = {depositClick ? {display:"block"}: {display:"none"}}></input>
                                </div>
                        </div>
                    </div>
                </div>

                <div id = "dashboard-lower-container">
                    <div id = "gainers-container" style = {(moversData && moversData.gainersData.length) ? {} : {display:"none"}}>
                        <div id = "daily-gainers-title" className = "dashboard-movers-titles">Daily Gainers</div>
                        <div id = "daily-gainers-subtitle" className = "movers-subtitle">Stocks with the biggest gains today.</div>
                        <div id = "daily-gainers-container">
                            <div id = "daily-gainers-icons" className= "movers-icons">
                            {moversData && moversData.gainersData.map(data => {
                                return (
                                    <NavLink to = {`/stocks/${data.ticker}`} key = {data.ticker} className = "daily-gainers-individual movers-individual">
                                        <div className = "daily-gainers-icons-title movers-title">{data.companyName}</div>
                                        <div className = "daily-numbers-container movers-numbers">
                                            <div className = "daily-gainers-icons-value movers-value">${Number(data.price).toFixed(2)}</div>
                                            <div className = "daily-gainers-icons-change movers-change">+{data.changesPercentage}%</div>
                                        </div>
                                    </NavLink>
                                )
                                })}
                            </div>
                        </div>
                    </div>
                    <div id = "losers-container" style = {(moversData && moversData.losersData.length) ? {} : {display:"none"}}>
                        <div id = "daily-losers-title" className = "dashboard-movers-titles">Daily Losers</div>
                        <div id = "daily-losers-subtitle" className = "movers-subtitle">Stocks with the biggest losses today.</div>
                        <div id = "daily-losers-container">
                            <div id = "daily-losers-icons" className= "movers-icons">
                                {moversData && moversData.losersData.map(data => {
                                    return (
                                    <NavLink to = {`/stocks/${data.ticker}`} key = {data.ticker} className = "daily-losers-individual movers-individual">
                                        <div className = "daily-losers-icons-title movers-title">{data.companyName}</div>
                                        <div className = "daily-numbers-container movers-numbers">
                                            <div className = "daily-losers-icons-value movers-value">${Number(data.price).toFixed(2)}</div>
                                            <div className = "daily-losers-icons-change movers-change">{data.changesPercentage}%</div>
                                        </div>

                                    </NavLink>
                                    )
                                })}

                            </div>
                        </div>
                    </div>
                    <div id = "news-container">
                        <div id="news-title" className = "dashboard-titles">News</div>
                        <div id = "news-icons-container">
                            {news && news.map(post => {
                                return (
                                    <div className = "news-icon-container">
                                    <NavLink to = {{pathname:post.url}} target="_blank" key = {post.id} className = "news-icon-navlink">
                                        <div className = "news-top-container">
                                            <div className = "news-icon-source">{post.source}</div>
                                            <div className = "news-icon-date">{post.time}</div>
                                        </div>
                                        <div className = "news-icon-headline">{post.headline}</div>
                                    </NavLink>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </div>

            </div>
            <div id = "watchlist-outer-container">
                    <div id = "stocks-list-outer-title">Your Stocks</div>
                    {user && user.holdings.map(stock => {
                        return (
                            <NavLink key = {stock.symbol} className = "holding-stock-navlink" to = {`/stocks/${stock.symbol}`}>
                            <div className = "watchlist-stock-outer-container">
                                <div className = "watchlist-stock-symbol" style = {{marginLeft:"25px"}}>{stock.symbol}</div>
                                <div className = "watchlist-stock-graph">{(holdingStockData && holdingStockData[stock.symbol]) ? holdingStockData && holdingStockData[stock.symbol].graph : "-"}</div>
                                <div className = "watchlist-stock-price-container">
                                <div className = "watchlist-stock-price">${(holdingPrices[stock.symbol]) ? holdingPrices[stock.symbol].toFixed(2) : "-"}</div>
                                <div className = "watchlist-stock-change" style = {holdingChanges[stock.symbol] < 0 ? {color:"rgb(255, 80, 0)"}:{color:"rgb(0, 200, 5)"}}>{(holdingChanges[stock.symbol] && !isNaN(Number(holdingChanges[stock.symbol]))) ? `${holdingChanges[stock.symbol].toFixed(2)}%` : "" }</div>
                                </div>
                            </div>
                            </NavLink>
                        )
                    })}
                    <div id = "watchlist-outer-title">
                        <div id = "title-text">Lists</div>
                        <button id = "watchlist-plus-button" onClick = {()=>toggleWatchlistInput(!watchlistInput)}><FaPlus/></button>
                    </div>

                    <form id = "add-watchlist-form" onSubmit = {(e)=>addWatchlist(e)} style = {watchlistInput ? {display:"block"} : {display:"none"}}>
                    {errors.map((error, ind) => (
                        <div className = "errors" style = {{color:"red",position:"absolute",top:0,width:"100%"}}key={ind}>{error}</div>
                    ))}
                        <input placeholder = 'List Name' value = {watchlistInputValue} type="text" onChange = {(e)=>setWatchlistInputValue(e.target.value)} style = {theme === "dark" ? {color:"white"}:{}}/>
                        <div id = "watchlist-add-buttons-container">
                            <div id = {performance ? "watchlist-add-cancel-good" : "watchlist-add-cancel-bad"}onClick = {()=>toggleWatchlistInput(false)}>Cancel</div>
                            <input id = {performance ? "watchlist-add-submit-good" : "watchlist-add-submit-bad"} type="submit" value = "Create List"/>
                        </div>
                    </form>
                    {user && user.watchlists.map(watchlist=>{
                        return (
                            <div key = {watchlist.id} className = "watchlist-inner-container">
                                <div className = "watchlist-title" onClick = {()=>toggleOpenLists(watchlist)}>
                                    <div className = "watchlist-name">{watchlist.name}</div>
                                    <div className = "watchlist-title-right">
                                        <div className = "watchlist-dots" onClick = {(e)=>handleOpenDots(e,watchlist)}><BiDotsHorizontal/></div>
                                        <div className = "watchlist-arrow"> {openLists.includes(watchlist.id) ? (<IoIosArrowUp/>) : (<IoIosArrowDown/>)}</div>

                                    </div>
                                    <div className = "watchlist-dots-dropdown" style = { dotsOpen === watchlist.id ? {position:"absolute", display:"flex", zIndex:100} :{display:"none"}}>
                                            <div className = "watchlist-edit" onClick = {()=>editListHandler(watchlist)}><BsGear/> Edit List</div>
                                            <div className = "watchlist-delete" onClick = {()=>deleteListHandler(watchlist)}><BsFillXCircleFill/> Delete List</div>
                                    </div>

                                    </div>
                                    {watchlist.stocks.map(stock=>{
                                        return (
                                            <div key = {stock.symbol} className = "watchlist-stock-outer-container" style = {openLists.includes(watchlist.id) ? {display:"flex"} : {display:"none"}}>
                                            <div className = "watchlist-stock-delete">{<MdDeleteOutline onClick = {()=>handleWatchlistStockDelete(stock,watchlist)}/>}</div>
                                            <div className = "watchlist-stock-inner-container">
                                            <NavLink  className = "watchlist-stock-navlink" to = {`/stocks/${stock.symbol}`}>
                                                <div className = "watchlist-stock-symbol">{stock.symbol}</div>
                                                <div className = "watchlist-stock-graph">{(watchlistStockData && watchlistStockData[stock.symbol]) ? watchlistStockData && watchlistStockData[stock.symbol].graph : "-"}</div>
                                                <div className = "watchlist-stock-price-container">
                                                    <div className = "watchlist-stock-price">${watchlistPrices[stock.symbol] ? watchlistPrices[stock.symbol].toFixed(2) : "-"}</div>
                                                    <div className = "watchlist-stock-change" style = {watchlistChanges[stock.symbol] < 0 ? {color:"rgb(255, 80, 0)"}:{color:"rgb(0, 200, 5)"}}>{watchlistChanges[stock.symbol] && watchlistChanges[stock.symbol].toFixed(2)}%</div>
                                                </div>
                                            </NavLink>
                                            </div>
                                            </div>
                                        )
                                    })}

                            </div>
                        )})}
                <FormModal performance = {performance}/>
                </div>

        </div>

    )
}

export default Dashboard
