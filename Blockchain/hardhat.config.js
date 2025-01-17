require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    holesky: {
    url: "https://1rpc.io/holesky",
    accounts: [`0xd2fe688cd49e4d3fb2b2c79087e61da266413ce1b0aca83c56966d7eb0f3ef84`],
  }}
};
