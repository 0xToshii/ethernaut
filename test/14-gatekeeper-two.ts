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
  const challengeFactory = await ethers.getContractFactory(`GatekeeperTwo`);
  const challengeAddress = await createChallenge(
    `0xdCeA38B2ce1768E1F409B6C65344E81F16bEc38d`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

   // used to generate gateKey - kept b/c contract nonce, else solution won't hold for challenge
  const otherFactory = await ethers.getContractFactory('GatekeeperTwo')
  let other = await otherFactory.connect(eoa).deploy()

  const attackerFactory = await ethers.getContractFactory('GatekeeperTwoAttacker')
  let attacker = await attackerFactory.connect(eoa).deploy("0xA3BB6E3FF7113499",challenge.address) 

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
