pragma solidity >=0.5.0 <0.9.0;
// pragma solidity ^0.5.0 ;

import './Reward.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    Reward public reward;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    // mapping(address => bool) public hasIssued;

    constructor(Reward _reward, Tether _tether) public{
        reward = _reward;
        tether = _tether;
        owner = msg.sender;
    }

    // ============== Staking Tether tokens =================== 
    function depositeTokens(uint _amount) public {

        require(_amount > 0,"Amount cannot be zero. ");

        // Transfer our Tether tokens to this contract address for stacking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update Staking Balance
        stakingBalance[msg.sender] += _amount;
        // stakingBalance[address(this)] += _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // Update Staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }


    // ================== Unstake Tether tokens ===================
    function unstakeToken() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0,'You Wallet donot have Balance in bank ');

        // transfer the tokens to the specified customer from our bank
        tether.transfer( msg.sender, balance);

        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }



    // ================== Issue reward tokens =====================
    function issueToken() public {
        // require the owner to issue tokens only
        require(msg.sender == owner, 'The caller must be the owner');

        for(uint i=0; i < stakers.length; i++){
            address recipient = stakers[i];
            // require(!hasIssued[recipient]);
            uint balance = stakingBalance[recipient];

            if(balance > 0){
                reward.transfer(recipient, (balance/9));
            }
        }
    }

    

}






