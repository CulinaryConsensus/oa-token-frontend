"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { multicall, MulticallReturnType } from "@wagmi/core";
import {
  ApeCategory,
  ApePricesStrings,
  OACollectionConfig,
  OATokenConfig,
} from "@/utils/consts";
import { Address } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { Meteors } from "@/components/Meteor/Meteor";
import Image from "next/image";
import apeProfile from "@/public/apeProfile.svg";
import orbitMarket from "@/public/orbitMarketLogo.svg";
import Link from "next/link";
import { config } from "@/app/Providers/BlockChainProvider";
import { cn } from "@/utils/cn";

interface NFTProps {
  nftID: number;
  setDialogTxHash: (hash: Address) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

const NFT = ({ nftID, setDialogTxHash, setIsDialogOpen }: NFTProps) => {
  const queryClient = useQueryClient();
  const [nftType, setNftType] = useState<number>(0);
  const [isApproved, setIsApproved] = useState<Address>();
  const [owner, setOwner] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: depositHash,
    writeContract: depositNFT,
    isPending: isDepositPending,
  } = useWriteContract();
  const {
    data: approvalHash,
    writeContract: approveNFT,
    isPending: isApprovePending,
  } = useWriteContract();

  const onApproveNFT = useCallback(() => {
    approveNFT({
      ...OACollectionConfig,
      functionName: "approve",
      args: [OATokenConfig.address, nftID],
    });
  }, [approveNFT, nftID]);
  const { isLoading: isConfirmingApprove, isSuccess: isConfirmedApproved } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });

  const { isLoading: isConfirmingDeposit, isSuccess: isConfirmedDeposit } =
    useWaitForTransactionReceipt({
      hash: depositHash,
    });

  const onDepositNFT = useCallback(() => {
    depositNFT({
      ...OATokenConfig,
      functionName: "depositNFT",
      args: [nftID],
    });
  }, [depositNFT, nftID]);

  const generationName = ApeCategory[nftType as number];

  useEffect(() => {
    const getNFTInformation = async () => {
      setIsLoading(true);
      const result: MulticallReturnType = await multicall(config, {
        contracts: [
          {
            address: OATokenConfig.address,
            abi: OATokenConfig.abi,
            functionName: "getNFTType",
            args: [nftID],
          },
          {
            address: OACollectionConfig.address,
            abi: OACollectionConfig.abi,
            functionName: "getApproved",
            args: [nftID],
          },
          {
            address: OACollectionConfig.address,
            abi: OACollectionConfig.abi,
            functionName: "ownerOf",
            args: [nftID],
          },
        ],
      });
      setNftType(result[0].result as number);
      setIsApproved(result[1].result as Address);
      setOwner(result[2].result as Address);
      setIsLoading(false);
    };
    getNFTInformation();
  }, [nftID, isConfirmedApproved]);

  useEffect(() => {
    const confirmedApproval = async () => {
      if (isConfirmedApproved) {
        setDialogTxHash(approvalHash!);
        setIsDialogOpen(true);
        await queryClient.invalidateQueries();
      }
    };
    confirmedApproval();
  }, [isConfirmingApprove]);

  useEffect(() => {
    const confirmedDeposit = async () => {
      if (isConfirmedDeposit) {
        setDialogTxHash(depositHash!);
        setIsDialogOpen(true);
        await queryClient.invalidateQueries();
      }
    };
    confirmedDeposit();
  }, [isConfirmingDeposit]);

  return (
    <article className="card relative z-50 min-w-[400px] shadow-lg">
      <figure>
        {isLoading && <div className="skeleton h-[400px] w-[400px]"></div>}
        <Image
          src={`https://cloudflare-ipfs.com/ipfs/bafybeicslybdizkv2chqovkngrfqi36njbt766zdjj5swjqsucquo4s6ou/Orbital%20Ape%20${nftID}.jpeg`}
          alt={`Orbital Ape #${nftID}`}
          width={400}
          height={400}
          className="relative h-auto w-auto"
          placeholder={"blur"}
          blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mOcH/61noEIwDiqkL4KARHKGC8msbfGAAAAAElFTkSuQmCC`}
        />
      </figure>
      <Link
        href={`https://www.orbitmarket.io/nft/0x4c275ade386af17276834579b1a68146cef3c770/${nftID}`}
        target={"_blank"}
      >
        <button className="btn btn-circle btn-outline absolute right-3 top-3">
          <Image
            src={orbitMarket}
            width={24}
            height={24}
            alt={`Orbit Market Logo`}
            priority
          />
        </button>
      </Link>
      <div className="relative flex flex-col items-start justify-end overflow-hidden rounded-b-2xl bg-black">
        <div className="card-body w-full">
          <h2 className="flex items-center justify-between font-bold">
            Orbital Ape {Number(nftID)}
            {isLoading ? (
              <span className="skeleton h-4 w-10"></span>
            ) : (
              <span>{generationName}</span>
            )}
          </h2>
          <div className="card-actions items-center justify-between">
            <div className="flex items-center gap-2 rounded-xl text-xs font-normal dark:text-white">
              <Image
                src={apeProfile}
                alt="OAToken Logo"
                width={24}
                height={24}
                priority
              />
              {isLoading ? (
                <span className="skeleton h-8 w-16"></span>
              ) : (
                <span className="text-2xl">
                  {ApePricesStrings[nftType as number]}
                </span>
              )}
              <span className={"text-md self-end py-1 text-gray-500"}>
                (OAT)
              </span>
            </div>
            {isLoading ? (
              <div className="btn btn-ghost skeleton h-4 w-28"></div>
            ) : isApproved === OATokenConfig.address ? (
              <button
                onClick={onDepositNFT}
                disabled={isConfirmingDeposit || isDepositPending}
                className={cn(
                  "inline-flex h-12 animate-shimmer items-center justify-center rounded-lg border border-slate-500 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-5 text-xl font-bold text-white transition-colors ",
                  {
                    "cursor-not-allowed opacity-50":
                      isConfirmingDeposit || isDepositPending,
                  }
                )}
              >
                Deposit
                {isConfirmingDeposit && (
                  <span className="loading loading-spinner loading-md ml-2"></span>
                )}
              </button>
            ) : (
              owner !== OATokenConfig.address && (
                <button
                  onClick={onApproveNFT}
                  disabled={isConfirmingApprove || isApprovePending}
                  className={cn(
                    "inline-flex h-12 animate-shimmer items-center justify-center rounded-lg border border-slate-500 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-5 text-xl font-bold text-white transition-colors",
                    {
                      "cursor-not-allowed opacity-50":
                        isConfirmingApprove || isApprovePending,
                    }
                  )}
                >
                  Approve
                  {isConfirmingApprove && (
                    <span className="loading loading-spinner loading-md ml-2"></span>
                  )}
                </button>
              )
            )}
          </div>
          <Meteors number={20} />
        </div>
      </div>
    </article>
  );
};

export default NFT;
