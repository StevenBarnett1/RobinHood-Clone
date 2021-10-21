import {useSelector,useDispatch} from "react-redux"
import { useState, useEffect } from "react"
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c5mtisqad3iam7tur1qg"
const finnhubClient = new finnhub.DefaultApi()

const Dashboard = () => {
    const dispatch = useDispatch()
    const [portfolioValue,setPortfolioValue] = useState("")
    const user = useSelector(state=>state.session.user)



    console.log("USER HERE: ", user)
    useEffect(()=>{
        if(user){
            console.log(user.holdings)
            user.holdings.map(holding=>{
                finnhubClient.quote(holding.symbol, (error, data, response) => {
                    return data.c
                });
            })

        }
    },[user])
    return (
        <h1>{}</h1>
    )
}

export default Dashboard
