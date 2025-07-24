import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatHeader = ({ name, avatarUrl }) => (
  <div className="flex items-center justify-between p-4 border-b">
    <div className="flex items-center">
      <Avatar className="w-10 h-10 mr-4">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <h2 className="text-lg font-semibold">{name}</h2>
    </div>
  </div>
);

export default ChatHeader;
