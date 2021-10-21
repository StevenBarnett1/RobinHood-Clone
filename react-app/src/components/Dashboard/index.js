import {useSelector,useDispatch} from "react-redux"
import { useState, useEffect } from "react"

const Dashboard = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getHoldings())
    },[])
    return (
        <h1>Dashboard</h1>
    )
}

export default Dashboard
