import { ethers } from "hardhat";
import { expect } from "chai";

describe("MyToken", function () {
  it("Should deploy and mint tokens", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseUnits("1000000", 18));
  });
});
