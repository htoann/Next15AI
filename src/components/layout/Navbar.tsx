'use client';

import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, Typography, Space, Button } from 'antd';
import { signOut, useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Header } = Layout;
const { Title, Text } = Typography;

export const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#8231D3',
        padding: '0 20px',
        height: 56,
      }}
    >
      <Title
        level={3}
        style={{
          margin: 0,
          color: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => router.push('/')}
      >
        NextAI
      </Title>

      {session ? (
        <Dropdown overlay={menu} trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            {session?.user?.name && (
              <Text
                style={{
                  color: '#fff',
                }}
              >
                {session.user.name}
              </Text>
            )}
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#fff',
                color: '#8231D3',
              }}
            />
          </Space>
        </Dropdown>
      ) : (
        <Button
          type="primary"
          onClick={() => router.push('/auth/login')}
          style={{
            backgroundColor: '#fff',
            color: '#8231D3',
            borderColor: '#fff',
          }}
        >
          Login
        </Button>
      )}
    </Header>
  );
};