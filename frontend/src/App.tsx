import React, { useState, useEffect } from 'react';
import { useFetchUsers } from './hooks'; // Adjust the path as needed
import { UserCard } from './components/UserCard'; // Adjust the path as needed
import Spinner from './components/Spinner';
import { Row, Col } from 'antd';
import { User } from './hooks'; // Adjust the path as needed

const App: React.FC = () => {
  const { users, loading } = useFetchUsers();
  const [localUsers, setLocalUsers] = useState<User[]>([]);

  useEffect(() => {
    setLocalUsers(users); // Initialize local state with fetched users
  }, [users]);

  const handleLike = (userId: number) => {
    setLocalUsers(prevUsers =>
      prevUsers.map(user => (user as User & { liked?: boolean }).id === userId ? 
      { ...user, liked: !(user as User & { liked?: boolean }).liked } : user)
    );
  };

  const handleDelete = (userId: number) => {
    setLocalUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const handleEdit = (userId: number, updatedData: Partial<User>) => {
    setLocalUsers(prevUsers =>
      prevUsers.map(user => user.id === userId ? { ...user, ...updatedData } : user)
    );
  };

  return (
    <Row gutter={16} justify="start">
      {loading && (
        <Col span={24} style={{ textAlign: 'center' }}>
          <Spinner />
        </Col>
      )}
      {!loading && localUsers.map((user: User) => (
        <Col 
          xs={24} sm={12} md={8} lg={6} xl={6} key={user.id}
        >
          <UserCard
            user={user}
            onLike={() => handleLike(user.id)}
            onEdit={(updatedData) => handleEdit(user.id, updatedData)}
            onDelete={() => handleDelete(user.id)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default App;
