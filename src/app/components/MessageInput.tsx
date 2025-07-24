"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

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
    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded-md"
      />
    </form>
  );
};

export default MessageInput;
