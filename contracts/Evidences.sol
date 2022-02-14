pragma solidity ^0.5.0;
contract Evidences{
    uint public ecount=0;

    struct Evid{
        uint caseno;
        uint id;
        string data;
        string ownername;
    }
    mapping(uint => Evid)public evidarray;

    function createEvidence(uint _caseno,uint _id,string memory _data,string memory _ownername)public{
        ecount++;
        evidarray[ecount]=Evid(_caseno, _id, _data, _ownername);

    }


}