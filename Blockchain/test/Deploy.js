const { ethers } = require("hardhat");

async function main() {
  const MicroLoan = await ethers.getContractFactory("MicroLoans");
  const microLoans = await MicroLoan.deploy();
  console.log("MicroLoan deployed to:", microLoans.target);
}
main()
.then(()=>console.log("Successful")).catch(err=>console.log("errr  ",  err))