import { cn } from "@/lib/utils";
import {
  IconClock,
  IconGift,
  IconBolt,
  IconShieldLock,
} from "@tabler/icons-react";

export default function FeaturesSectionDemo() {
  const features = [
    {
      title: "Setup Time",
      description: "2 Mins",
      icon: <IconClock className="w-6 h-6" />,
    },
    {
      title: "Launch Offer",
      description: "Free*",
      icon: <IconGift className="w-6 h-6" />,
    },
    {
      title: "Activation",
      description: "Instant",
      icon: <IconBolt className="w-6 h-6" />,
    },
    {
      title: "Security",
      description: "Encrypted",
      icon: <IconShieldLock className="w-6 h-6" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-white/5",
        (index === 0 || index === 4) && "lg:border-l border-white/5",
        index < 4 && "lg:border-b border-white/5"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-[#0F3D2E]/40 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-[#0F3D2E]/40 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-[#B7BEC4]">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-[#0F3D2E] group-hover/feature:bg-[#145A3A] transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-[#B7BEC4] max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
