import "./StockPage.css"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"




const Stockpage = () => {
    const [graphData,setGraphDate] = useState("")
    const [renderLineChart,setRenderLineChart] = useState("")
    const [portfolioValue,setPortfolioValue] = useState(0.00)
    const [portfolioValueDynamic,setPortfolioValueDynamic] = useState(0)
    const [unixStart,setUnixStart] = useState("")
    const [unixEnd,setUnixEnd] = useState("")
    const [interval,setTimeInterval] = useState("5")
    const [yMax,setYmax] = useState(0)
    const [yMin,setYmin] = useState(Infinity)

    const user = useSelector(state=>state.session.user)
    const stockData = useSelector(state=>state.stocks.stockData)

    useEffect(()=>{
        if(stockData){
            setGraphData(stockData.data)
            setYmin(stockData.min)
            setYmax(stockData.max)

        }
    },[stockData])

    const CustomTooltip = ({ active, payload }) => {
        // if (!active || !tooltip)    return null
        if(payload && payload[0]){

                console.log("AA: ",payload)
                console.log("BB",payload[0])
                console.log("CC",payload[0].payload)
                let year = payload[0].payload.dateTime.getFullYear()
                let month = months[payload[0].payload.dateTime.getMonth()]
                let day = payload[0].payload.dateTime.getDate()
                let hours = payload[0].payload.dateTime.getHours()
                let minutes = payload[0].payload.dateTime.getMinutes()
                if(minutes === 0)minutes = "00"
                if(minutes === 5)minutes = "05"
                let zone
                if(hours >= 12) zone = "PM"
                else zone = "AM"
                console.log("INTERVAL: ",interval)
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

    },[])
    const chartHoverFunction = (e) => {
        if(e.activePayload){
            setPortfolioValueDynamic(e.activePayload[0].payload.price);
        }
    }

    const portfolioReset = (e) => {
        setPortfolioValueDynamic(0)
    }

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

    useEffect(()=>{
        if(stockData){

            for(let symbol of Object.keys(stockData)){
                console.log("AYYYY: ",stockData[symbol])
                if(stockData[symbol].data[stockData[symbol].data.length-1].price > stockData[symbol].data[0].price){
                    stockData[symbol].graph=(
                        // <ResponsiveContainer className = "responsive-container">
                            <LineChart width = {107} height = {45} data={stockData[symbol].data}>
                                <Line dot = {false} type="monotone" dataKey="price" stroke = "rgb(0, 200, 5)"/>
                                <XAxis dataKey="dateTime" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
                                <YAxis tick = {false} axisLine={false} tickline = {false} width = {10} domain={[stockData[symbol].min-1,stockData[symbol].max+1]} allowDecimals={false}/>
                                {/* <Tooltip/> */}
                            </LineChart>
                        //  </ResponsiveContainer>

                    )
                } else {
                    stockData[symbol].graph=(
                        // <ResponsiveContainer className = "responsive-container">
                            <LineChart width = {107} height = {45} data={stockData[symbol].data}>
                                <Line dot = {false} type="monotone" dataKey="price" stroke = "rgb(255, 80, 0)"/>
                                <XAxis dataKey="dateTime" angle={0} textAnchor="end" tick={{ fontSize: 13 }} />
                                <YAxis tick = {false} axisLine={false} tickline = {false} width = {10} domain={[stockData[symbol].min-1,stockData[symbol].max+1]} allowDecimals={false}/>
                                {/* <Tooltip/> */}
                            </LineChart>
                        //  </ResponsiveContainer>

                    )
                }

            }
        }
    },[watchlistStockData])




    return (
        <div id = "stockpage-outer-container">
            <div id = "stockpage-left-container">
                <div id = "stockpage-upper-container">
                    <div id = "stockpage-portfolio-value"><h1>$<Odometer value={portfolioValueDynamic ? Number(portfolioValueDynamic.toFixed(2)) : Number(portfolioValue.toFixed(2))} format="(,ddd).dd" /></h1></div>

                    <div id = "stockpage-graph-container">
                        <div id = "stockpage-graph">{renderLineChart}</div>
                        <div id = "stockpage-graph-timeframes-container">
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("5","1D")}} className = "dashboard-graph-timeframe-button">1D</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("30","1W")}} className = "dashboard-graph-timeframe-button">1W</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1M")}} className = "dashboard-graph-timeframe-button">1M</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","3M")}} className = "dashboard-graph-timeframe-button">3M</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("D","1Y")}} className = "dashboard-graph-timeframe-button">1Y</button></span>
                            <span className = "stockpage-graph-timeframe"><button onClick = {()=>{timeFrameClick("M","ALL")}} className = "dashboard-graph-timeframe-button">ALL</button></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stockpage
