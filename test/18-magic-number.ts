import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`MagicNum`);
  const challengeAddress = await createChallenge(
    `0x200d3d9Ac7bFd556057224e7aEB4161fED5608D0`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  let abi = [{"inputs":[], "name":"whatIsTheMeaningOfLife" , "outputs":[{ "internalType": "uint256","name": "","type": "address"}], "type":"function", "stateMutability": "pure"}]

  // -- init code + runtime code + metadata
  // -- init code: set code size to be 0a before CODECOPY, as there are 10 opcodes used
  // -- runtime code:
  // PUSH1 0x2a // 60 2a // number 42
  // PUSH1 0x80 // 60 80 // first location of free memory
  // MSTORE     // 52    // storing 42 in memory
  // PUSH1 0x20 // 60 20 // size of uint256 return value
  // PUSH1 0x80 // 60 80 // location of answer in memory
  // RETURN     // f3    // return answer from memory

  let bytecode = "0x6080604052348015600f57600080fd5b50600a8061001e6000396000f3fe" + "602a60805260206080f3" + "fea26469706673582212207df7101e891215df9a443ec6909b6c867ed0ec7eea747b66ceed64e4d397ee2764736f6c63430006000033"

  const magicNumberFactory = await ethers.getContractFactory(abi,bytecode);
  let magicNumberContract = await magicNumberFactory.connect(eoa).deploy()
  
  console.log(await magicNumberContract.whatIsTheMeaningOfLife())

  await challenge.connect(eoa).setSolver(magicNumberContract.address)

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
