"use client";
import { OACollectionConfig } from "@/utils/consts";
import { useAccount, useReadContract } from "wagmi";
import NFT from "@/components/cards/my-oas/NFT";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { LampEffect } from "@/components/landing/LampEffect";
import { Address } from "viem";
import TxDialog from "@/components/Dialog/TxDialog";
import { usePagination } from "@/hooks/usePagination";
import { multicall, MulticallReturnType } from "@wagmi/core";
import { config } from "@/app/Providers/BlockChainProvider";
import NFTSkeleton from "@/components/cards/my-oas/NFTSkeleton";
import { useMedia } from "react-use";
import NavButton from "@/components/NavBar/NavButton";

const YourNFTs = () => {
  const isLarge = useMedia("(min-width: 1024px)");
  const isXLarge = useMedia("(min-width: 1280px)");
  const is2XLarge = useMedia("(min-width: 1536px)");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTxHash, setDialogTxHash] = useState<Address | null>(null);
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const [itemsToShow, setItemsToShow] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { address: currentWalletAddress, isConnected, chainId } = useAccount();
  const { data: balance, isPending } = useReadContract({
    ...OACollectionConfig,
    functionName: "balanceOf",
    args: [currentWalletAddress],
  });
  const itemsPerPage = is2XLarge ? 12 : isXLarge ? 9 : isLarge ? 6 : 3;
  const { currentPage, controls, pageCount, getSlicedData } = usePagination(
    itemsToShow,
    itemsPerPage
  );

  useEffect(() => {
    if (balance !== undefined) {
      setItemsToShow(
        Array.from({ length: Number(balance) }, (_, index) => index)
      );
    }
  }, [balance]);

  useEffect(() => {
    const getNFTIds = async () => {
      setIsLoading(true);
      const dataToFetch = getSlicedData() as number[];
      const result: MulticallReturnType = await multicall(config, {
        contracts: dataToFetch.map((i) => ({
          address: OACollectionConfig.address,
          abi: OACollectionConfig.abi,
          functionName: "tokenOfOwnerByIndex",
          args: [currentWalletAddress, i],
        })),
      });
      setTokenIds(result.map((i) => i.result as number));
      setIsLoading(false);
    };

    if (Number(balance) > 0 && itemsToShow.length > 0) {
      getNFTIds();
    }
  }, [itemsToShow, currentPage, currentWalletAddress]);

  if (!currentWalletAddress && !isConnected) {
    return <LampEffect text="Connect your wallet to view your NFTs" />;
  }

  if (chainId !== 9001)
    return (
      <LampEffect text="Wrong network. Please connect to the Evmos mainnet" />
    );
  else if (!isPending && Number(balance) === 0) {
    return (
      <LampEffect text="No Orbital Apes in your wallet">
        <div className="flex gap-3">
          <NavButton text={"Deposited OAs"} href={"/deposited-oas"} />
          <NavButton
            text={"Orbital Apes Market Place"}
            target="_blank"
            href={
              "https://www.orbitmarket.io/collection/0x4c275ade386af17276834579b1a68146cef3c770"
            }
          />
        </div>
      </LampEffect>
    );
  }

  return (
    tokenIds.length > 0 && (
      <div className="mx-auto flex max-w-7xl flex-col p-5 2xl:max-w-full">
        {!isLoading && tokenIds.length !== 0 ? (
          <div className="grid grid-cols-1  pt-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {tokenIds.map((nftID, index) => (
              <div
                key={index + currentPage}
                className="group relative block h-full w-full p-3"
                onMouseEnter={() => setHoveredIndex(index + currentPage)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === index + currentPage && (
                    <motion.span
                      className="absolute inset-0 block h-full w-full rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <NFT
                  key={index + currentPage * 2}
                  nftID={nftID}
                  setDialogTxHash={setDialogTxHash}
                  setIsDialogOpen={setIsDialogOpen}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 pt-10 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: itemsPerPage }, (_, index) => (
              <NFTSkeleton key={index} />
            ))}
          </div>
        )}
        {pageCount > 1 && <div className="mx-auto">{controls}</div>}
        {isDialogOpen && dialogTxHash && (
          <TxDialog
            onClose={() => setIsDialogOpen(false)}
            hash={dialogTxHash}
            isOpen={isDialogOpen}
          />
        )}
      </div>
    )
  );
};

export default YourNFTs;
