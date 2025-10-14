// Lógica para interactuar con el smart contract FaucetToken
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

const ABI = [
  // claimTokens, hasAddressClaimed, getFaucetUsers, getFaucetAmount, balanceOf
  "function claimTokens() public",
  "function hasAddressClaimed(address) public view returns (bool)",
  "function getFaucetUsers() public view returns (address[] memory)",
  "function getFaucetAmount() public view returns (uint256)",
  "function balanceOf(address) public view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

export const claimTokensService = async (address: string) => {
  // Solo ejecuta si no reclamó antes
  const hasClaimed = await contract.hasAddressClaimed(address);
  if (hasClaimed) return { success: false, message: 'Ya reclamaste tokens' };
  const tx = await contract.claimTokens();
  return { success: true, txHash: tx.hash };
};

export const getFaucetStatusService = async (address: string) => {
  const hasClaimed = await contract.hasAddressClaimed(address);
  const balance = await contract.balanceOf(address);
  const users = await contract.getFaucetUsers();
  return { hasClaimed, balance: balance.toString(), users };
};
