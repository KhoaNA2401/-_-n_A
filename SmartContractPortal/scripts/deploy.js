const main = async () => {
  const certContractFactory = await hre.ethers.getContractFactory("certAdd");
  const certContract = await certContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });

  await certContract.deployed();

  console.log("Certificates address: ", certContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();


