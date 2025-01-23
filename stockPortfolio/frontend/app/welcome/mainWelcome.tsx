import React from 'react';
import Welcome from './Welcome';

const MainWelcome: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <Welcome />
    </div>
  );
};

export default MainWelcome;
