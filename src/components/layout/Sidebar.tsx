import { useAppContext } from '@/context/AppContext';
import { generateChatName } from '@/lib/utils';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, List, Menu, message, Popconfirm } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export const Sidebar = () => {
  const router = useRouter();
  const { chatId } = useParams() as { chatId: string };

  const [newChat, setNewChat] = useState<string>('');
  const { setMessages, chats, setChats } = useAppContext();

  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleCreateConversation = () => {
    let chatName = newChat.trim();

    if (!chatName) {
      chatName = generateChatName();
      setNewChat(chatName);
    }

    if (chats.includes(chatName)) {
      message.error('Conversation name already exists!');
      return;
    }

    setChats((prevChats) => [chatName, ...prevChats]);

    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatName]: [],
    }));

    setNewChat('');
  };

  const handleSelectConversation = (conversation: string) => {
    router.push(`/chat/${conversation}`);
  };

  const handleDeleteConversation = (conversation: string) => {
    setChats((prevChats) => prevChats.filter((item) => item !== conversation));

    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[conversation];
      return newMessages;
    });

    message.success('Conversation deleted');
    router.push('/');
  };

  const menu = (conversation: string) => (
    <Menu>
      <Menu.Item>
        <Popconfirm
          title="Are you sure want to delete?"
          onConfirm={() => handleDeleteConversation(conversation)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger size="small">
            Delete
          </Button>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        width: '250px',
        borderRight: '1px solid #ccc',
        padding: '20px',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: 15, color: '#8231D3' }}>Conversations</h3>
      <Input
        value={newChat}
        onChange={(e) => setNewChat(e.target.value)}
        placeholder="New conversation"
        onPressEnter={handleCreateConversation}
        style={{
          marginBottom: 10,
        }}
      />
      <Button
        type="primary"
        onClick={handleCreateConversation}
        style={{
          marginBottom: 30,
          width: '100%',
        }}
      >
        Create
      </Button>
      <List
        size="small"
        dataSource={chats}
        renderItem={(item) => (
          <List.Item
            onClick={() => handleSelectConversation(item)}
            style={{
              cursor: 'pointer',
              backgroundColor: item === chatId ? '#e6f7ff' : 'transparent',
              fontWeight: item === chatId ? 'bold' : 'normal',
              padding: '10px 15px',
              borderRadius: '8px',
              marginBottom: '8px',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
              border: 'none',
            }}
            onMouseEnter={() => setHoveredConversation(item)}
            onMouseLeave={() => setHoveredConversation(null)}
          >
            <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
            {(item === chatId || hoveredConversation === item || openDropdown === item) && (
              <Dropdown
                trigger={['click']}
                placement="bottomRight"
                onOpenChange={(visible) => {
                  setOpenDropdown(visible ? item : null);
                }}
                overlay={menu(item)}
              >
                <EllipsisOutlined
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: '20px', marginLeft: '10px' }}
                />
              </Dropdown>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};
