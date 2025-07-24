"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Message = ({ text, time, sent }) => (
  <div className={`flex ${sent ? 'justify-end' : 'justify-start'} mb-4`}>
    <div
      className={`rounded-lg px-4 py-2 ${sent ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
      <p>{text}</p>
      <span className="text-xs text-gray-500 float-right mt-1">{time}</span>
    </div>
  </div>
);

const MessageList = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (chat) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('*, profiles(username)')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
        } else {
          setMessages(data);
        }
      };

      fetchMessages();

      const subscription = supabase
        .channel(`chat:${chat.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chat.id}` }, (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [chat]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => (
        <Message
          key={message.id}
          text={message.content}
          time={formatTimestamp(message.created_at)}
          sent={currentUser?.id === message.user_id}
        />
      ))}
    </div>
  );
};

export default MessageList;
