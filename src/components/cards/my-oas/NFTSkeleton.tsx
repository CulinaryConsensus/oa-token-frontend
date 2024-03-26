import React from "react";

const NFTSkeleton = () => {
  return (
    <article className="relative z-50 shadow-lg">
      <div className="skeleton h-[400px] w-[400px] rounded-b-none"></div>
      <div className="absolute right-3 top-3">
        <div className="skeleton h-10 w-10 rounded-full"></div>
      </div>
      <div className="relative flex flex-col items-start justify-end overflow-hidden rounded-b-2xl bg-black">
        <div className="w-full p-4">
          <div className="skeleton mb-4 h-6 w-2/3"></div>
          <div className="flex items-center justify-between">
            <div className="skeleton h-10 w-24"></div>
            <div className="skeleton h-10 w-24"></div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NFTSkeleton;
