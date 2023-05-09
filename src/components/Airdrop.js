import React, {Component} from 'react'
import Web3 from 'web3'


class Airdrop extends Component {
    // Airdrop must have a timer that counts down
    // initialisation the countdown after our customer have staked a certain amount...50 tokens
    // timer functionality, countdown , startTimer, state - For time to work

    constructor() {
        super()
        this.state = {time: {}, seconds: 20 };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    startTimer(){
        if(this.timer == 0 && this.state.seconds > 0 ){
            this.timer = setInterval(this.countDown, 1000)
        }
    }

    countDown() {
        // 1. Countdown 1 sec at a time
        let seconds = this.state.seconds - 1

        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        })

        // 2. Stop counting when we hit zero
        if(seconds == 0){
            clearInterval(this.timer)
        }
    }

    secondsToTime(secs) {
        let hours, minutes, seconds;
        hours = Math.floor(secs/(60*60));
        let divisor_for_minutes = secs % (60*60)
        minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = secs % (60*60*60)
        seconds = Math.ceil(divisor_for_seconds );

        let obj = {
            'h': hours,
            'm': minutes,
            's': seconds
        }

        return obj;
    }

    componentDidMount(){
        let timeLeftVar = this.secondsToTime(this.state.seconds)
        this.setState({time: timeLeftVar})
        this.airDropReleaseTokens();
    }

    airDropReleaseTokens(){
        let stakingB = this.props.stakingBalance
        if(stakingB >= Web3.utils.fromWei('50000000000000000000','Ether')){
            this.startTimer()
            
        }
    }

    render(){
        return(
            <div style={{color: 'black',fontWeight: '500'}}> {this.state.time.m}:{this.state.time.s}
            </div>    
        )
    }
}

// Exporting to our local server we use export default App
export default Airdrop;