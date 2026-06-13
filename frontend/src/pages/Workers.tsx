import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Switch,
  Tag,
  message,
  Popconfirm,
  DatePicker,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { workersApi } from '../api';
import type { Worker, WorkerType } from '../types';
import dayjs from 'dayjs';

const workerTypeMap: Record<WorkerType, string> = {
  carpenter: '木工',
  electrician: '电工',
  decorator: '美工',
  forklift_driver: '叉车司机',
};

const Workers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await workersApi.getAll();
      setWorkers(res as any);
    } catch (error) {
      message.error('获取人员列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleAdd = () => {
    setEditingWorker(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Worker) => {
    setEditingWorker(record);
    form.setFieldsValue({
      ...record,
      certificateExpiry: record.certificateExpiry ? dayjs(record.certificateExpiry) : null,
      nightWorkPermitExpiry: record.nightWorkPermitExpiry ? dayjs(record.nightWorkPermitExpiry) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await workersApi.remove(id);
      message.success('删除成功');
      fetchWorkers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        certificateExpiry: values.certificateExpiry?.toISOString(),
        nightWorkPermitExpiry: values.nightWorkPermitExpiry?.toISOString(),
      };

      if (editingWorker) {
        await workersApi.update(editingWorker.id, data);
        message.success('更新成功');
      } else {
        await workersApi.create(data);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchWorkers();
    } catch (error) {
      console.error('提交失败', error);
    }
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchSearch =
      worker.name.toLowerCase().includes(searchText.toLowerCase()) ||
      worker.phone.includes(searchText);
    const matchType = !typeFilter || worker.type === typeFilter;
    return matchSearch && matchType;
  });

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '工种',
      dataIndex: 'type',
      key: 'type',
      render: (type: WorkerType) => workerTypeMap[type] || type,
    },
    {
      title: '是否有证',
      dataIndex: 'hasCertificate',
      key: 'hasCertificate',
      render: (hasCert: boolean) => (
        <Tag color={hasCert ? 'green' : 'red'}>{hasCert ? '是' : '否'}</Tag>
      ),
    },
    {
      title: '夜间施工许可',
      dataIndex: 'hasNightWorkPermit',
      key: 'hasNightWorkPermit',
      render: (hasPermit: boolean) => (
        <Tag color={hasPermit ? 'green' : 'red'}>{hasPermit ? '有' : '无'}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable: boolean) => (
        <Tag color={isAvailable ? 'green' : 'orange'}>{isAvailable ? '在职' : '离岗'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Worker) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该人员吗?" onConfirm={() => handleDelete(record.id)}>
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
            placeholder="搜索姓名或电话"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="筛选工种"
            value={typeFilter || undefined}
            onChange={setTypeFilter}
            style={{ width: 150 }}
            allowClear
          >
            {Object.entries(workerTypeMap).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增人员
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredWorkers} rowKey="id" loading={loading} />

      <Modal
        title={editingWorker ? '编辑人员' : '新增人员'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="工种" rules={[{ required: true, message: '请选择工种' }]}>
                <Select>
                  {Object.entries(workerTypeMap).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="idCard" label="身份证号">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="hasCertificate" label="是否有证" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="certificateNumber" label="证件编号">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="certificateExpiry" label="证件有效期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hasNightWorkPermit" label="夜间施工许可" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nightWorkPermitExpiry" label="夜间施工许可有效期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isAvailable" label="是否在职" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="skills" label="技能特长">
            <Input />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Workers;
