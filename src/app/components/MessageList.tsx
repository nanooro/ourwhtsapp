import React from 'react';

const Message = ({ text, time, sent }) => (
  <div className={`flex ${sent ? 'justify-end' : 'justify-start'} mb-4`}>
    <div
      className={`rounded-lg px-4 py-2 ${sent ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
      <p>{text}</p>
      <span className="text-xs text-gray-500 float-right mt-1">{time}</span>
    </div>
  </div>
);

const MessageList = () => (
  <div className="flex-1 p-4 overflow-y-auto">
    <Message text="Hey, how are you?" time="10:30 AM" sent={false} />
    <Message text="I'm good, thanks! How about you?" time="10:31 AM" sent={true} />
  </div>
);

export default MessageList;
