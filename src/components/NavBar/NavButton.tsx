import React from "react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

interface Props extends LinkProps {
  text: string;
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
}

const NavButton = ({ text, href, target, ...props }: Props) => {
  const pathname = usePathname();

  return (
    <Link href={href} target={target} {...props}>
      {pathname === href ? (
        <button className="relative p-[3px]">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="group relative rounded-[6px] px-8  py-1 font-bold text-white transition duration-200 hover:bg-transparent">
            {text}
          </div>
        </button>
      ) : (
        <button className="relative p-[3px]">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="group relative rounded-[6px] bg-black px-8 py-1 font-bold text-white transition duration-200 hover:bg-transparent">
            {text}
          </div>
        </button>
      )}
    </Link>
  );
};

export default NavButton;
