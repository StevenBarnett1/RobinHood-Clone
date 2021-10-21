import {useState, useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import "./Search.css"
import { NavLink } from "react-router-dom"

const Search = () => {
    const [searchValue,setSearchValue] = useState("")
    const [currentStocks,setCurrentStocks] = useState("")
    const [focus,setFocus] = useState(true)
    const [coloredStocks,setColoredStocks] = useState("")
    const [nonColoredStocks,setNonColoredStocks] = useState("")
    const stocks = useSelector(state=>state.stocks)

    useEffect(()=>{
        if(stocks instanceof Array){
            if(!searchValue)setCurrentStocks("")
            else{
                setCurrentStocks(
                    stocks.filter(stock=>{
                        return stock.name.startsWith(searchValue.toLowerCase()) || stock.symbol.toLowerCase().startsWith(searchValue.toLowerCase())
                    }).sort((a,b)=>{
                        if(a.symbol < b.symbol) return -1
                        if(a.symbol > b.symbol)return 1
                        return 0;
                    })
                )
            }
        }
    },[searchValue])

    useEffect(()=>{

        if(currentStocks instanceof Array){
            const newCurrentStocks = []
            for(let stock of currentStocks){
                newCurrentStocks.push({...stock})
            }

            for(let stock of newCurrentStocks){
                console.log("stock before: ",stock)
                let length = searchValue.length
                stock.name = stock.name.slice(length)
                stock.symbol = stock.symbol.slice(length)
                console.log("stock after: ",stock)
            }
             setNonColoredStocks(newCurrentStocks)

        }

    },[currentStocks])

    const changeFocus = (param) => {
        setFocus(param)
    }

    console.log("NON COLORED: ",nonColoredStocks)
    console.log("SEARCH VALUE", searchValue)
    return (
        <div id = "search-container">
            <input id = "search-input" type = "text" value = {searchValue} onChange = {(e)=>setSearchValue(e.target.value)} onFocus={e=>changeFocus(true)} onBlur = {e=>changeFocus(false)}/>
            <div style = {(currentStocks && focus) ? {display:"block"} : {display:"none"}} id = "search-list">
                {nonColoredStocks && nonColoredStocks.map(stock => {
                    return (
                        <div key = {stock.id} className = "search-item">
                            <NavLink className = "search-item-navlink" to ="/">
                                <span className="stock-search-symbol colored">{searchValue && searchValue.toUpperCase()}</span>
                                <span className="stock-search-symbol">{stock.symbol}</span>
                                <span className="stock-search-name colored">{searchValue && searchValue[0].toUpperCase()+searchValue.slice(1)}</span>
                                <span className="stock-search-name">{stock.name}</span>
                            </NavLink>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Search
