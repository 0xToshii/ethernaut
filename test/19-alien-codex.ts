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
  const challengeFactory = await ethers.getContractFactory(`AlienCodex`);
  const challengeAddress = await createChallenge(
    `0xda5b3Fb76C78b6EdEE6BE8F11a1c31EcfB02b272`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
