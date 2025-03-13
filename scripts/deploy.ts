const { ethers } = require("hardhat");

async function main() {
  const CodingChallenge = await ethers.getContractFactory("CodingChallenge");
  const codingChallenge = await CodingChallenge.deploy();
  await codingChallenge.waitForDeployment();

  console.log("CodingChallenge deployed to:", await codingChallenge.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });