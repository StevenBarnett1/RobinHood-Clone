import {useSelector,useDispatch} from "react-redux"
import { useState, useEffect } from "react"

const Dashboard = () => {
    const dispatch = useDispatch()
    const user = useSelector(state=>state.session.user)
    console.log("USER HERE: ", user)
    return (
        <h1>Dashboard</h1>
    )
}

export default Dashboard
