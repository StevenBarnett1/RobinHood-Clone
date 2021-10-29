import "./Splash.css"
import { NavLink } from "react-router-dom"
import {SiGithub} from "react-icons/si"
import {AiFillLinkedin} from "react-icons/ai"
const SplashPage = () => {
    return (
        <div id = "splash-outer-container">
        <div id = "splash-top-container">
            <div id = "splash-top-inner-container">
            <div id = "splash-top-left">
                <div className = "splash-top-left-title">Investing for Everyone</div>
                <div className = "splash-top-left-text">Commission-free investing, plus the tools you need to put your money in motion. Sign up and get your first stock for free. Certain limitations apply.</div>
                <NavLink className = "splash-top-left-navlink" to = "/sign-up">Sign Up</NavLink>

            </div>
            <div id = "splash-top-right">
                <img id="splash-video-outer-image" draggable = "false" src="https://cdn.robinhood.com/assets/robinhood/brand/_next/static/images/2x__ff9c36e27d7018cf707b95d8675793a3.png"></img>
                <video id = "splash-video" autoPlay controlsList="nodownload nofullscreen noremoteplayback" loop muted playsInline preload="auto" className="splash-video">
                    <source src="https://cdn.robinhood.com/assets/robinhood/brand/_next/static/images/3x__327bf4cc768a323497d5aaa7416319c2.mp4" type="video/mp4"></source>
                    <img id = "splash-video-inner-image" draggable = "false" role = "presentation" src="https://cdn.robinhood.com/assets/robinhood/brand/_next/static/images/1x__36a396f664677ed80a2459d1dca75f00.png" srcSet="https://cdn.robinhood.com/assets/robinhood/brand/_next/static/images/1x__36a396f664677ed80a2459d1dca75f00.png, https://cdn.robinhood.com/assets/robinhood/brand/_next/static/images/2x__c7dcadbbb72fc298e85e94844f68342c.png 2x, https://cdn.robinhood.com/assets/robinhood/brand/_next/static/images/3x__7c5da6ba049983f3558423906f16f0af.png 3x"></img>
                </video>
            </div>
            </div>
        </div>
        <div id = "splash-center-container">
            <div id = "splash-center-inner-container">
                <div id = "splash-center-left">
                    <img src = "https://robinhood.com/us/en/_next/static/images/balloon__ef7d8a9bb1c7845fcb7a6799c35d513e.svg"></img>
                </div>
                <div id = "splash-center-right">
                    <div className = "splash-center-right-heading">
                        <div className = "splash-center-right-heading-title">Introducing IPO Access</div>
                        <div className = "splash-center-right-heading-text">Get in at the IPO price. Now, you can become one of the first public investors in upcoming IPOs.</div>
                    </div>

                    <div className = "center-right-outer">
                        <div className = "center-right-icon">
                            <img src= "https://robinhood.com/us/en/_next/static/images/comeall__c29b103566f44e51d624989e65ecf3be.svg"></img>
                        </div>
                        <div className = "center-right-text-outer">
                            <div className = "center-right-subheading">It's your turn</div>
                            <div className = "center-right-text">No minimum account balances or special status requirements.</div>
                        </div>
                    </div>
                    <div className = "center-right-outer">
                    <div className = "center-right-icon">
                        <img src = "https://robinhood.com/us/en/_next/static/images/one-first__d86b9ee63a8475364159f2d21ea5f01f.svg"></img>
                    </div>
                        <div className = "center-right-text-outer">
                            <div className = "center-right-subheading">Be one of the first</div>
                            <div className = "center-right-text">Request shares in new companies before their stock starts trading on public exchanges.</div>
                        </div>
                    </div>
                    <div className = "center-right-outer">
                    <div className = "center-right-icon">
                        <img src = "https://robinhood.com/us/en/_next/static/images/fair-shot__fb09db580d0ada2e8626a6e46094bb27.svg"></img>
                    </div>
                        <div className = "center-right-text-outer">
                            <div className = "center-right-subheading">Get a fair shot</div>
                            <div className = "center-right-text">While IPO shares are limited, IPO Access gives you the same opportunity to invest, regardless of order size or account value.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id = "splash-bottom-container">
            <div id = "splash-bottom-inner-container">
                <div id = "splash-bottom-left">
                    <div id = "splash-bottom-top">
                        <div id = "splash-bottom-heading">Introducing Fractional Shares</div>
                        <div id = "splash-bottom-heading-text">Invest in thousands of stocks with as little as $1.</div>
                    </div>
                    <div id = "splash-bottom-bottom">
                        <div className = "bottom-bottom-container">
                            <div className = "bottom-subheading">Invest Any Amount</div>
                            <div className = "bottom-text">Choose how much you want to invest, and we’ll convert from dollars to parts of a whole share.</div>
                        </div>
                        <div className = "bottom-bottom-container">
                            <div className = "bottom-subheading">Build a Balanced Portfolio</div>
                            <div className = "bottom-text">Customize your portfolio with pieces of different companies and funds to help reduce risk.</div>
                        </div>
                        <div className = "bottom-bottom-container">
                            <div className = "bottom-subheading">Trade in Real Time</div>
                            <div className = "bottom-text">Trades placed during market hours are executed at that time, so you’ll always know the share price.</div>
                        </div>
                    </div>
                </div>
                <div id = "splash-bottom-right">
                    <img src = "https://robinhood.com/us/en/_next/static/images/2x__50ed5a2a8854d545e03d193192de26de.png"></img>
                </div>
            </div>
        </div>
        <div id = "footer">
            <NavLink style = {{marginLeft:"200px"}}to = {{pathname:"https://github.com/StevenBarnett1"}} target="_blank"><SiGithub fill = {"black"} style = {{fontSize:"45px"}}/></NavLink>
            <div style = {{fontSize:"33px",fontWeight:"bold"}}>Steven Barnett</div>
            <NavLink to = {{pathname:"https://www.linkedin.com/in/steven-r-barnett/"}} target="_blank"><AiFillLinkedin fill = {"black"} style = {{fontSize:"45px"}}/></NavLink>
        </div>
        </div>
    )
}

export default SplashPage
