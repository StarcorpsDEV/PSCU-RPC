import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";

import { ethers } from "ethers";

import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { stakingUFCPLSRUFCC,stakingUFCPLSRUSDC } from "../const/parameters";

export default function Home() {
  const address = useAddress();
  const [amountToStake, setAmountToStake] = useState(0);

  const ufccIcon = <img style={{marginLeft:"6px"}} width="24px" height="24px" src="UFCC.png" alt="UFCC"></img>
  const ufcplsrIcon = <img style={{marginLeft:"6px"}} width="24px" height="24px" src="UFCPLSR.png" alt="UFCPLSR"></img>
  const usdcIcon = <img style={{marginLeft:"6px"}} width="24px" height="24px" src="USDC.png" alt="USDC"></img>


  // Initialize all the contracts
  const { contract: stakingUFCC, isLoading: isStakingUFCCLoading } = useContract(
    stakingUFCPLSRUFCC,
    "custom"
  );
  const { contract: stakingUSDC, isLoading: isStakingUSDCLoading } = useContract(
    stakingUFCPLSRUSDC,
    "custom"
  );

  // Get contract data from staking contract
  const { data: rewardTokenAddressUFCC } = useContractRead(stakingUFCC, "rewardToken");
  const { data: stakingTokenAddressUFCC } = useContractRead(
    stakingUFCC,
    "stakingToken"
  );

  const { data: rewardTokenAddressUSDC } = useContractRead(stakingUSDC, "rewardToken");
  const { data: stakingTokenAddressUSDC } = useContractRead(
    stakingUSDC,
    "stakingToken"
  );


  // Initialize token contracts
  const { contract: stakingTokenUFCC, isLoading: isStakingTokenLoadingUFCC } =
    useContract(stakingTokenAddressUFCC, "token");
  const { contract: rewardTokenUFCC, isLoading: isRewardTokenLoadingUFCC } =
    useContract(rewardTokenAddressUFCC, "token");

    const { contract: stakingTokenUSDC, isLoading: isStakingTokenLoadingUSDC } =
    useContract(stakingTokenAddressUSDC, "token");
  const { contract: rewardTokenUSDC, isLoading: isRewardTokenLoadingUSDC } =
    useContract(rewardTokenAddressUSDC, "token");


  // Token balances
  const { data: stakingTokenBalanceUFCC, refetch: refetchStakingTokenBalanceUFCC } =
    useTokenBalance(stakingTokenUFCC, address);
  const { data: rewardTokenBalanceUFCC, refetch: refetchRewardTokenBalanceUFCC } =
    useTokenBalance(rewardTokenUFCC, address);

    const { data: stakingTokenBalanceUSDC, refetch: refetchStakingTokenBalanceUSDC } =
    useTokenBalance(stakingTokenUSDC, address);
  const { data: rewardTokenBalanceUSDC, refetch: refetchRewardTokenBalanceUSDC } =
    useTokenBalance(rewardTokenUSDC, address);


    
  // Get staking data
  const {
    data: stakeInfoUFCC,
    refetch: refetchStakingInfoUFCC,
    isLoading: isStakeInfoLoadingUFCC,
  } = useContractRead(stakingUFCC, "getStakeInfo", [address || "0"]);

  const {
    data: stakeInfoUSDC,
    refetch: refetchStakingInfoUSDC,
    isLoading: isStakeInfoLoadingUSDC,
  } = useContractRead(stakingUSDC, "getStakeInfo", [address || "0"]);


  useEffect(() => {
    setInterval(() => {
      refetchData();
    }, 10000);
  }, []);

  const refetchData = () => {
    refetchRewardTokenBalanceUFCC();
    refetchStakingTokenBalanceUFCC();
    refetchStakingInfoUFCC();

    refetchRewardTokenBalanceUSDC();
    refetchStakingTokenBalanceUSDC();
    refetchStakingInfoUSDC();
  };

  return (
    <div className={styles.container}>
    
      <main className={styles.main}>
    <div className={styles.connect}>
    <ConnectWallet />
  </div>
        <h1 className={styles.title}>Refined Pulsar Corp.</h1>
        <p className={styles.description}>
          Stake your {ufcplsrIcon} UFCPLSR token to get {ufccIcon} UFCC or {usdcIcon}  USDC !
        </p>
          <img width="300px" src="rpc.webp" alt="RPC"></img>
        <div className={styles.grid}>
        <div > 
          <p>
            Stake UFCPLSR to get UFCC at a rate of 15% APR.: 
        <img style={{marginLeft:"12px",marginBottom:"-6px"}} width="24px" height="24px" src="UFCPLSR.png" alt="RPC"></img>
        <img style={{marginLeft:"4px",marginBottom:"-6px"}}  width="24px" height="24px" src="UFCC.png" alt="RPC"></img>
        <input
            className={styles.textbox}
            type="number"
            value={amountToStake}
            onChange={(e) => setAmountToStake(e.target.value)}
            />
            </p>

<div className={styles.stake}>

          <Web3Button
            className={styles.button}
            contractAddress={stakingUFCPLSRUFCC}
            action={async (contract) => {
              await stakingTokenUFCC.setAllowance(
                stakingUFCPLSRUFCC,
                amountToStake
              );
              await contract.call(
                "stake",
                [ethers.utils.parseEther(amountToStake)]
              );
              alert("Tokens staked successfully!");
            }}
          >
            Stake   
            {ufcplsrIcon}
          </Web3Button>

          <Web3Button
            className={styles.button}
            contractAddress={stakingUFCPLSRUFCC}
            action={async (contract) => {
              await contract.call(
                "withdraw",
                [ethers.utils.parseEther(amountToStake)]
              );
              alert("Tokens unstaked successfully!");
            }}
          >
            Unstake 
            {ufcplsrIcon}
          </Web3Button>

          <Web3Button
            className={styles.button}
            contractAddress={stakingUFCPLSRUFCC}
            action={async (contract) => {
              await contract.call("claimRewards", []);
              alert("Rewards claimed successfully!");
            }}
          >
            Rewards
            {ufccIcon}
          </Web3Button>
        </div>

        </div>
        </div>



        <div className={styles.grid}>
          <a className={styles.card}>
            <h2>
            {ufcplsrIcon} UFCPLSR balance</h2>
            <p>{stakingTokenBalanceUFCC?.displayValue}</p>
          </a>

          <a className={styles.card}>
            <h2>{ufccIcon} UFCC balance</h2>
            <p>{rewardTokenBalanceUFCC?.displayValue}</p>
          </a>

          <a className={styles.card}>
            <h2>{ufcplsrIcon} Staked amount</h2>
            <p>
              {stakeInfoUFCC && ethers.utils.formatEther(stakeInfoUFCC[0].toString())}
            </p>
          </a>

          <a className={styles.card}>
            <h2>{ufccIcon} Current reward</h2>
            <p>
              {stakeInfoUFCC && ethers.utils.formatEther(stakeInfoUFCC[1].toString())}
            </p>
          </a>
        </div>














        <div className={styles.grid}>
        <div > 
          <p>
            Stake UFCPLSR to get USDC at a rate of 5% APR.: 
        <img style={{marginLeft:"12px",marginBottom:"-6px"}} width="24px" height="24px" src="UFCPLSR.png" alt="RPC"></img>
        <img style={{marginLeft:"4px",marginBottom:"-6px"}}  width="24px" height="24px" src="USDC.png" alt="RPC"></img>
        <input
            className={styles.textbox}
            type="number"
            value={amountToStake}
            onChange={(e) => setAmountToStake(e.target.value)}
            />
            </p>

<div className={styles.stake}>

          <Web3Button
            className={styles.button}
            contractAddress={stakingUFCPLSRUSDC}
            action={async (contract) => {
              await stakingTokenUSDC.setAllowance(
                stakingUFCPLSRUSDC,
                amountToStake
              );
              await contract.call(
                "stake",
                [ethers.utils.parseEther(amountToStake)]
              );
              alert("Tokens staked successfully!");
            }}
          >
            Stake   
            {ufcplsrIcon}
          </Web3Button>

          <Web3Button
            className={styles.button}
            contractAddress={stakingUFCPLSRUSDC}
            action={async (contract) => {
              await contract.call(
                "withdraw",
                [ethers.utils.parseEther(amountToStake)]
              );
              alert("Tokens unstaked successfully!");
            }}
          >
            Unstake 
            {ufcplsrIcon}
          </Web3Button>

          <Web3Button
            className={styles.button}
            contractAddress={stakingUFCPLSRUSDC}
            action={async (contract) => {
              await contract.call("claimRewards", []);
              alert("Rewards claimed successfully!");
            }}
          >
            Rewards
            {usdcIcon}
          </Web3Button>
        </div>

        </div>
        </div>



        <div className={styles.grid}>
          <a className={styles.card}>
            <h2>
            {ufcplsrIcon} UFCPLSR balance</h2>
            <p>{stakingTokenBalanceUSDC?.displayValue}</p>
          </a>

          <a className={styles.card}>
            <h2>{usdcIcon} USDC balance</h2>
            <p>{rewardTokenBalanceUSDC?.displayValue}</p>
          </a>

          <a className={styles.card}>
            <h2>{ufcplsrIcon} Staked amount</h2>
            <p>
              {stakeInfoUSDC && ethers.utils.formatEther(stakeInfoUSDC[0].toString())}
            </p>
          </a>

          <a className={styles.card}>
            <h2>{usdcIcon} Current reward</h2>
            <p>
              {stakeInfoUSDC && ethers.utils.formatEther(stakeInfoUSDC[1].toString(),6)*1000000000000}
            </p>
          </a>
        </div>









      </main>
    </div>
  );
}
