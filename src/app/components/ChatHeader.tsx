import React from 'react';

const ChatHeader = ({ name }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200">
    <div className="flex items-center">
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
      <span className="font-semibold">{name}</span>
    </div>
    <div>
      {/* Add icons for search, more options, etc. here */}
    </div>
  </div>
);

export default ChatHeader;
