import {useSelector,useDispatch} from "react-redux"
import { useState, useEffect } from "react"
import "./Dashboard.css"
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c5mtisqad3iam7tur1qg"
const finnhubClient = new finnhub.DefaultApi()

const Dashboard = () => {
    const dispatch = useDispatch()
    const [portfolioValue,setPortfolioValue] = useState(0.00)
    const [buyingPower,toggleBuyingPower] = useState(false)
    const [openLists,setOpenLists] = useState([])
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
        let found = false
        for(let i=0;i<openLists.length;i++){
            if(openLists[i] !== watchlist.id){
                newList.append(watchlist.id)
            } else {
                found = true
            }
        }
        if (!found)newList.append(watchlist.id)
        setOpenLists(newList)

    }

    console.log(user)
    return (
        <div id = "dashboard-outer-container">
            <div id = "dashboard-left-container">
                <div id = "dashboard-upper-container">
                    <div id = "dashboard-portfolio-value"><h1>${portfolioValue}</h1></div>
                    <div id = "dashboard-graph-container">
                        <div id = "dashboard-graph"></div>
                        <div id = "dashboard-graph-timeframes-container"></div>
                    </div>
                    <div id = "dashboard-buying-power-container" onClick={(buyingPower=>toggleBuyingPower(!buyingPower))} style = {buyingPower ? {position:"absolute"} : {position:"relative"}}>
                        <div id = "dashboard-buying-power-container-heading">
                            <div id = "dashboard-buying-power-text">Buying Power</div>
                            <div id = "dashboard-buying-power-value" style = {buyingPower ? {display:"none"} : {display:"block"}}>${user && user.buyingPower}</div>
                        </div>
                        <div id = "dashboard-buying-power-container-bottom">
                            <div id = "dashboard-buying-power-container-left">
                                <div id = "brokerage-cash-container">
                                    <div>Brokerage Cash</div>
                                    <div>Infinity</div>
                                </div>
                                <div id = "buying-power-container">
                                    <div>Buying Power</div>
                                    <div>{user && user.buyingPower}</div>
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
                            <div className = "watchlist-inner-container">
                                <div className = "watchlist-title" onClick = {(watchlist)=>toggleOpenLists(watchlist)}>{watchlist.name}</div>
                                <div className = "watchlist-stocks">
                                    {watchlist.stocks.map(stock=>{
                                        return (
                                            <div className = "watchlist-stock-container" style = {openLists.includes(watchlist.id) ? {display:"block"} : {display:"none"}}>
                                                <div className = "watchlist-stock-symbol"></div>
                                                    <div className = "watchlist-graph"></div>
                                                    <div className = "watchlist-stock-price-container">
                                                        <div className = "watchlist-stock-price"></div>
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
