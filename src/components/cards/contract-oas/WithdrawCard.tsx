"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/cards/contract-oas/WithdrawCardDefinitions";
import apeProfile from "@/public/apeProfile.svg";
import { ApeCategory, ApePricesStrings, OATokenConfig } from "@/utils/consts";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { Meteors } from "@/components/Meteor/Meteor";
import { Address, formatEther } from "viem";
import { cn } from "@/utils/cn";
import orbitMarket from "@/public/orbitMarketLogo.svg";
import Link from "next/link";

interface WithdrawCardProps {
  nftId?: number;
  category: ApeCategory;
  setDialogTxHash: (hash: Address) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export function WithdrawCard({
  nftId,
  category,
  setDialogTxHash,
  setIsDialogOpen,
}: WithdrawCardProps) {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  const { data: currentTokenBalance, isPending: isBalancePending } =
    useReadContract({
      ...OATokenConfig,
      functionName: "balanceOf",
      args: [address],
    });

  const insufficientTokens =
    isConnected &&
    !isBalancePending &&
    Number(formatEther(currentTokenBalance as bigint)) >=
      Number(ApePricesStrings[category]);
  const {
    data: withdrawHash,
    writeContract,
    isPending: isWithdrawPending,
  } = useWriteContract();

  const { isLoading: isConfirmingWithdraw, isSuccess: isConfirmedWithdraw } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
    });

  useEffect(() => {
    const confirmedWithdraw = async () => {
      if (isConfirmedWithdraw) {
        setDialogTxHash(withdrawHash!);
        setIsDialogOpen(true);
        await queryClient.invalidateQueries();
      }
    };
    confirmedWithdraw();
  }, [isConfirmingWithdraw]);

  const handleWithdraw = () => {
    writeContract({
      ...OATokenConfig,
      functionName: "withdrawNFT",
      args: [nftId], //get type from nft selected
    });
  };

  return (
    <CardContainer className="inter-var">
      <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]  ">
        <div className="relative flex flex-col items-stretch justify-between overflow-hidden bg-black">
          <CardItem
            translateZ="50"
            className="md:text-md flex w-full items-center justify-between text-xl font-bold text-neutral-600 dark:text-white"
          >
            Orbital Ape #{nftId}
            <Link
              href={`https://www.orbitmarket.io/nft/0x4c275ade386af17276834579b1a68146cef3c770/${nftId}`}
              target={"_blank"}
              className="inline-flex"
            >
              <button className="btn btn-circle btn-outline my-auto mr-1 self-center md:btn-xs">
                <Image
                  src={orbitMarket}
                  width={24}
                  height={24}
                  alt={`Orbit Market Logo`}
                />
              </button>
            </Link>
          </CardItem>

          <CardItem translateZ="100" className="z-50 mt-4 w-full">
            <Image
              src={`https://cloudflare-ipfs.com/ipfs/bafybeicslybdizkv2chqovkngrfqi36njbt766zdjj5swjqsucquo4s6ou/Orbital%20Ape%20${nftId}.jpeg`}
              alt={`Orbital Ape #${nftId}`}
              width={1000}
              height={1000}
              className="w-full rounded-xl object-cover group-hover/card:shadow-xl"
            />
          </CardItem>
          <div className="mt-7 flex items-center justify-between">
            <CardItem
              translateZ={20}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-normal dark:text-white"
            >
              <Image
                src={apeProfile}
                alt="OAToken Logo"
                width={24}
                height={24}
                priority
              />
              {isBalancePending ? (
                <span className="skeleton h-8 w-16"></span>
              ) : (
                <span className="md:text-md text-base lg:text-lg xl:text-2xl">
                  {ApePricesStrings[category as number]}
                </span>
              )}
              <span className={"text-md self-end py-1 text-gray-500"}>
                (OAT)
              </span>
            </CardItem>
            <button
              onClick={handleWithdraw}
              style={{ transform: " translateZ(20px)" }}
              disabled={
                isConfirmingWithdraw ||
                !isConnected ||
                !insufficientTokens ||
                isWithdrawPending
              }
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-lg  border px-5 text-xl font-bold text-white transition-colors md:btn-md lg:btn-md",
                {
                  "animate-shimmer border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]":
                    isConnected && !isConfirmingWithdraw,
                  "cursor-not-allowed opacity-50":
                    !isConnected ||
                    isConfirmingWithdraw ||
                    !insufficientTokens ||
                    isWithdrawPending,
                }
              )}
            >
              Withdraw
              {isConfirmingWithdraw && (
                <span className="loading loading-spinner loading-md ml-2"></span>
              )}
            </button>
          </div>
          <Meteors number={20} />
        </div>
      </CardBody>
    </CardContainer>
  );
}
