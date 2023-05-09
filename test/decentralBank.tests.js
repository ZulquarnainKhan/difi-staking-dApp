var Tether = artifacts.require('Tether');
var Reward = artifacts.require('Reward');
var DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

// contract('DecentralBank', (accounts) => {
contract('DecentralBank', ([owner, customer]) => {
    // here owner is accounts[0] and customer is accounts[1]
    // ========== All the codes for testing goes here: ===========

    let tether, rwd, decentralBank;

    // This token function converts ether to wei by adding 18 zeroes after num
    function tokens(number){
        return web3.utils.toWei(number, 'ether');
    }

    before(async () => {
        // Load contracts and adding before will run it before testing anything
        tether = await Tether.new();
        rwd = await Reward.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        // Transfer all rwd token to DecentralBank (1 million)
        await rwd.transfer(decentralBank.address, tokens('1000000'));    // using token function

        // Transfer 100 mock Tether to investor/customer account
        await tether.transfer(customer, tokens('100'), {from: owner})

    });

    describe('Mock Tether Deployement ', async () => {
        it('matches name successfully ', async () => {
            
            const name = await tether.name();
            assert.equal(name, 'Mock Tether')
        });
    });

    describe('RWD Deployement ', async () => {
        it('matches name successfully ', async () => {
            const name = await rwd.name();
            assert.equal(name, 'Reward Token')
        });
    });

    describe('Decentral Bank Deployement ', async () => {
        it('matches name successfully ', async () => {
            const name = await decentralBank.name();
            assert.equal(name, 'Decentral Bank')
        });

        it('Contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance, tokens('1000000'));
        });

        describe('Yeild Farming ', async () => {
            it('Rewards tokens for staking ', async () => {
                // Checking investor balance
                let result = await tether.balanceOf(customer);
                assert.equal(result.toString(), tokens('100'),'Customer mock Tether balance before staking');
             
                // Check staking for customer of 100 tokens simulation
                await tether.approve(decentralBank.address, tokens('100'), {from: customer});
                await decentralBank.depositeTokens(tokens('100'), {from: customer});

                result = await tether.balanceOf(customer);
                assert.equal(result.toString(), tokens('0'),'Customer mock Tether balance aftre staking');

                // Check updated balance of decentral bank
                result = await tether.balanceOf(decentralBank.address);
                assert.equal(result.toString(), tokens('100'), 'Bank balance after stacking');

                // Checking staked balance of customer in decentral bank
                result = await decentralBank.stakingBalance(customer);
                assert.equal(result.toString(), tokens('100'), 'Customer stake after stacking in bank');

                // Is staking Balance
                result =  await decentralBank.isStaking(customer);
                assert.equal(result.toString(), 'true', 'customer staking status is true ');

                // Issuing reward tokens
                await decentralBank.issueToken({from: owner});

                // Ensure only the owner can issue tokens
                await decentralBank.issueToken({from: customer}).should.be.rejected;

                // unstake Tether tokens
                await decentralBank.unstakeToken({from: customer});

                // Check Unstaking balances 
                result = await tether.balanceOf(customer);
                assert.equal(result.toString(),tokens('100'), 'Customer wallet tether balance is 100 ');

                // Check Updated balance of Decentral Bank 
                result = await tether.balanceOf(decentralBank.address);
                assert.equal(result.toString(),tokens('0'), 'Decentral Bank wallet tether balance is 0 ');

                // Check Staking updates of customer
                result = await decentralBank.isStaking(customer);
                assert.equal(result.toString(), 'false', 'Customer wallet tether balance is 100 ');

            });
        });
    });

}); 



