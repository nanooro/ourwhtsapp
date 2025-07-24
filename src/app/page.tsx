"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Auth from './components/Auth';
import ChatList from './components/ChatList';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

const Sidebar = ({ onSelectChat }) => (
  <div className="w-1/3 bg-gray-100 border-r border-gray-200">
    <ChatList onSelectChat={onSelectChat} />
  </div>
);

const ChatWindow = ({ chat }) => (
  <div className="w-2/3 flex flex-col">
    {chat ? (
      <>
        <ChatHeader name={chat.name || 'Unnamed Chat'} />
        <MessageList chat={chat} />
        <MessageInput chat={chat} />
      </>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    )}
  </div>
);

export default function Home() {
  const [session, setSession] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, []);

  return (
    <div className="flex h-screen antialiased text-gray-800">
      {!session ? <Auth /> : (
        <>
          <Sidebar onSelectChat={setSelectedChat} />
          <ChatWindow chat={selectedChat} />
        </>
      )}
    </div>
  );
}
