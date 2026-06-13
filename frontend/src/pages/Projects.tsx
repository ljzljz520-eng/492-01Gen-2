import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Switch,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { projectsApi, hallsApi } from '../api';
import type { Project, Hall, ProjectStatus } from '../types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const statusMap: Record<ProjectStatus, { color: string; text: string }> = {
    pending: { color: 'default', text: '待搭建' },
    in_progress: { color: 'processing', text: '搭建中' },
    accepted: { color: 'success', text: '已验收' },
    dismantling: { color: 'warning', text: '撤展中' },
    completed: { color: 'default', text: '已完成' },
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectsApi.getAll();
      setProjects(res as any);
    } catch (error) {
      message.error('获取项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchHalls = async () => {
    try {
      const res = await hallsApi.getAll();
      setHalls(res as any);
    } catch (error) {
      console.error('获取展馆列表失败', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchHalls();
  }, []);

  const handleAdd = () => {
    setEditingProject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Project) => {
    setEditingProject(record);
    form.setFieldsValue({
      ...record,
      entryTime: record.entryTime ? dayjs(record.entryTime) : null,
      buildDeadline: record.buildDeadline ? dayjs(record.buildDeadline) : null,
      dismantleStartTime: record.dismantleStartTime ? dayjs(record.dismantleStartTime) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await projectsApi.remove(id);
      message.success('删除成功');
      fetchProjects();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        entryTime: values.entryTime?.toISOString(),
        buildDeadline: values.buildDeadline?.toISOString(),
        dismantleStartTime: values.dismantleStartTime?.toISOString(),
      };

      if (editingProject) {
        await projectsApi.update(editingProject.id, data);
        message.success('更新成功');
      } else {
        await projectsApi.create(data);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchProjects();
    } catch (error) {
      console.error('提交失败', error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchName = project.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || project.status === statusFilter;
    return matchName && matchStatus;
  });

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
      render: (text: string, record: Project) => {
        const hall = halls.find((h) => h.id === record.hallId);
        return hall?.name || '-';
      },
    },
    {
      title: '进场时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render: (text: string) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProjectStatus) => {
        const info = statusMap[status] || { color: 'default', text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Project) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该项目吗?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="搜索项目名称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="筛选状态"
            value={statusFilter || undefined}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            allowClear
          >
            {Object.entries(statusMap).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value.text}
              </Select.Option>
            ))}
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增项目
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProjects}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingProject ? '编辑项目' : '新增项目'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Row>
            <Col span={12}>
              <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="boothNumber" label="展位号" rules={[{ required: true, message: '请输入展位号' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="hallId" label="展馆" rules={[{ required: true, message: '请选择展馆' }]}>
                <Select placeholder="请选择展馆">
                  {halls.map((hall) => (
                    <Select.Option key={hall.id} value={hall.id}>
                      {hall.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="boothArea" label="展位面积(㎡)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="entryTime" label="进场时间" rules={[{ required: true, message: '请选择进场时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="buildDeadline" label="搭建截止时间">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dismantleStartTime" label="撤展开始时间">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" initialValue="pending">
                <Select>
                  {Object.entries(statusMap).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value.text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="carpenterNeeded" label="需木工(人)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="electricianNeeded" label="需电工(人)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="decoratorNeeded" label="需美工(人)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="forkliftNeeded" label="需叉车司机(人)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nightWorkRequired" label="需要夜间施工" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="projectManager" label="项目经理">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="clientName" label="客户名称">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="项目描述">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
