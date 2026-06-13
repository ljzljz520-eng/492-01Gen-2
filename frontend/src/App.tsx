import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  BuildOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Halls from './pages/Halls';
import Workers from './pages/Workers';
import Schedules from './pages/Schedules';
import Acceptances from './pages/Acceptances';
import Dismantles from './pages/Dismantles';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '工作台',
  },
  {
    key: '/projects',
    icon: <ProjectOutlined />,
    label: '项目管理',
  },
  {
    key: '/halls',
    icon: <BuildOutlined />,
    label: '展馆管理',
  },
  {
    key: '/workers',
    icon: <TeamOutlined />,
    label: '人员管理',
  },
  {
    key: '/schedules',
    icon: <CalendarOutlined />,
    label: '排班调度',
  },
  {
    key: '/acceptances',
    icon: <CheckCircleOutlined />,
    label: '验收管理',
  },
  {
    key: '/dismantles',
    icon: <ToolOutlined />,
    label: '撤展管理',
  },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: collapsed ? 12 : 16,
            fontWeight: 'bold',
          }}
        >
          {collapsed ? '会展' : '会展展台搭建调度'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {menuItems.find((item) => item.key === location.pathname)?.label || '工作台'}
          </div>
          <div style={{ color: '#666' }}>管理员</div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/halls" element={<Halls />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/schedules" element={<Schedules />} />
            <Route path="/acceptances" element={<Acceptances />} />
            <Route path="/dismantles" element={<Dismantles />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
