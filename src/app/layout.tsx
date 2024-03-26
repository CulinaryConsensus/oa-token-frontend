import "@/styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/app/Providers/BlockChainProvider";
import NavBar from "@/components/NavBar/NavBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OAToken Fractionalizer",
  description: "OAToken Fractionalizer Protocol for OA NFTs",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-rk>
      <body className="mx-auto flex h-screen flex-col ">
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
