import React, { useState, useEffect } from 'react';
import './index.css';
import Web3 from 'web3';
import {useHistory} from 'react-router-dom';
import detectEthereumProvider from '@metamask/detect-provider';
import { controlPot } from '../../contractConstant';
import jsonData from '../../contractConstant.json';
import DateTimeDisplay from './DateTimeDisplay'
import Countdown from 'react-countdown';
import BigNumber from "bignumber.js";
import moment from 'moment';
import axios from "axios";
// import { FetchWrapper } from "use-nft"
const Home = (props) => {
    const history = useHistory();
    const [web3,setWeb3]=useState('')
    const [web3Instance, setWeb3Instance] = useState('');
    const [currentAddress, setCurrentAddress] = useState(0);
    const [potControlContract, setPotControlContract] = useState([]);
    const [potContract, setPotContract] = useState([]);
    const [counterTimer, setCounterTimer] = useState(0);
    const [bidResults, setBidResults] = useState([]);

    const Completionist = () => <span>Bid close!</span>;

    const [potContractData, setPotContractData] = useState({
        "contract": []
    });
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <Completionist />;
        } else {
            return <h3 className='font-bold'>{hours}:{minutes >= 10 ? minutes: `0${minutes}`}:{seconds >= 10 ? seconds: `0${seconds}`}</h3>;
        }
    };
    const [lengthOfPot, setLengthOfPot] = useState([]);
    const [potAddress, setPotAddress] = useState([]);

    const connectMetamask = async () => {
        try {
          let currentProvider = await detectEthereumProvider();
          if (currentProvider) {
            let web3InstanceCopy = new Web3(currentProvider);
            setWeb3Instance(web3InstanceCopy);
            if (!window.ethereum.selectedAddress) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            }
            await window.ethereum.enable();
            let currentAddress = window.ethereum.selectedAddress;
            const currentChainId = await window.web3.eth.net.getId()
            if (currentChainId !== 80001) {
              try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Web3.utils.toHex(80001) }],
                });
                setCurrentAddress(currentAddress);
            } catch (switchError) {
                if (switchError.code === 4902) {
                    alert('add this chain id')
                }
            }
            } else {
                setCurrentAddress(currentAddress);
            }
          }
        } catch (err) {
          alert(err.message)
        }
    }

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            // console.log(window.web3);       
        }
    }

    const disconnect = async () => {
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [
                {
                    eth_accounts: { currentAddress }
                }
            ]
        });
    }

    const loadContract = async () => {
        const ABI = controlPot.ABI;
        const contractAddress = controlPot.contractAddress;
        return await new window.web3.eth.Contract(ABI, contractAddress);
    }    
    const getMetaData = async (hashVal) => {
        try {
            let responseData = await axios.get(hashVal).then((response) => {
                return response.data;
            });
    
            return responseData;
        } catch (error) {
            console.error(error);
            return "";
        }
    }
    const loadContract2 = async (tempArray) => {  
        let contractData = {
            "contract": []
        };                      
        let tempPotABI = jsonData.contractABI;
        let myData = [];
        tempArray.map(async (item, key) => {
            console.log('item', item);
            let tempPot = await new window.web3.eth.Contract(tempPotABI, item);                     
            let ERC721Address = await tempPot.methods.CERC721AddRess().call();      
            let _erc721contract = await new window.web3.eth.Contract(jsonData.ERC721ABI, ERC721Address);
            const record = {};
            let lastBidWinner = await tempPot.methods.lastBidWinner().call();
            let bidAmount = await tempPot.methods.bidAmount().call();
            let lifeTime = await tempPot.methods.getLifeTime().call();            
            let isClaim = await tempPot.methods.isClaim().call();             
            let timeUntilExpiry = await tempPot.methods.timeUntilExpiry().call();             
            let createdDate = await tempPot.methods.createdDate().call();             
            let claimedDate = await tempPot.methods.claimedDate().call();
            let isNative = await tempPot.methods.isNative().call();
            let potToken = await tempPot.methods.bidToken().call();
            let tokenID = await tempPot.methods.tokenID().call();
            const tokenUri = await _erc721contract.methods.tokenURI(tokenID).call();

            let BidInfo = {
                "bid": []
            };   

            myData.key = [];
            let bidderAddresses = await tempPot.methods.getBiddersInfo().call();
            const __bidInfo = bidderAddresses.map(async (item) => {
                    const tempBidAmount = await tempPot.methods.bidders(item).call();                
                    const tempBid = {
                        "address":  item,
                        "bidAmount": tempBidAmount
                    }

                    return tempBid;
                })
            const _bidInfo = await Promise.all(__bidInfo)
            BidInfo = { bid: _bidInfo.sort((a, b) => a.bidAmount < b.bidAmount ? 1 : -1) }
            setBidResults(_bidInfo.sort((a, b) => a.bidAmount < b.bidAmount ? 1 : -1))
            console.log(_bidInfo)
            
            let symbol;
            let decimals;
            if(isNative == true) {
                symbol = "MATIC";
                decimals = 18;
            } else {                
                let _erc20Contract = await new window.web3.eth.Contract(jsonData.ERC20ABI, potToken);
                symbol = await _erc20Contract.methods.symbol().call();
                decimals = await _erc20Contract.methods.decimals().call();
            }
            const newItem = {
                "potToken": potToken,
                "contractAddress": item,
                "lastBidWinner": lastBidWinner,
                "bidAmount": Number(bidAmount),
                "lifeTime": lifeTime,
                "isClaim": isClaim,
                "timeUntilExpiry": timeUntilExpiry,
                "createdDate": createdDate,
                "claimedDate": claimedDate,
                "symbol": symbol,
                "isNative": isNative,
                "decimals": decimals,
                "image": tokenUri,
                "bidResult": _bidInfo
            }
            setCounterTimer(lifeTime);  
            contractData = { "contract" : contractData['contract'] ? [...contractData['contract'], newItem] : [newItem] }     
            setPotContractData(contractData);
        })
        setPotContract(tempArray);
    }

    useEffect(() => {
        let _contract;
        let _contract2; 
        const effect = async () => {
            await loadWeb3();          
            _contract = await loadContract();
            await setPotControlContract(_contract);
            let temp = await _contract.methods.allTournamentsLength().call();
            let tempArray = [];
            for (let i = 0; i < temp; i++) {
                let tempAddress = await _contract.methods.allTournaments(i).call();
                tempArray.push(tempAddress);
            }
            await setPotAddress(tempArray);
            loadContract2(tempArray);
        }
        effect();      
    }, []);

    const createPage = () => {
        history.push('/create');
    }

    const ShowCounter = ({ days, hours, minutes, seconds }) => {
        return (
          <div className="show-counter">
            <a
              href="https://tapasadhikary.com"
              target="_blank"
              rel="noopener noreferrer"
              className="countdown-link"
            >
              <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
              <p>:</p>
              <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
              <p>:</p>
              <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
              <p>:</p>
              <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
            </a>
          </div>
        );
    };

    const bid = async (contractAddress, bidAmount, potToken, isNative) => {
        let potContractABI = jsonData.contractABI;
        let potContract = await new window.web3.eth.Contract(potContractABI, contractAddress);
        const record = {};
        if(currentAddress != 0) {
            if(isNative == true) {
                let lastBidWinner = await potContract.methods.bid()
                .send({
                    from: currentAddress,
                    value: BigNumber(bidAmount)
                }, function(error, tokens){
                    console.log(tokens); 
                });
            } else {
                let _erc20Contract = await new window.web3.eth.Contract(jsonData.ERC20ABI, potToken);
                await _erc20Contract.methods.approve(contractAddress, BigNumber(Number(bidAmount)).toFixed().toString()).send({ from: currentAddress });
                let lastBidWinner = await potContract.methods.bidERC20()
                .send({
                    from: currentAddress
                }, function(error, tokens){
                    console.log(tokens); 
                });
            }
        } else {
            alert("please connect metamask!");
        }
    }
    const claim = async (contractAddress) => {
        let potContractABI = jsonData.contractABI;
        let potContract = await new window.web3.eth.Contract(potContractABI, contractAddress);
        const record = {};
        if(currentAddress != 0) {
            let lastBidWinner = await potContract.methods.claim()
            .send({               
                from: currentAddress
            }, function(error, tokens){
                console.log(tokens); 
            });
        } else {
            alert("please connect metamask!");
        }
    }

    return (
        <div className='p-4'>
            <div>
                <div className='d-flex justify-content-between'>
                    <div><p>Active tournaments</p></div> 
                    <div className='d-flex'>
                        <div className='btn btn-primary' onClick={createPage}>Create Tournament</div><div className='ml-3'></div>
                        {currentAddress == "" && (<div className='btn btn-warning ml-3' onClick={connectMetamask}>Connect</div>)}
                        {currentAddress != "" && (<div className='btn btn-warning ml-3' onClick={disconnect}>{currentAddress}</div>)}
                    </div>
                </div>
                <div className='d-flex flex-wrap justify-content-center'>

                        {potContractData['contract'].map((item, key) => {
                            if(item.lifeTime != 0 && item.isClaim == false) {
                                return (                                
                                    <div className='item' key={key}>
                                        <div className='p-3 text-center'>
                                            <p className='font-bold' style={{fontSize:8}}>{item.contractAddress}</p>
                                            <img src={item.image} className="nft-img" />
                                            <p className='mb-0'>Win</p>
                                            <h4 className='font-bold'>{String(item.bidAmount/(10**item.decimals)).substr(0,8)} {item.symbol}</h4>
                                            <p>by bidding</p>
                                            {item.bidResult != undefined &&  item.bidResult.map((items) => {
                                                return (<p className='mb-0'>{items.address.substr(0,7)+'....'+items.address.substr(-5,7)}: {String(Number(items.bidAmount)/(10**item.decimals)).substr(0,8)} {item.symbol}</p>)
                                            })}
                                            <Countdown
                                                date={Date.now() + Number(item.lifeTime * 1000)}
                                                renderer={renderer}
                                            />
                                            <div className='btn btn-black mt-50' onClick={() => bid(item.contractAddress, item.bidAmount, item.potToken, item.isNative)}>Bid</div>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                </div>
            </div>
            <div className='pt-5'>
                <div><p>Expired tournaments</p></div>
                <div><p>Only last winner can claim.</p></div>
                <div className='d-flex flex-wrap justify-content-center'>
                    {potContractData['contract'].map((item, key) => {
                        let times = Number(item.timeUntilExpiry)+Number(600);
                        if(item.lifeTime == 0 && item.isClaim == false && Date.now()/1000 < times) {
                            return ( 
                                <div className='item' key={key}>
                                    <div className='p-3 text-center'>
                                        <img src={item.image} className="nft-img" />
                                        <p className='mb-1'>{item.lastBidWinner.substr(0,7)+'....'+item.lastBidWinner.substr(-7,7)} has won</p>
                                        <h4 className='font-bold'>{String(item.bidAmount/(10**item.decimals)).substr(0,8)} {item.symbol}</h4>
                                        <p className='pt-5'>You can claim your rewards until</p>
                                        <h5 className='font-bold'>{moment.unix(Number(item.timeUntilExpiry)+Number(600)).format("YYYY-MM-DD HH:mm:ss")}</h5>
                                        <p className='font-bold' style={{fontSize:8}}>{item.contractAddress}</p>
                                        {item.bidResult != undefined &&  item.bidResult.map((items) => {
                                            return (<p className='mb-0'>{items.address.substr(0,7)+'....'+items.address.substr(-5,7)}: {String(items.bidAmount/(10**item.decimals)).substr(0,8)} {item.symbol}</p>)
                                        })}
                                        <div className='btn btn-black mt-48' onClick={() => claim(item.contractAddress)}>Claim</div>
                                    </div>
                                </div>      
                            )
                        }
                    })}
                </div>
            </div>
            <div className='pt-5'>
                <div><p>Creator can claim.</p></div>
                <div className='d-flex flex-wrap justify-content-center'>
                    {potContractData['contract'].map((item, key) => {
                        if(item.lifeTime == 0 && item.isClaim == false && Date.now()/1000 < (Number(item.timeUntilExpiry)+Number(800)) && Date.now()/1000 > (Number(item.timeUntilExpiry)+Number(600))) {
                            return ( 
                                <div className='item' key={key}>
                                    <div className='p-3 text-center'>
                                        <img src={item.image} className="nft-img" />
                                        <p className='mb-1'>{item.lastBidWinner.substr(0,7)+'....'+item.lastBidWinner.substr(-7,7)} has won</p>
                                        <h4 className='font-bold'>{String(item.bidAmount/(10**item.decimals)).substr(0,8)} {item.symbol}</h4>
                                        <p className='pt-1'>You can claim your rewards until</p>
                                        <h5 className='font-bold'>{moment.unix(Number(item.timeUntilExpiry)+Number(800)).format("YYYY-MM-DD HH:mm:ss")}</h5>
                                        <p className='font-bold' style={{fontSize:8}}>{item.contractAddress}</p>
                                        <div className='btn btn-black mt-48' onClick={() => claim(item.contractAddress)}>Claim</div>
                                        {item.bidResult != undefined &&  item.bidResult.map((items) => {
                                            return (<p className='mb-0'>{items.address.substr(0,7)+'....'+items.address.substr(-5,7)}: {String(items.bidAmount/(10**item.decimals)).substr(0,8)} {item.symbol}</p>)
                                        })}
                                    </div>
                                </div>      
                            )
                        }
                    })}
                </div>
            </div>
            <div className='pt-5'>
                <div><p>Only Top Owner can claim.</p></div>
                <div className='d-flex flex-wrap justify-content-center'>
                    {potContractData['contract'].map((item, key) => {
                        if(item.lifeTime == 0 && item.isClaim == false && Date.now()/1000 > (Number(item.timeUntilExpiry)+Number(800))) {
                            return ( 
                                <div className='item' key={key}>
                                    <div className='p-3 text-center'>
                                        <img src={item.image} className="nft-img" />
                                        <p className='mb-1'>{item.lastBidWinner.substr(0,7)+'....'+item.lastBidWinner.substr(-7,7)} has won</p>
                                        <h4 className='font-bold'>{String(item.bidAmount/(10**item.decimals)).substr(0,8)} {item.symbol}</h4>
                                        <p className='pt-1'>You can claim your rewards until</p>
                                        <h5 className='font-bold'>{moment.unix(Number(item.timeUntilExpiry)+Number(600)).format("YYYY-MM-DD HH:mm:ss")}</h5>
                                        <p className='font-bold' style={{fontSize:8}}>{item.contractAddress}</p>
                                        <div className='btn btn-black mt-48' onClick={() => claim(item.contractAddress)}>Claim</div>
                                        {item.bidResult != undefined &&  item.bidResult.map((items) => {
                                            return (<p className='mb-0'>{items.address.substr(0,7)+'....'+items.address.substr(-5,7)}: {String(items.bidAmount/(10**item.decimals)).substr(0,8)} {item.symbol}</p>)
                                        })}
                                    </div>
                                </div>      
                            )
                        }
                    })}
                </div>
            </div>
            <div className='pt-5'>
                <div><p>Closed tournaments</p></div>
                <div className='d-flex flex-wrap justify-content-center'>
                    {potContractData['contract'].map((item, key) => {
                        if(item.lifeTime == 0 && item.isClaim == true) {
                            return ( 
                                <div className='item'>
                                    <div className='p-3 text-center'>
                                        <img src={item.image} className="nft-img" />
                                        <p className='mb-0'>{item.lastBidWinner.substr(0,7)+'....'+item.lastBidWinner.substr(-7,7)} has won</p>
                                        <h4 className='font-bold'>{String(item.bidAmount/(10**item.decimals)).substr(0,8)} {item.symbol}</h4>
                                        <p className='pt-5 mb-0'>on</p>
                                        <h5 className='font-bold'>{moment.unix(Number(item.createdDate)).format("YYYY-MM-DD HH:mm:ss")}</h5>
                                        <p className='mb-0'>and claimed their rewards</p>
                                        <h5 className='font-bold'>{moment.unix(Number(item.claimedDate)).format("YYYY-MM-DD HH:mm:ss")}</h5>
                                    </div>
                                </div>    
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}

export default Home;
