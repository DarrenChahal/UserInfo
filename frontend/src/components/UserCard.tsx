import React, { useState } from 'react';
import { Card, Modal, Form, Input } from 'antd';
import { HeartOutlined, EditOutlined, DeleteOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';

interface UserCardProps {
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    website: string;
    liked?: boolean; // Optional field to manage like status locally
  };
  onLike: () => void;
  onEdit: (updatedData: Partial<UserCardProps['user']>) => void;
  onDelete: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onLike, onEdit, onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleOk = (values: any) => {
    onEdit(values); // Pass the updated data back to parent
    setIsModalVisible(false);
  };

  const handleLikeClick = () => {
    onLike(); // Handle like functionality
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`;

  return (
    <>
      <Card
        style={{
          width: '100%',
          maxWidth: '250px',
          margin: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        cover={
          <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
            <div style={{ width: '100%', padding: '15px', textAlign: 'center', border: '2px solid #ccc', boxSizing: 'border-box' }}>
              <img src={avatarUrl} alt="User Avatar" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
          </div>
        }
        actions={[
          <HeartOutlined
            key="like"
            onClick={handleLikeClick}
            style={{ color: user.liked ? 'red' : '#000' }}
          />,
          <EditOutlined key="edit" onClick={showModal} />,
          <DeleteOutlined key="delete" onClick={onDelete} />,
        ]}
      >
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{user.name}</p>
          <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <MailOutlined /> {user.email}
          </p>
          <p><PhoneOutlined /> {user.phone}</p>
          <p><GlobalOutlined /> <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">{user.website}</a></p>
        </div>
      </Card>

      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}
          initialValues={{ name: user.name, email: user.email, phone: user.phone, website: user.website }}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter the email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter the phone number!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Website" name="website" rules={[{ required: true, message: 'Please enter the website!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
