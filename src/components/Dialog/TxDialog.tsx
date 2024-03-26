import React from "react";
import Link from "next/link";
import { ArrowUpCircleIcon, XIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/Dialog/AlertDialog";
import { Address } from "viem";

type Props = {
  hash: Address;
  isOpen: boolean;
  onClose: () => void;
};

const TxDialog = ({ hash, isOpen, onClose }: Props) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-primary-content text-white">
        <AlertDialogHeader>
          <button className="btn btn-circle btn-ghost ml-auto">
            <XIcon onClick={onClose} />
          </button>
          <AlertDialogTitle className="flex justify-center py-3 text-center">
            {<ArrowUpCircleIcon size={56} />}
          </AlertDialogTitle>
          <AlertDialogDescription className="py-3 text-center text-xl">
            Transaction submitted
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center justify-center gap-5">
          <AlertDialogCancel
            onClick={onClose}
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-12 py-4 text-xl font-bold uppercase tracking-widest transition duration-200"
          >
            Close
          </AlertDialogCancel>
          <Link href={`https://escan.live/tx/${hash}`} target="_blank">
            View on Escan
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TxDialog;
