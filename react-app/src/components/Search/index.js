import {useState, useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"



const Search = () => {
    const [searchValue,setSearchValue] = useState("")
    const dispatch = useDispatch()
    return (
        <>
            <input type = "text" value = {searchValue} onChange = {(e)=>setSearchValue(e.target.value)}/>
            <ul>

            </ul>
        </>
    )
}

export default Search
