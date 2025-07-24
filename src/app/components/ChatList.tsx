"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ChatListItem = ({ name, message, time, onClick }) => (
  <div
    className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
    onClick={onClick}
  >
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

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          id,
          name,
          messages ( content, created_at )
        `);

      if (error) {
        console.error('Error fetching chats:', error);
      } else {
        setChats(data);
      }
    };

    fetchChats();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search or start new chat"
          className="w-full px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            name={chat.name || 'Unnamed Chat'}
            message={chat.messages.length > 0 ? chat.messages[0].content : 'No messages yet'}
            time={chat.messages.length > 0 ? formatTimestamp(chat.messages[0].created_at) : ''}
            onClick={() => onSelectChat(chat)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
