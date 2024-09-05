import React from 'react';
import HashLoader from 'react-spinners/HashLoader';

const   Loading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <HashLoader color="#48b1db" size={48} />
    <span className="ml-4 text-lg">Loading...</span>
  </div>
);

export default Loading;
