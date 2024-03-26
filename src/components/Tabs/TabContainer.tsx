import React, { ReactNode, useState } from "react";
import { useReadContract } from "wagmi";
import { ApeCategory, OATokenConfig } from "@/utils/consts";
import { WithdrawCard } from "@/components/cards/contract-oas/WithdrawCard";
import { Address } from "viem";
import TxDialog from "@/components/Dialog/TxDialog";
import { usePagination } from "@/hooks/usePagination";
import { useMedia } from "react-use";

interface TabContainerProps {
  category: ApeCategory;
  children: ReactNode;
}

const TabContainer = ({ category, children }: TabContainerProps) => {
  const isLarge = useMedia("(min-width: 1024px)");
  const isXLarge = useMedia("(min-width: 1280px)");
  const is2XLarge = useMedia("(min-width: 1536px)");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTxHash, setDialogTxHash] = useState<Address | null>(null);

  const { data: nftIDs, refetch: refetchContractNFTs } = useReadContract({
    ...OATokenConfig,
    functionName: "getAllNFTInContract",
    args: [category],
  });
  const nftIdsArray = nftIDs as number[];

  const { getSlicedData, controls, pageCount } = usePagination(
    nftIdsArray,
    is2XLarge ? 4 : isXLarge ? 3 : isLarge ? 3 : 1
  );
  const slicedData = getSlicedData();
  return (
    <div className="relative flex max-h-[800px] min-h-[600px] flex-col rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 p-5 text-xl font-bold text-white md:text-4xl">
      <div className="flex items-center justify-between px-5">
        <h2 className="mb-5">{ApeCategory[category]}</h2>
        {pageCount > 1 && controls}
      </div>

      {slicedData && slicedData.length > 0 && (
        <div className="grid max-h-[650px] grid-cols-1  gap-3 overflow-auto p-5 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {slicedData.map((index) => (
            <WithdrawCard
              key={index + ApeCategory[category]}
              nftId={Number(index)}
              category={category}
              setDialogTxHash={setDialogTxHash}
              setIsDialogOpen={setIsDialogOpen}
            />
          ))}
        </div>
      )}
      {slicedData && slicedData.length === 0 && (
        <div className="m-auto flex items-center justify-center">
          <span className="">No {ApeCategory[category]}s deposited yet</span>
        </div>
      )}
      {children}
      {isDialogOpen && dialogTxHash && (
        <TxDialog
          onClose={() => setIsDialogOpen(false)}
          hash={dialogTxHash}
          isOpen={isDialogOpen}
        />
      )}
    </div>
  );
};

export default TabContainer;
