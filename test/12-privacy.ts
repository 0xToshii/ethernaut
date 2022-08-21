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
  const challengeFactory = await ethers.getContractFactory(`Privacy`);
  const challengeAddress = await createChallenge(
    `0x11343d543778213221516D004ED82C45C3c8788B`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
