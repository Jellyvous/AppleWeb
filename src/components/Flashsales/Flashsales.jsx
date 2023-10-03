import React from 'react'

import './Flashsales.css'
import CountdownTimer from '../CountdownTimer/CountdownTimer'
import './Flashsales'
import Menu from '../SalesMenu/SalesMenu'


const Flashsales = () => {
  return (
    <div className='flashsales-container'>
        <div className="header">
            <div className='square'></div>
            <div className="header-text">Hôm nay</div>
        </div>
        <div className="body">
            <div className="flashsales-countdown">
                <div className="flashsales-text">Flashsales</div>
                <div className="countdowntimer">
                    <CountdownTimer />
                </div>
                <div className="buttons-flashsales">
                    <button className="left-button"></button>
                    <button className="right-button"></button>
                </div>
            </div>
            <Menu/>
        </div>
        
    </div>
  )
}

export default Flashsales