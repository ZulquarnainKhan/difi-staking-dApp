import React, {Component} from 'react'
import tether from '../tether_new.png'
import Airdrop from './Airdrop'



class Main extends Component {
    // Our React code goes in here
    render(){
        console.log(this.props.stakingBalance)
        console.log(this.props.tetherBalance)
        console.log(this.props.rwdBalance)
        return(
            <div id='content' className='' style={{borderRadius: '2rem', marginTop: '4rem', boxShadow: '0 0 15px rgba(0,0,0,0.3)'}}>
                <table className='table text-muted text-center content-body'>
                    <thead>
                        <tr style={{color: '#fff', fontSize: '1.4rem' }}>
                            <th scope='col'>Staking Balance</th>
                            <th scope='col'>Reward Balance</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr style={{color: 'black', }}>
                            <td style={{color: '#0ef'}}>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} <span style={{color: '#fff'}}>USDT</span></td>
                            <td style={{color: '#0ef'}}>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')} <span style={{color: '#fff'}}>RWD</span></td>
                        </tr>
                    </tbody>
                </table>

                <div className='card mb-2' style={{opacity: '1'}}>
                    <form className='mb-3' onSubmit={(event) => {
                       event.preventDefault()
                       let amount = this.input.value.toString();
                       amount = window.web3.utils.toWei(amount, 'Ether')
                       this.props.stakedTokens(amount);
                       
                   }}>
                        <div style={{borderSpacing: '0 1rem'}}>
                            <label className='float-left' style={{marginLeft: '1rem', marginTop: '1rem', fontWeight: '500'}}>
                                Stake Tokens 
                            </label>

                            <span className='float-right' style={{marginRight: '0.5rem',marginTop: '1rem', fontWeight: '500',color: 'black'}}>
                                Balance: <span style={{color: '#0ef', fontWeight: '600'}}>{window.web3.utils.fromWei(this.props.tetherBalance, 'Ether')}</span> USDT
                            </span>

                            <div className='input-group mb-4' style={{fontWeight: '300'}} >
                                <input type='text' ref={(input)=>{this.input = input}} placeholder='0' required style={{borderRadius: '5px', padding: '0px 5px', fontSize:'0.9rem',marginLeft: '10px',marginRight: '0px'}}/>

                                <div className='input-group-open'>
                                    <div className='input-group-text' style={{padding: '0 8px'}}>
                                        <img alt='Tether' src={tether} height='28'style={{margin: '0',color:'black'}}/>&nbsp;&nbsp;&nbsp;<span style={{fontSize: '0.8rem '}}>USDT</span>
                                    </div>
                                </div>
                            </div>

                            <button type='submit'  className='btn btn-primary btn-lg btn-block btn_ ' style={{margin:'0 auto',width: '70%', borderRadius: '10px', marginTop:'3rem'}} 
                      >DEPOSIT</button>
                        </div>
                    </form>
                    
                    <button type='submit' onClick={(event)=>{ 
                        event.preventDefault()
                        this.props.unstakedTokens()
                    }}
                        className='btn btn-primary btn-lg btn-block btn_' style={{margin:'0 auto',width: '70%', borderRadius: '10px',marginBottom: '0' }}>WITHDRAW</button>

                    <div className='card-body text-center' style={{color: '#0ef'}}>
                        AIR DROP <Airdrop stakingBalance = {this.props.stakingBalance}/> 
                    </div>
                </div>
                
            </div>
        )
    }
}

// Exporting to our local server we use export default App
export default Main;






