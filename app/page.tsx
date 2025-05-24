import { UnderConstruction } from "@/components/common/UnderConstruction";
import { humboldtTreesDownscaledDataUri } from "@/lib/constants";

export default function Home() {
  return (
    <div>
      {/* <Hero /> */}
      <div className="px-2">
        <UnderConstruction />
      </div>
    </div>
  );
}

const Hero = () => {
  //
  return (
    <div className="group relative flex h-[60vh] w-[100vw] flex-col items-center justify-center overflow-hidden text-center text-balance">
      <div className="absolute top-1/2 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 bg-neutral-100/50 p-2 text-center text-neutral-950 backdrop-blur-xs">
        <h2 className="text-[min(10vw,var(--text-6xl))] font-bold">
          Humboldt County Rentals
        </h2>
        <p className="">
          All the rentals in one place, built for the community
        </p>
      </div>
      <div className="absolute right-2 bottom-2 z-10 rounded-md bg-neutral-100/50 p-2 text-sm text-neutral-950 backdrop-blur-xs">
        Photo by{" "}
        <a
          href="https://unsplash.com/photos/green-trees-under-blue-sky-during-daytime-BSN82KnXH0Y"
          className="text-green-700 underline"
        >
          Griffin Wooldridge
        </a>
      </div>
      <div className="size-full">
        <img
          src={"/humboldt-trees-3.jpg"}
          className="absolute top-1/2 left-1/2 z-1 size-full -translate-x-1/2 -translate-y-1/2 object-cover"
        />
        <img
          src={humboldtTreesDownscaledDataUri}
          className={`absolute top-1/2 left-1/2 z-0 size-full -translate-x-1/2 -translate-y-1/2 object-cover`}
        />
      </div>
    </div>
  );
};
