import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tag, Statistic } from 'antd';
import {
  ProjectOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { projectsApi, workersApi, acceptancesApi } from '../api';
import type { Project, Worker, Acceptance } from '../types';
import dayjs from 'dayjs';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [acceptances, setAcceptances] = useState<Acceptance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, workersRes, acceptancesRes] = await Promise.all([
        projectsApi.getAll(),
        workersApi.getAll(),
        acceptancesApi.getAll(),
      ]);
      setProjects(projectsRes as any);
      setWorkers(workersRes as any);
      setAcceptances(acceptancesRes as any);
    } catch (error) {
      console.error('获取数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const inProgressProjects = projects.filter((p) => p.status === 'in_progress');
  const pendingAcceptances = acceptances.filter((a) => a.status === 'pending');

  const statusMap: Record<string, { color: string; text: string }> = {
    pending: { color: 'default', text: '待搭建' },
    in_progress: { color: 'processing', text: '搭建中' },
    accepted: { color: 'success', text: '已验收' },
    dismantling: { color: 'warning', text: '撤展中' },
    completed: { color: 'default', text: '已完成' },
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '展位号',
      dataIndex: 'boothNumber',
      key: 'boothNumber',
    },
    {
      title: '展馆',
      dataIndex: ['hall', 'name'],
      key: 'hall',
      render: (text: string) => text || '-',
    },
    {
      title: '进场时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const info = statusMap[status] || { color: 'default', text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="项目总数"
              value={projects.length}
              prefix={<ProjectOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="进行中项目"
              value={inProgressProjects.length}
              prefix={<PlayCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="人员总数"
              value={workers.length}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待验收项目"
              value={pendingAcceptances.length}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近项目" loading={loading}>
        <Table
          columns={columns}
          dataSource={projects.slice(0, 5)}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
