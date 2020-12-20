import React from 'react';
import { Layout, Row, Modal, Button } from 'antd';
import { LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const {Header} = Layout;

export default function IndexHeader() {

  const logout = () => {
    Modal.confirm({
      title: '是否确认退出登录?',
      icon: <ExclamationCircleOutlined/>,
      okText: '是',
      cancelText: '否',
      onOk() {
        console.log('退出系统');
      }
    })
  }

  return (
    <Header style={{boxShadow: '0 2px 8px #f0f1f2', zIndex: 99}}>
      <Row justify='space-between'>
        <div>
          <span style={{
            marginRight: 40,
            fontSize: 21,
            fontWeight: 500,
            verticalAlign: 'middle'
          }}>测试项目</span>
        </div>
        <span>
          刘娟娟
          <Button
            type="primary"
            shape="circle"
            icon={<LogoutOutlined/>}
            onClick={logout}
            style={{marginLeft: 10}}
          />
        </span>
      </Row>
    </Header>
  );
}
