"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

const MessageInput = ({ chat }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '') return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('messages').insert([
      { content: message, chat_id: chat.id, user_id: user.id },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center">
      <Input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 mr-2"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
