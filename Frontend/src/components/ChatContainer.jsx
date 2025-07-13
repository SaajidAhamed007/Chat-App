import { useChatStore } from '../store/useChatStore'
import { useEffect,useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeleton/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {

    const {messages,getMessages,isMessagesLoading,selectedUser,listeningToMessage,unListeningToMessage,markSeen} = useChatStore();
    const {authUser} = useAuthStore()
    const messageEndRef = useRef(null)

    useEffect(() => {
      if (!selectedUser?._id) return;

      getMessages(selectedUser._id)
      listeningToMessage();

      return () => unListeningToMessage();
    },[selectedUser._id])

    useEffect(() => {
      if(messageEndRef.current && messages){
        messageEndRef.current.scrollIntoView({behavior:"smooth"})
      }
    },[messages])

    useEffect(() => {
      if (!selectedUser || !messages?.length) return;

      const unseen = messages.some(
        (msg) => msg.senderId === selectedUser._id && !msg.isSeen
      );

      if (unseen) {
        markSeen(selectedUser._id);
      }
    },[selectedUser._id, messages, markSeen]);

    if(isMessagesLoading) return(
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
          <h1>hello</h1>
        <MessageSkeleton />
        <MessageInput />
      </div>
    ) 

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === selectedUser._id ? "chat-start":"chat-end"}`}
              ref={messageEndRef}
            >
              <div className='chat-header mb-1'>
                <time className='text-xs opacity-80'>
                  {formatMessageTime(message.createdAt)}
                </time>  
              </div>
              <div className='chat-bubble flex flex-col'>
                {message.image && (
                  <img 
                   src={message.image}
                   alt="picMessage"
                   className='sm:max-w-[200px] rounded-md mb-2'
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
              { message.senderId===authUser._id && (
                <div className='chat-footer opacity-70'>
                  {message.isSeen?"seen":"delivered"}
                </div>
              )}
              
            </div>
          ))}
        </div>
        <MessageInput />
    </div>
  )
}

export default ChatContainer
