import React from 'react';

const ChatListItem = ({ name, message, time }) => (
  <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200">
    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
    <div className="flex-1">
      <div className="flex justify-between">
        <span className="font-semibold">{name}</span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-600 truncate">{message}</p>
    </div>
  </div>
);

const ChatList = () => (
  <div className="flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <input
        type="text"
        placeholder="Search or start new chat"
        className="w-full px-2 py-1 border border-gray-300 rounded-md"
      />
    </div>
    <div className="flex-1 overflow-y-auto">
      <ChatListItem name="John Doe" message="Hey, how are you?" time="10:30 AM" />
      <ChatListItem name="Jane Smith" message="Let's catch up later." time="Yesterday" />
    </div>
  </div>
);

export default ChatList;
