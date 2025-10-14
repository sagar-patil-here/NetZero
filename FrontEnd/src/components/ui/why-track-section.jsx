import { cn } from "@/lib/utils";
import {
  IconTrendingDown,
  IconShield,
  IconChartBar,
  IconTarget,
  IconWorld,
  IconAlertTriangle,
  IconUsers,
  IconLeaf,
} from "@tabler/icons-react";

export function WhyTrackSection() {
  const features = [
    {
      title: "Regulatory Compliance",
      description:
        "Meet international carbon reporting standards and avoid costly penalties with automated tracking.",
      icon: <IconShield />,
    },
    {
      title: "Cost Reduction",
      description:
        "Identify energy inefficiencies and reduce operational costs through data-driven insights.",
      icon: <IconTrendingDown />,
    },
    {
      title: "Real-time Analytics",
      description:
        "Monitor your carbon footprint in real-time with comprehensive dashboards and reports.",
      icon: <IconChartBar />,
    },
    {
      title: "Sustainability Goals",
      description:
        "Track progress towards net-zero targets and demonstrate commitment to stakeholders.",
      icon: <IconTarget />,
    },
    {
      title: "Global Impact",
      description:
        "Contribute to global climate action and position your company as an environmental leader.",
      icon: <IconWorld />,
    },
    {
      title: "Risk Management",
      description:
        "Identify and mitigate climate-related risks before they impact your business operations.",
      icon: <IconAlertTriangle />,
    },
    {
      title: "Stakeholder Trust",
      description:
        "Build trust with investors, customers, and partners through transparent sustainability reporting.",
      icon: <IconUsers />,
    },
    {
      title: "Future-Proofing",
      description:
        "Prepare for evolving regulations and market demands with comprehensive carbon intelligence.",
      icon: <IconLeaf />,
    },
  ];
  
  return (
    <div className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Track Carbon?
          </h2>
          <p className="text-xl text-carbon-300 max-w-3xl mx-auto">
            Transform your sustainability efforts with intelligent carbon tracking that drives real business value
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-white/10",
        (index === 0 || index === 4) && "lg:border-l border-white/10",
        index < 4 && "lg:border-b border-white/10"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-primary-500/10 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-primary-400">
        <div className="w-8 h-8">
          {icon}
        </div>
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-white/20 group-hover/feature:bg-primary-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-carbon-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
