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
  InputNumber,
  Switch,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
  Card,
  Image,
  List,
  Descriptions,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { dismantlesApi, projectsApi, damagePhotosApi } from '../api';
import type { Dismantle, Project, DismantleStatus, DepositStatus, DamagePhoto } from '../types';
import dayjs from 'dayjs';

const statusMap: Record<DismantleStatus, { color: string; text: string }> = {
  pending: { color: 'default', text: '待开始' },
  in_progress: { color: 'processing', text: '进行中' },
  damage_checked: { color: 'warning', text: '已验损' },
  waste_cleared: { color: 'success', text: '垃圾清运完成' },
  completed: { color: 'success', text: '已完成' },
};

const depositStatusMap: Record<DepositStatus, { color: string; text: string }> = {
  paid: { color: 'green', text: '已缴纳' },
  refunded: { color: 'blue', text: '已退还' },
  deducted: { color: 'orange', text: '已扣除' },
  pending: { color: 'default', text: '待缴纳' },
};

const Dismantles: React.FC = () => {
  const [dismantles, setDismantles] = useState<Dismantle[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [damagePhotos, setDamagePhotos] = useState<DamagePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingDismantle, setEditingDismantle] = useState<Dismantle | null>(null);
  const [detailDismantle, setDetailDismantle] = useState<Dismantle | null>(null);
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchDismantles = async () => {
    setLoading(true);
    try {
      const res = await dismantlesApi.getAll();
      setDismantles(res as any);
    } catch (error) {
      message.error('获取撤展列表失败');
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

  const fetchDamagePhotos = async (dismantleId: number) => {
    try {
      const res = await damagePhotosApi.getByDismantle(dismantleId);
      setDamagePhotos(res as any);
    } catch (error) {
      console.error('获取损坏照片失败', error);
    }
  };

  useEffect(() => {
    fetchDismantles();
    fetchProjects();
  }, []);

  const handleAdd = () => {
    setEditingDismantle(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Dismantle) => {
    setEditingDismantle(record);
    form.setFieldsValue({
      ...record,
      startTime: record.startTime ? dayjs(record.startTime) : null,
      endTime: record.endTime ? dayjs(record.endTime) : null,
    });
    setModalVisible(true);
  };

  const handleView = async (record: Dismantle) => {
    setDetailDismantle(record);
    await fetchDamagePhotos(record.id);
    setDetailVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await dismantlesApi.remove(id);
      message.success('删除成功');
      fetchDismantles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        startTime: values.startTime?.toISOString(),
        endTime: values.endTime?.toISOString(),
      };

      if (editingDismantle) {
        await dismantlesApi.update(editingDismantle.id, data);
        message.success('更新成功');
      } else {
        await dismantlesApi.create(data);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchDismantles();
    } catch (error) {
      console.error('提交失败', error);
    }
  };

  const filteredDismantles = dismantles.filter(
    (dismantle) => !statusFilter || dismantle.status === statusFilter,
  );

  const columns = [
    {
      title: '项目',
      dataIndex: ['project', 'name'],
      key: 'project',
      render: (text: string, record: Dismantle) => {
        const project = projects.find((p) => p.id === record.projectId);
        return project?.name || '-';
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text: string) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-'),
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-'),
    },
    {
      title: '押金',
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      render: (amount: number) => (amount ? `¥${amount}` : '-'),
    },
    {
      title: '押金状态',
      dataIndex: 'depositStatus',
      key: 'depositStatus',
      render: (status: DepositStatus) => {
        const info = depositStatusMap[status] || { color: 'default', text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: DismantleStatus) => {
        const info = statusMap[status] || { color: 'default', text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Dismantle) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该撤展记录吗?" onConfirm={() => handleDelete(record.id)}>
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
          新增撤展
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredDismantles} rowKey="id" loading={loading} />

      <Modal
        title={editingDismantle ? '编辑撤展' : '新增撤展'}
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
              <Form.Item name="startTime" label="开始时间">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="depositAmount" label="押金金额(元)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="depositStatus" label="押金状态" initialValue="pending">
                <Select>
                  {Object.entries(depositStatusMap).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value.text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="depositRefunded" label="已退还金额(元)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="damageDeduction" label="损坏扣费(元)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="damageDescription" label="损坏描述">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="wasteCleared" label="垃圾清运" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="wasteFee" label="垃圾清运费(元)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="wasteCompany" label="清运公司">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="wasteReceiptNo" label="清运单号">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item name="inspector" label="验损人">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="撤展详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {detailDismantle && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="项目">
                {projects.find((p) => p.id === detailDismantle.projectId)?.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[detailDismantle.status]?.color}>
                  {statusMap[detailDismantle.status]?.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">
                {detailDismantle.startTime
                  ? dayjs(detailDismantle.startTime).format('YYYY-MM-DD HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="结束时间">
                {detailDismantle.endTime
                  ? dayjs(detailDismantle.endTime).format('YYYY-MM-DD HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="押金金额">
                ¥{detailDismantle.depositAmount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="押金状态">
                <Tag color={depositStatusMap[detailDismantle.depositStatus]?.color}>
                  {depositStatusMap[detailDismantle.depositStatus]?.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="损坏扣费">
                ¥{detailDismantle.damageDeduction || 0}
              </Descriptions.Item>
              <Descriptions.Item label="已退还">
                ¥{detailDismantle.depositRefunded || 0}
              </Descriptions.Item>
            </Descriptions>

            <Card title="损坏照片" size="small">
              {damagePhotos.length > 0 ? (
                <List
                  grid={{ gutter: 16, column: 3 }}
                  dataSource={damagePhotos}
                  renderItem={(photo) => (
                    <List.Item>
                      <Card
                        hoverable
                        cover={
                          <Image
                            src={photo.photoUrl}
                            alt={photo.description}
                            height={120}
                            style={{ objectFit: 'cover' }}
                          />
                        }
                      >
                        <Card.Meta
                          title={photo.location}
                          description={
                            <div>
                              <p style={{ margin: 0, fontSize: 12 }}>{photo.description}</p>
                              <p style={{ margin: 0, fontSize: 12, color: '#f5222d' }}>
                                预估: ¥{photo.estimatedCost}
                              </p>
                            </div>
                          }
                        />
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: 20 }}>暂无损坏照片</p>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dismantles;
