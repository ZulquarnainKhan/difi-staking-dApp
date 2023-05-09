
import React, {Component} from 'react'
import './App.css'
import Navbar from './Navbar'
import Main from './Main.js'
import Web3 from 'web3'
import Tether from '../truffle-abis/Tether.json'
import RWD from '../truffle-abis/Reward.json'
import DecentralBank from '../truffle-abis/DecentralBank.json'
import ParticleSettings from './ParticleSettings.js'

class App extends Component {
    // Our React code goes in here
    
    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            // await window.ethereum.enable()
            await window.eth_requestAccounts
        }
        else if (window.web3) {
                window.web3 = new Web3(window.web3.currentProvider)
        }
        else{
            window.alert('No ethereum browser detected, Check out MetaMask! ')
        }
    }


    async loadBlockchainData(){
        const web3 = window.web3
        //  loading our account to our front end
        const account = await web3.eth.getAccounts()
        this.setState({ account: account[0] })
        // console.log(account)

        // Loading our nework id of ganache i.e 5777 to the frontend
        const networkId = await web3.eth.net.getId()
        // console.log(networkId)

        // ============== loading Tether Contract ================
        const tetherData = Tether.networks[networkId]
        if(tetherData){
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
            this.setState({ tether} )

            // We use methods to use the function inside the contracts 
            // and as we are using methods we need to use call function
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({ tetherBalance: tetherBalance.toString() })
            // console.log({balance: tetherBalance})
        }
        else{ 
            window.alert('Error: Tether contract not deployed to the detected network 5777')
        }

        // ============== loading Reward Contract ================
        const rwdData = RWD.networks[networkId]
        if(rwdData){
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
            this.setState({ rwd })

            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({ rwdBalance: rwdBalance.toString() })
            // console.log({balance: rwdBalance})
        }
        else{ 
            window.alert('Error: Reward contract not deployed to the detected network 5777')
        }

        // ============== loading DecentralBank Contract ================
        const decentralBankData = DecentralBank.networks[networkId]
        if(decentralBankData){
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
            this.setState({ decentralBank })

            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            this.setState({ stakingBalance: stakingBalance.toString() })
            // console.log({balance: stakingBalance})
        }
        else{ 
            window.alert('Error: DecentralBank contract not deployed to the detected network 5777')
        }

        this.setState({loading: false})

    }

    // Two functions: 
    // 1. that stakes tether tokens (DEPOSIT)
    // 2. that unstakes tether tokens (WITHDRAW) 
    // We are going to leverage the function that we have already made in our Decentral bank contract
    
// --------------- STAKING FUNCTION ------------------------
    // Access the decentralBank.depositeTokens(send transaction)
    // depositeTokens transferFrom ... 
    // function approve transaction hash ----- 
    stakedTokens = (amount) => {
        let ethAmount = Web3.utils.fromWei(amount, 'ether')
        this.setState({loading: true})
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) =>{
            this.state.decentralBank.methods.depositeTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) =>{
                this.setState({loading: false})
            })
        })
    }

// --------------- UNSTAKE TOKENS FUNCTION -----------------------
    unstakeTokens = () => {
        this.setState({loading: true})
        this.state.decentralBank.methods.unstakeToken().send({from: this.state.account}).on('transactionHash', (hash)=>{
            this.setState({loading: false})
        })

    }


    // We use constructor to make the program dynamic 
    constructor(props) {
        super(props)

        // Setting everything to zero or empty and atate setting them with loadBlockchainData() function
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }
    
    
    render(){
        // The user is only able to interact with the Main frontend when all the smart contracts are loaded to the server
        let content
        // Similiar to the ternary operator
        {this.state.loading ? 
            content = <p id='loader' className='text-center' style={{fontSize:'2rem' ,margin: '4rem',fontWeight: '600'}} >LOADING PLEASE... </p> 
            : content = <Main 
                        // sending our dynamic properties to main js
                        tetherBalance = {this.state.tetherBalance}
                        rwdBalance = {this.state.rwdBalance}
                        stakingBalance = {this.state.stakingBalance}
                        stakedTokens = {this.stakedTokens}
                        unstakedTokens = {this.unstakeTokens}
                    />
        }

        return(
            <div className='App' style={{position: 'relative'}}>
                <div style={{position: 'absolute'}}>
                    <ParticleSettings />
                </div>

                <Navbar account = {this.state.account} />

                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px',minHeight: '100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>                    
                </div>                
            </div>
        )
    }
}

// Exporting to our local server we use export default App
export default App;



