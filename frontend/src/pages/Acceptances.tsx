import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Select,
  Modal,
  Form,
  DatePicker,
  Input,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
  Rate,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { acceptancesApi, projectsApi } from '../api';
import type { Acceptance, Project, AcceptanceStatus } from '../types';
import dayjs from 'dayjs';

const statusMap: Record<AcceptanceStatus, { color: string; text: string }> = {
  pending: { color: 'default', text: '待验收' },
  passed: { color: 'success', text: '通过' },
  failed: { color: 'error', text: '不通过' },
  recheck: { color: 'warning', text: '复检' },
};

const Acceptances: React.FC = () => {
  const [acceptances, setAcceptances] = useState<Acceptance[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAcceptance, setEditingAcceptance] = useState<Acceptance | null>(null);
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchAcceptances = async () => {
    setLoading(true);
    try {
      const res = await acceptancesApi.getAll();
      setAcceptances(res as any);
    } catch (error) {
      message.error('获取验收列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.getAll();
      setProjects(res as any);
    } catch (error) {
      console.error('获取项目列表失败', error);
    }
  };

  useEffect(() => {
    fetchAcceptances();
    fetchProjects();
  }, []);

  const handleAdd = () => {
    setEditingAcceptance(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Acceptance) => {
    setEditingAcceptance(record);
    form.setFieldsValue({
      ...record,
      inspectionTime: record.inspectionTime ? dayjs(record.inspectionTime) : null,
      rectificationDeadline: record.rectificationDeadline ? dayjs(record.rectificationDeadline) : null,
      woodworkQuality: Number(record.woodworkQuality) || 0,
      electricalSafety: Number(record.electricalSafety) || 0,
      decorationQuality: Number(record.decorationQuality) || 0,
      fireSafety: Number(record.fireSafety) || 0,
      overallScore: Number(record.overallScore) || 0,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await acceptancesApi.remove(id);
      message.success('删除成功');
      fetchAcceptances();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        inspectionTime: values.inspectionTime?.toISOString(),
        rectificationDeadline: values.rectificationDeadline?.toISOString(),
        woodworkQuality: String(values.woodworkQuality),
        electricalSafety: String(values.electricalSafety),
        decorationQuality: String(values.decorationQuality),
        fireSafety: String(values.fireSafety),
        overallScore: String(values.overallScore),
      };

      if (editingAcceptance) {
        await acceptancesApi.update(editingAcceptance.id, data);
        message.success('更新成功');
      } else {
        await acceptancesApi.create(data);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchAcceptances();
    } catch (error) {
      console.error('提交失败', error);
    }
  };

  const filteredAcceptances = acceptances.filter(
    (acceptance) => !statusFilter || acceptance.status === statusFilter,
  );

  const columns = [
    {
      title: '项目',
      dataIndex: ['project', 'name'],
      key: 'project',
      render: (text: string, record: Acceptance) => {
        const project = projects.find((p) => p.id === record.projectId);
        return project?.name || '-';
      },
    },
    {
      title: '验收时间',
      dataIndex: 'inspectionTime',
      key: 'inspectionTime',
      render: (text: string) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-'),
    },
    {
      title: '验收人',
      dataIndex: 'inspector',
      key: 'inspector',
    },
    {
      title: '综合评分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      render: (score: string) => score || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: AcceptanceStatus) => {
        const info = statusMap[status] || { color: 'default', text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Acceptance) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该验收记录吗?" onConfirm={() => handleDelete(record.id)}>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增验收
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredAcceptances} rowKey="id" loading={loading} />

      <Modal
        title={editingAcceptance ? '编辑验收' : '新增验收'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="projectId" label="项目" rules={[{ required: true, message: '请选择项目' }]}>
            <Select placeholder="请选择项目">
              {projects.map((project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="inspectionTime" label="验收时间" rules={[{ required: true, message: '请选择验收时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="inspector" label="验收人" rules={[{ required: true, message: '请输入验收人' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="woodworkQuality" label="木工质量" initialValue={0}>
            <Rate count={5} />
          </Form.Item>
          <Form.Item name="electricalSafety" label="电气安全" initialValue={0}>
            <Rate count={5} />
          </Form.Item>
          <Form.Item name="decorationQuality" label="美工质量" initialValue={0}>
            <Rate count={5} />
          </Form.Item>
          <Form.Item name="fireSafety" label="消防" initialValue={0}>
            <Rate count={5} />
          </Form.Item>
          <Form.Item name="overallScore" label="综合评分" initialValue={0}>
            <Rate count={5} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="pending">
            <Select>
              {Object.entries(statusMap).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="issues" label="存在问题">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="rectificationDeadline" label="整改截止日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Acceptances;
