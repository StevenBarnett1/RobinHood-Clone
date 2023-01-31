import {useState, useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import "./Search.css"
import { NavLink, useHistory} from "react-router-dom"
import { getStocks } from "../../store/stocks"
import { useParams } from "react-router"
import {AiOutlineSearch} from "react-icons/ai"

const Search = () => {

    const [searchValue,setSearchValue] = useState("")
    const [currentStocks,setCurrentStocks] = useState("")
    const [focus,setFocus] = useState(true)
    const [coloredStocks,setColoredStocks] = useState("")
    const [nonColoredStocks,setNonColoredStocks] = useState("")
    const theme = useSelector(state=>state.session.theme)
    const dispatch = useDispatch()
    const history = useHistory()
    const navigateTo = (location) => {
        setFocus(false)
        history.push(location)
    }
    useEffect(()=>{
        dispatch(getStocks())
    },[])
    const stocks = useSelector(state=>state.stocks.stocks)
    useEffect(()=>{

        if(!searchValue) setCurrentStocks("")
        if(stocks){
            if(!searchValue) setCurrentStocks("")
            else{
                setCurrentStocks(
                    stocks.stocks.filter(stock=>{
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
             setNonColoredStocks(newCurrentStocks)

        }

    },[currentStocks])

    const changeFocus = (param) => {

       setFocus(param)
    }

    return (
        <div id = "search-container">
            <div id = "search-input-outer-container" style = {theme === "dark" ? {boxShadow:"none"} : {}}>
             <AiOutlineSearch id = "magnifying-glass"/>
                <input autoComplete = "off" id = "search-input" placeholder = "Search" type = "text" value = {searchValue} onChange = {(e)=>setSearchValue(e.target.value)} onFocus={e=>changeFocus(true)} onBlur = {e=>changeFocus(false)}/>
            </div>
                <div style = {(currentStocks && focus) ? {display:"block"} : {display:"none"}} id = "search-list">
                {nonColoredStocks && nonColoredStocks.map(stock => {
                    return (
                        <div key = {stock.id} className = "search-item" >
                            <div onMouseDown = {()=>navigateTo(`/stocks/${stock.symbol}`)} className = "search-item-navlink" >
                                <div className = "stock-search-symbol-container">
                                    <span className="stock-search-symbol colored">{stock.coloredSymbol && stock.coloredSymbol.toUpperCase()}</span>
                                    <span className="stock-search-symbol">{stock.nonColoredSymbol.toUpperCase()}</span>
                                </div>
                                <span className="stock-search-name colored">{stock.coloredName && stock.coloredName[0].toUpperCase() + stock.coloredName.slice(1)}</span>
                                <span className="stock-search-name">{stock.coloredName ? stock.nonColoredName : stock.nonColoredName[0].toUpperCase() + stock.nonColoredName.slice(1)}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Search
