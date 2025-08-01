'use client';

import { useAppContext } from '@/context/AppContext';
import { createConversation } from '@/lib/services/conversation';
import { chat, geminiChat } from '@/lib/services/messages';
import { TMessage } from '@/lib/type';
import { generateChatName } from '@/lib/utils';
import { SendOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export const ChatInput = () => {
  const { data: session } = useSession();
  const { setMessages, setSending, selectedChat, setSelectedChat } = useAppContext();
  const [userMessage, setUserMessage] = useState('');

  const addMessage = (newMessage: TMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  const updateLastMessage = (updatedMessage: TMessage) => {
    setMessages((prev) => {
      if (prev.length > 0) {
        const updatedMessages = [...prev];
        updatedMessages[prev.length - 1] = {
          ...updatedMessages[prev.length - 1],
          ...updatedMessage,
        };
        return updatedMessages;
      }
      return prev;
    });
  };

  const handleAIResponse = async (message: string, chatId: string) => {
    try {
      const response = await geminiChat(message, chatId);
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let content = '';

      const aiMessage: TMessage = {
        owner: 'AI',
        content: '',
        conversation: chatId,
      };

      addMessage(aiMessage);

      while (!done) {
        const { done: isDone, value } = await reader.read();
        done = isDone;
        content += decoder.decode(value, { stream: true });
        updateLastMessage({ ...aiMessage, content });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async (conversationId: string) => {
    const newMessage: TMessage = {
      owner: session?.user?.email || 'anonymous@gmail.com',
      content: userMessage,
      conversation: conversationId,
    };

    addMessage(newMessage);
    setUserMessage('');

    try {
      await chat(newMessage);
      await handleAIResponse(userMessage, conversationId);
    } catch (error) {
      console.error('Error during message handling:', error);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setSending(true);
    try {
      const isNonSelectedChat = !selectedChat && session?.user?.email;

      if (isNonSelectedChat) {
        const conversation = await createConversation({
          user: session?.user?.email!,
          title: generateChatName(),
        });

        setSelectedChat(conversation);
        await handleSend(conversation._id!);
      } else {
        await handleSend(selectedChat?._id!);
      }
    } catch (error) {
      console.error('Error creating or sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Row
      gutter={8}
      style={{
        padding: 15,
        backgroundColor: '#f4f4f4',
        zIndex: 1,
        width: '750px',
        margin: '0 auto',
        borderRadius: 20,
      }}
    >
      <Col span={20}>
        <Input
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onPressEnter={sendMessage}
          placeholder="Type your message..."
          style={{ width: '100%', height: 40, fontSize: 16 }}
          variant="borderless"
        />
      </Col>
      <Col span={4}>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          disabled={!userMessage.trim()}
          style={{ width: '100%', height: 40 }}
        />
      </Col>
    </Row>
  );
};
