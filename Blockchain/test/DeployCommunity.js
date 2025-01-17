const hre=require('hardhat');
async function main(){
  // const [deployer]=await hre.ethers.getSigners();
  console.log("Starting")
  const Community=await hre.ethers.getContractFactory("Community");
  const community=await Community.deploy(['0xe0AE955311088A18BeB7c52e5844d3aF5B90d804', 1]);
  const CommunityFactory=await hre.ethers.getContractFactory("CommunityFactory")
  console.log("deploying")
  const communityFactory=await CommunityFactory.deploy(community.target)
  
  console.log("wait deploying")
  console.log("CommunityContract deployed to ~ ", communityFactory.target);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  // 0x0D74447715706aeFe39F99C16B0d90c811F551bA