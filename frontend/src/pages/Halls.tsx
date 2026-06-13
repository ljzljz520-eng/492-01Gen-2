import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  InputNumber,
  Switch,
  Tag,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { hallsApi } from '../api';
import type { Hall } from '../types';

const Halls: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const res = await hallsApi.getAll();
      setHalls(res as any);
    } catch (error) {
      message.error('获取展馆列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const handleAdd = () => {
    setEditingHall(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Hall) => {
    setEditingHall(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await hallsApi.remove(id);
      message.success('删除成功');
      fetchHalls();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingHall) {
        await hallsApi.update(editingHall.id, values);
        message.success('更新成功');
      } else {
        await hallsApi.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchHalls();
    } catch (error) {
      console.error('提交失败', error);
    }
  };

  const filteredHalls = halls.filter(
    (hall) =>
      hall.name.toLowerCase().includes(searchText.toLowerCase()) ||
      hall.location.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: '展馆名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '展位数量',
      dataIndex: 'boothCount',
      key: 'boothCount',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? '启用' : '停用'}</Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Hall) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该展馆吗?" onConfirm={() => handleDelete(record.id)}>
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
        <Input
          placeholder="搜索展馆名称或位置"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增展馆
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredHalls} rowKey="id" loading={loading} />

      <Modal
        title={editingHall ? '编辑展馆' : '新增展馆'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="展馆名称" rules={[{ required: true, message: '请输入展馆名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="位置" rules={[{ required: true, message: '请输入位置' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="boothCount" label="展位数量" rules={[{ required: true, message: '请输入展位数量' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="isActive" label="是否启用" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Halls;
