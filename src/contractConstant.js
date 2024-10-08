export const controlPot = {
  ABI: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "addToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_NFTERC721",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenID",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_bidTokenIndex",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_isNative",
          "type": "bool"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "bidOption",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "variable1",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "variable2",
              "type": "uint256"
            }
          ],
          "internalType": "struct ControlPot.bidPrice",
          "name": "_bid",
          "type": "tuple"
        },
        {
          "internalType": "address[]",
          "name": "_toAddress",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_toPercent",
          "type": "uint256[]"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "expiryOption",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "decreaseBy",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minimumTime",
              "type": "uint256"
            }
          ],
          "internalType": "struct ControlPot.expiryTimeInfoVal",
          "name": "_expirationTime",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "_hardExpiry",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_priorityPool",
          "type": "bool"
        },
        {
          "internalType": "uint256[]",
          "name": "_creatorAndPreviousFee",
          "type": "uint256[]"
        }
      ],
      "name": "createPot",
      "outputs": [
        {
          "internalType": "address",
          "name": "pair",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "removeToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "Deployed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "Received",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newToOwnerFee",
          "type": "uint256"
        }
      ],
      "name": "setToOwnerFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newTopOwner",
          "type": "address"
        }
      ],
      "name": "setTopOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allTournaments",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "allTournamentsLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "bidDistributionAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTokenList",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "percent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tokenList",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "toOwnerFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "topOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  contractAddress: "0xeBe24723b38a23689d60784563525548ac6f2999"  
}