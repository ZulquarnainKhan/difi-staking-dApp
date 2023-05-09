import React, {Component} from 'react'
import bank from '../bank image.png'


class Navbar extends Component {
    // Our React code goes in here
    render(){
        return(
            <nav className='navbar navbar-dark fixed-top shadow p-0' style={{background: '#1f242d', height: '50px', fontWeight: '500'}}>
                <a className='navbar-brand col-sm-3 col-md-2 mr-0'  style={{color: 'white'}}>
                    <img src={bank} width='45' height='40' alt='Logo.' style={{marginRight: '15px'}}></img>
                    DAPP Yeild Stacking <span>(Decentralised Banking)</span></a>
                <ul className='navbar-nav px-3 '>
                    <li className='text-nowrap d-none nav-item d-sm-none d-sm-block'>
                        <small  style={{color: 'white', fontWeight: '600'}}>
                            ACCOUNT NUMBER: <span style={{color: '#0ef', fontWeight: '400'}}> {this.props.account} </span>
                        </small>
                    </li>
                </ul>

            </nav>
        )
    }
}

// Exporting to our local server we use export default App
export default Navbar;