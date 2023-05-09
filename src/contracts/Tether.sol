pragma solidity >=0.5.0 <0.9.0;
// pragma solidity ^0.5.0 ;

contract Tether {
    string public name = 'Mock Tether';
    string public symbol = 'mUSDT';
    uint256 public totalSupply = 1000000000000000000000000;   // 1 million tokens as 24 zeroes after 1
    uint8 public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    mapping(address => uint) public balanceOf;
    mapping (address => mapping(address => uint)) public allowance; 

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool success){
        // require that the value is less than or eaual with the balance 
        require(balanceOf[msg.sender] >= _value);

        // transfer the amount and subtract the amount from the balance
        balanceOf[msg.sender] -= _value;
        // transfer the amount and add the amount to the balance
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;

    }

    function approve(address _spender, uint _value) public returns(bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;

        allowance[msg.sender][_from] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

}

