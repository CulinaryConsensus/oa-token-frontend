"use client";

import * as React from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const RainbowKitThemedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <RainbowKitProvider theme={null}>{children}</RainbowKitProvider>;
};

export default RainbowKitThemedProvider;
