import {useState, useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import "./Search.css"
import { NavLink } from "react-router-dom"
import { getStocks } from "../../store/stocks"

const Search = () => {
    const [searchValue,setSearchValue] = useState("")
    const [currentStocks,setCurrentStocks] = useState("")
    const [focus,setFocus] = useState(true)
    const [coloredStocks,setColoredStocks] = useState("")
    const [nonColoredStocks,setNonColoredStocks] = useState("")
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getStocks())
    },[])
    const stocks = useSelector(state=>state.stocks.stocks)
    console.log("stocks inside search: ",stocks)
    useEffect(()=>{
        console.log(searchValue,stocks instanceof Array, !searchValue)

        if(!searchValue) setCurrentStocks("")
        if(stocks){
            if(!searchValue) setCurrentStocks("")
            else{
                setCurrentStocks(
                    stocks.filter(stock=>{
                        return stock.name.toLowerCase().startsWith(searchValue.toLowerCase()) || stock.symbol.toLowerCase().startsWith(searchValue.toLowerCase())
                    }).sort((a,b)=>{
                        if(a.symbol < b.symbol) return -1
                        if(a.symbol > b.symbol) return 1
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
                if(stock.symbol === "TSLA"){
                    console.log("INSIDE TESLA")
                    console.log(stock.symbol.toLowerCase().startsWith(searchValue.toLowerCase()))
                    console.log(stock.name.toLowerCase().startsWith(searchValue.toLowerCase()))
                }
                if(stock.symbol.toLowerCase().startsWith(searchValue.toLowerCase())){
                    stock.coloredSymbol = searchValue
                    stock.nonColoredSymbol = stock.symbol.slice(searchValue.length)
                } else {
                    stock.nonColoredSymbol = stock.symbol
                }
                if(stock.name.toLowerCase().startsWith(searchValue.toLowerCase())){
                    stock.coloredName = searchValue
                    stock.nonColoredName = stock.name.slice(searchValue.length)
                } else {
                    stock.nonColoredName = stock.name
                }
            }
            console.log("NC STOCKS: ",newCurrentStocks)
             setNonColoredStocks(newCurrentStocks)

        }

    },[currentStocks])

    // if(stocks.length)setIsLoaded(true)
    const changeFocus = (param) => {
        setFocus(param)
    }

    console.log("CURRNET STOCKS : ",currentStocks)
    console.log("FOCUS: ", focus)
    return (
        <div id = "search-container">
            <input id = "search-input" type = "text" value = {searchValue} onChange = {(e)=>setSearchValue(e.target.value)} onFocus={e=>changeFocus(true)} onBlur = {e=>changeFocus(false)}/>
            <div style = {(currentStocks && focus) ? {display:"block"} : {display:"none"}} id = "search-list">
                {nonColoredStocks && nonColoredStocks.map(stock => {
                    return (
                        <div key = {stock.id} className = "search-item">
                            <NavLink className = "search-item-navlink" to ="/">
                                <span className="stock-search-symbol colored">{stock.coloredSymbol && stock.coloredSymbol.toUpperCase()}</span>
                                <span className="stock-search-symbol">{stock.nonColoredSymbol.toUpperCase()}</span>
                                <span className="stock-search-name colored">{stock.coloredName && stock.coloredName[0].toUpperCase() + stock.coloredName.slice(1)}</span>
                                <span className="stock-search-name">{stock.coloredName ? stock.nonColoredName : stock.nonColoredName[0].toUpperCase() + stock.nonColoredName.slice(1)}</span>
                            </NavLink>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Search
