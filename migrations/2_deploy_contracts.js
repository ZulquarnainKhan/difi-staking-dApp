var Tether = artifacts.require('Tether');
// var Migrations = artifacts.require('Migrations');
var Reward = artifacts.require('Reward');
var DecentralBank = artifacts.require('DecentralBank');


module.exports = async function (deployer, network, accounts) {
    // Deploy mock Tether contract
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();
    // Deploy Reward contract
    await deployer.deploy(Reward);
    const rwd = await Reward.deployed();

    // Deploy Decentral Bank contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const decentralBank = await DecentralBank.deployed();


    // Transfer all reward tokens to Decentralised Bank
    await rwd.transfer(decentralBank.address , '1000000000000000000000000');


    // Transfering 100 Tether to every investor account 
    await tether.transfer(accounts[1], '100000000000000000000');

};







