import {useState, useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import "./Search.css"


const Search = () => {
    const [searchValue,setSearchValue] = useState("")
    const [currentStocks,setCurrentStocks] = useState("")
    const stocks = useSelector(state=>state.stocks)

    useEffect(()=>{
        if(stocks instanceof Array){
            if(!searchValue)setCurrentStocks("")
            else{
                setCurrentStocks(
                    stocks.filter(stock=>{
                        return stock.name.startsWith(searchValue.toLowerCase()) || stock.symbol.toLowerCase().startsWith(searchValue.toLowerCase())
                    })
                )
            }

        }

    },[searchValue])
    return (
        <div id = "search-container">
            <input id = "search-input" type = "text" value = {searchValue} onChange = {(e)=>setSearchValue(e.target.value)}/>
            <div style = {currentStocks ? {display:"block"} : {display:"none"}}id = "search-list">
                {currentStocks && currentStocks.map(stock => {
                    return (
                        <div className = "search-item">{stock.symbol} {stock.name}</div>
                    )
                })}
            </div>
        </div>
    )
}

export default Search
