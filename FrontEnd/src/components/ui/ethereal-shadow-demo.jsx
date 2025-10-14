import { EtherealShadow } from "@/components/ui/ethereal-shadow";

const EtherealShadowDemo = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-black">
      <div className="w-full h-full">
        <EtherealShadow
          color="rgba(34, 197, 94, 0.5)"
          animation={{ scale: 50, speed: 40 }}
          noise={{ opacity: 0.8, scale: 1.5 }}
          sizing="fill"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white z-20">Ethereal Shadows Demo</h1>
        </div>
      </div>
    </div>
  );
};

export { EtherealShadowDemo };
