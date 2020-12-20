import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';
import YSider from './part/YSider';
import YHeader from './part/YHeader';
import YInfo from './part/YInfo';

const {Content} = Layout;

export default function App() {
  return (
    <Router>
      <Layout style={{flexDirection: 'column', overflow: 'hidden'}}>
        <YHeader/>
        <Layout>
          <YSider />
          <Content style={{padding: '20px 40px'}}>
            <YInfo/>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}