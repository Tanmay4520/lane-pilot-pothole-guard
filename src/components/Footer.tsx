
import React from 'react';
import { Github, Coffee } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary py-6 mt-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            Lane Pilot Pothole Guard - Computer Vision Project - {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-primary flex items-center gap-1">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary flex items-center gap-1">
              <Coffee className="h-4 w-4" />
              <span>Buy me a coffee</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
