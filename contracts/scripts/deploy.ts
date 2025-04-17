import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting deployment...");

  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy();

  console.log("⏳ Waiting for deployment confirmation...");
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("✅ Token deployed to:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
