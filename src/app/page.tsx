import React from 'react';
import ChatList from './components/ChatList';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

const Sidebar = () => (
  <div className="w-1/3 bg-gray-100 border-r border-gray-200">
    <ChatList />
  </div>
);

const ChatWindow = () => (
  <div className="w-2/3 flex flex-col">
    <ChatHeader name="John Doe" />
    <MessageList />
    <MessageInput />
  </div>
);

export default function Home() {
  return (
    <div className="flex h-screen antialiased text-gray-800">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
