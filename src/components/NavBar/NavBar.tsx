"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { OATokenConfig } from "@/utils/consts";
import Image from "next/image";
import apeProfile from "@/public/apeProfile.svg";
import NavButton from "@/components/NavBar/NavButton";
import React from "react";
import Link from "next/link";
import { Twitter } from "lucide-react";

export default function NavBar() {
  const { address: currentWalletAddress } = useAccount();
  const { data: currentTokenBalance, isPending: isBalancePending } =
    useReadContract({
      ...OATokenConfig,
      functionName: "balanceOf",
      args: [currentWalletAddress],
    });

  const { data: currentSupply, isPending: isTotalSupplyPending } =
    useReadContract({
      ...OATokenConfig,
      functionName: "totalSupply",
      args: [],
    });

  return (
    <header className="navbar sticky top-0 z-[100] w-full bg-primary-content">
      <nav className="navbar-start gap-3">
        <NavButton text={"My OAs"} href={"/my-oas"} />
        <NavButton text={"Deposited OAs"} href={"/deposited-oas"} />
        <NavButton
          target="_blank"
          text={"Forge Pool"}
          href="https://www.forge.trade/#/add/0xd4949664cd82660aae99bedc034a0dea8a0bd517/0xeaa87fdf35a041963a1902dcc26bbaa2386a6800"
        />
      </nav>
      <div className="navbar-center gap-3">
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <Link
            className="flex h-6 items-center gap-1  rounded-md text-sm "
            href="https://twitter.com/culinaryconlabs"
            target={"_blank"}
          >
            <Twitter
              size={36}
              color={"transparent"}
              className={"fill-cyan-500"}
            />
          </Link>
        </nav>
      </div>
      <div className="navbar-end gap-3">
        <span className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full items-center  justify-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            <Image src={apeProfile} alt={"ape coin"} width={20} height={20} />
            {isTotalSupplyPending ? (
              <div className="skeleton h-4 w-28"></div>
            ) : (
              <span className="text-lg font-bold">
                {(!!currentSupply &&
                  !isTotalSupplyPending &&
                  formatEther(currentSupply as bigint)) ||
                  0}
                / 5 000 000
              </span>
            )}
          </span>
        </span>
        <span className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full items-center  justify-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            <Image src={apeProfile} alt={"ape coin"} width={20} height={20} />
            {isBalancePending ? (
              <div className="skeleton h-4 w-28"></div>
            ) : (
              <span className="text-lg font-bold">
                {(!!currentTokenBalance &&
                  !isBalancePending &&
                  parseFloat(
                    formatEther(currentTokenBalance as bigint)
                  ).toFixed(2)) ||
                  0}
              </span>
            )}
          </span>
        </span>
        <ConnectButton showBalance={false} />
      </div>
    </header>
  );
}
