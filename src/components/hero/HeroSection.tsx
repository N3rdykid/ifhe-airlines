
import { ReactNode } from 'react';

interface HeroSectionProps {
  children: ReactNode;
}

const HeroSection = ({ children }: HeroSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-airline-800 to-airline-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Explore the World with SkyWay
          </h1>
          <p className="text-xl text-airline-200 mb-8">
            Book your flights easily, travel comfortably, create unforgettable memories.
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
