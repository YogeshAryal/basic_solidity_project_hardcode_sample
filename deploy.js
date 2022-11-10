const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
async function main() {
  // RPC url imported from the ganache
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // private key required to access your wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  // In order to deploy our contract we need abi and binary code of contract
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  // object to deploy contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying Please wait!..");
  const contract = await contractFactory.deploy();
  const deploymentReceipt = await contract.deployTransaction.wait(1);
  console.log(`Contract Addres: ${contract.address}`);

  // Interacting with deployed contract using ethers js;
  const currentFavoriteNumber = await contract.retrieve();
  const transacFavoriteNoResponse = await contract.store(100);
  const transacReceipt = await transacFavoriteNoResponse.wait(1);
  const UpdatedFavoriteNo = await contract.retrieve();
  console.log(
    `Your current favorite number is: ${currentFavoriteNumber.toString()}`
  );
  console.log(
    `Your Updated favorite number is: ${UpdatedFavoriteNo.toString()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
