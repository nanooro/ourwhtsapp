"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    if (searchTerm) {
      const searchUsers = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .ilike('username', `%${searchTerm}%`);

        if (error) {
          console.error('Error searching users:', error);
        } else {
          setUsers(data);
        }
      };

      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const handleCreateChat = async (userId) => {
    const { data, error } = await supabase
      .from('chats')
      .insert([{}])
      .select();

    if (error) {
      console.error('Error creating chat:', error);
      return;
    }

    const newChat = data[0];

    const { data: currentUser } = await supabase.auth.getUser();

    const { error: participantError } = await supabase
      .from('chat_participants')
      .insert([
        { chat_id: newChat.id, user_id: currentUser.user.id },
        { chat_id: newChat.id, user_id: userId },
      ]);

    if (participantError) {
      console.error('Error adding participants:', participantError);
    } else {
      onSelectChat(newChat);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search or start new chat..." value={searchTerm} onValueChange={setSearchTerm} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {searchTerm ? (
          <CommandGroup heading="Users">
            {users.map((user) => (
              <CommandItem key={user.id} onSelect={() => handleCreateChat(user.id)}>
                <Avatar className="mr-2">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.username}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : (
          <CommandGroup heading="Chats">
            {chats.map((chat) => (
              <CommandItem key={chat.id} onSelect={() => onSelectChat(chat)}>
                <Avatar className="mr-2">
                  <AvatarFallback>{chat.name ? chat.name.charAt(0) : 'C'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p>{chat.name || 'Unnamed Chat'}</p>
                  <p className="text-sm text-muted-foreground">
                    {chat.messages.length > 0 ? chat.messages[0].content : 'No messages yet'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {chat.messages.length > 0 ? formatTimestamp(chat.messages[0].created_at) : ''}
                </p>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default ChatList;
