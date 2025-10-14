import React from 'react';
import { motion } from 'framer-motion';
import { EtherealShadow } from './ethereal-shadow';

const CarbonBG = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main ethereal shadow background */}
      <EtherealShadow
        color="rgba(128, 128, 128, 0.2)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        className="absolute inset-0"
      />


      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-500/5 to-transparent" />
    </div>
  );
};

export { CarbonBG };
