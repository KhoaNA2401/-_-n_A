// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract certAdd {
    uint256 public certCount = 0;

    struct cert_details {
        uint256 id;
        string name;
        string studentid;
        string email;
        string course;
        string date;
        string college;
        string term;
    }

    mapping(address => cert_details) certificates;

    address owner;

    constructor() payable {
        owner = msg.sender;
    }

    modifier ownerOnly() {
        require(owner == msg.sender);
        _;
    }

    event certadded(
        string name,
        string studentid,
        string email,
        string course,
        string date,
        string college,
        string term
    );

    mapping(address => bool) managers;

    modifier ownerOrManger() {
        require(owner == msg.sender || managers[msg.sender], "Admin and Manager can do this action");
        _;
    }

    function addManager(address wallet, string memory name) public ownerOnly {
        managers[wallet] = true;
    }

    function removeManager(address wallet) public ownerOnly {
        if (owner == msg.sender) {
            managers[wallet] = false;
        } else {
             revert("You can't remove admin account !!!");
        }
    }

    function checkManager(address wallet) public view returns (bool) {
        return owner == wallet || managers[wallet];
    }

    function addCertificate(
        string memory name,
        string memory studentid,
        string memory email,
        string memory course,
        string memory date,
        string memory college,
        string memory term
    ) public ownerOrManger {
            certCount++;
            certificates[msg.sender] = cert_details(
                certCount,
                name,
                studentid,
                email,
                course,
                date,
                college,
                term
            );
            emit certadded(name, studentid, email, course, date, college, term);
    }
}
