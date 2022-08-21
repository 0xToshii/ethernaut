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
  const challengeFactory = await ethers.getContractFactory(`CoinFlip`);
  const challengeAddress = await createChallenge(
    `0x4dF32584890A0026e56f7535d0f2C6486753624f`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
