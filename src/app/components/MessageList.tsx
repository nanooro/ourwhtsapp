"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Message = ({ text, time, sent, sender }) => (
  <div className={`flex items-end ${sent ? 'justify-end' : 'justify-start'} mb-4`}>
    {!sent && (
      <Avatar className="w-8 h-8 mr-2">
        <AvatarImage src={sender?.avatar_url} />
        <AvatarFallback>{sender?.username?.charAt(0)}</AvatarFallback>
      </Avatar>
    )}
    <div
      className={`rounded-lg px-4 py-2 ${sent ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
      <p>{text}</p>
      <span className="text-xs text-muted-foreground float-right mt-1">{time}</span>
    </div>
  </div>
);

const MessageList = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

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
          .select('*, profile:profiles(username, avatar_url)')
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
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chat.id}` }, async (payload) => {
          const { data, error } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.user_id)
            .single();

          if (error) {
            console.error('Error fetching profile for new message:', error);
          } else {
            setMessages((prevMessages) => [...prevMessages, { ...payload.new, profile: data }]);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          sender={message.profile}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
