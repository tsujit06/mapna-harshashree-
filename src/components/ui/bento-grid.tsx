import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3 [&>*]:min-w-0",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-6 rounded-xl border border-white/5 bg-[#101518]/90 p-6 transition duration-200 hover:shadow-xl",
        className,
      )}
    >
      <div className="flex-shrink-0">
        {header}
      </div>
      <div className="transition duration-200 group-hover/bento:translate-x-2 flex-shrink-0">
        {icon}
        <div className="mt-3 mb-2 font-sans font-bold text-white">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-zinc-400">
          {description}
        </div>
      </div>
    </div>
  );
};
