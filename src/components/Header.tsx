
import React from 'react';
import { AlertTriangle, Navigation, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Navigation className="h-6 w-6" />
          <Link to="/">
            <h1 className="text-xl font-bold">Lane Pilot Pothole Guard</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/training">
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <Construction className="h-4 w-4" />
              <span>Train Model</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span className="text-sm font-medium">Advanced Driver Assistance System</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
