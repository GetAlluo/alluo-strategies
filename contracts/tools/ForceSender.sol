// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ForceSender {
    constructor() payable {
        this;
    }

    function forceSend(address payable to) external {
        selfdestruct(to);
    }
}
