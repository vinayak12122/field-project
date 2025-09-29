import React from "react";

const logos = [
  "/logos/aq.png",
  "/logos/hermes.png",
  "/logos/decor.png",
  "/logos/dezeen.png",
  "/logos/dolce.png",
  "/logos/givenchy.png",
  // "/images/logos/moneycontrol.png",
  // "/images/logos/goodhomes.png",
];

const FeaturedIn = () => {
  return (
    <div className="overflow-hidden bg-white py-10">
      <p className="font-cinzel p-5 text-2xl font-light text-center">
        Featured In
      </p>

      <div className="relative w-full overflow-hidden">
        <div>
          <div className="flex animate-marquee">
            {logos.concat(logos).map((src, i) => (
              <img
                key={i}
                src={src}
                alt="brand logo"
                className="h-30 w-auto mx-5 grayscale opacity-80 hover:opacity-100 transition"
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 h-40 bg-gradient-to-l from-white via-white to-transparent " />
        </div>
      </div>
      
    </div>
  );
};

export default FeaturedIn;
