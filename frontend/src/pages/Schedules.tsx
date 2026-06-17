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
  Switch,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { schedulesApi, projectsApi, workersApi } from '../api';
import type { Schedule, Project, Worker, ScheduleShift, ScheduleStatus } from '../types';
import dayjs from 'dayjs';

const shiftMap: Record<ScheduleShift, string> = {
  morning: '早班',
  afternoon: '中班',
  night: '晚班',
};

const statusMap: Record<ScheduleStatus, { color: string; text: string }> = {
  scheduled: { color: 'default', text: '已排班' },
  in_progress: { color: 'processing', text: '进行中' },
  completed: { color: 'success', text: '已完成' },
  cancelled: { color: 'error', text: '已取消' },
};

const Schedules: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form] = Form.useForm();
  const [projectFilter, setProjectFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [formValues, setFormValues] = useState<any>({});

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await schedulesApi.getAll();
      setSchedules(res as any);
    } catch (error) {
      message.error('获取排班列表失败');
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

  const fetchWorkers = async () => {
    try {
      const res = await workersApi.getAll();
      setWorkers(res as any);
    } catch (error) {
      console.error('获取人员列表失败', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchProjects();
    fetchWorkers();
  }, []);

  const handleAdd = () => {
    setEditingSchedule(null);
    form.resetFields();
    setSelectedWorker(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Schedule) => {
    setEditingSchedule(record);
    const worker = workers.find((w) => w.id === record.workerId);
    setSelectedWorker(worker || null);
    form.setFieldsValue({
      ...record,
      workDate: record.workDate ? dayjs(record.workDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await schedulesApi.remove(id);
      message.success('删除成功');
      fetchSchedules();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const filteredWorkers = workers.filter((w) => {
    if (!w.isAvailable) return false;
    if (!w.hasCertificate) return false;
    const isNightShift = formValues.shift === 'night' || formValues.nightWork;
    if (isNightShift && !w.hasNightWorkPermit) return false;
    return true;
  });

  const handleWorkerChange = (workerId: number) => {
    const worker = workers.find((w) => w.id === workerId);
    setSelectedWorker(worker || null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        workDate: values.workDate?.toISOString(),
      };

      const worker = workers.find((w) => w.id === values.workerId);
      if (worker) {
        if (!worker.hasCertificate) {
          message.warning('该人员没有相关证件，请确认是否继续排班');
        }
        if (data.nightWork && !worker.hasNightWorkPermit) {
          Modal.confirm({
            title: '夜间施工许可校验',
            icon: <ExclamationCircleOutlined />,
            content: '该人员没有夜间施工许可，是否继续排班？',
            onOk: async () => {
              await submitSchedule(data);
            },
          });
          return;
        }
      }

      await submitSchedule(data);
    } catch (error) {
      console.error('提交失败', error);
    }
  };

  const submitSchedule = async (data: any) => {
    try {
      if (editingSchedule) {
        await schedulesApi.update(editingSchedule.id, data);
        message.success('更新成功');
      } else {
        await schedulesApi.create(data);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchSchedules();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || '操作失败';
      message.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchProject = !projectFilter || schedule.projectId === projectFilter;
    const matchStatus = !statusFilter || schedule.status === statusFilter;
    return matchProject && matchStatus;
  });

  const columns = [
    {
      title: '项目',
      dataIndex: ['project', 'name'],
      key: 'project',
      render: (text: string, record: Schedule) => {
        const project = projects.find((p) => p.id === record.projectId);
        return project?.name || '-';
      },
    },
    {
      title: '人员',
      dataIndex: ['worker', 'name'],
      key: 'worker',
      render: (text: string, record: Schedule) => {
        const worker = workers.find((w) => w.id === record.workerId);
        return worker?.name || '-';
      },
    },
    {
      title: '日期',
      dataIndex: 'workDate',
      key: 'workDate',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: '班次',
      dataIndex: 'shift',
      key: 'shift',
      render: (shift: ScheduleShift) => shiftMap[shift] || shift,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ScheduleStatus) => {
        const info = statusMap[status] || { color: 'default', text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '夜间施工',
      dataIndex: 'nightWork',
      key: 'nightWork',
      render: (nightWork: boolean) => (
        <Tag color={nightWork ? 'orange' : 'default'}>{nightWork ? '是' : '否'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Schedule) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该排班吗?" onConfirm={() => handleDelete(record.id)}>
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
          <Select
            placeholder="筛选项目"
            value={projectFilter || undefined}
            onChange={(value) => setProjectFilter(value)}
            style={{ width: 200 }}
            allowClear
          >
            {projects.map((project) => (
              <Select.Option key={project.id} value={project.id}>
                {project.name}
              </Select.Option>
            ))}
          </Select>
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
          新增排班
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredSchedules} rowKey="id" loading={loading} />

      <Modal
        title={editingSchedule ? '编辑排班' : '新增排班'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onValuesChange={(changed) => {
          setFormValues((prev: any) => ({ ...prev, ...changed }));
        }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="projectId" label="项目" rules={[{ required: true, message: '请选择项目' }]}>
                <Select placeholder="请选择项目">
                  {projects.map((project) => (
                    <Select.Option key={project.id} value={project.id}>
                      {project.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="workerId" label="人员" rules={[{ required: true, message: '请选择人员' }]}>
                <Select
                  placeholder="请选择人员"
                  onChange={handleWorkerChange}
                  notFoundContent="暂无符合条件的人员（需有证、可用，夜班需夜间许可）"
                >
                  {filteredWorkers.map((worker) => (
                    <Select.Option key={worker.id} value={worker.id}>
                      {worker.name} - {worker.type === 'carpenter' ? '木工' : worker.type === 'electrician' ? '电工' : worker.type === 'decorator' ? '美工' : '叉车司机'}
                      {!worker.hasNightWorkPermit && ' (无夜工许可)'}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {selectedWorker && (
            <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
              <p style={{ margin: '4px 0' }}>
                <strong>证件：</strong>
                <Tag color={selectedWorker.hasCertificate ? 'green' : 'red'}>
                  {selectedWorker.hasCertificate ? '有证' : '无证'}
                </Tag>
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>夜间施工许可：</strong>
                <Tag color={selectedWorker.hasNightWorkPermit ? 'green' : 'red'}>
                  {selectedWorker.hasNightWorkPermit ? '有' : '无'}
                </Tag>
              </p>
            </div>
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="workDate" label="工作日期" rules={[{ required: true, message: '请选择日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="shift" label="班次" rules={[{ required: true, message: '请选择班次' }]}>
                <Select>
                  {Object.entries(shiftMap).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间">
                <Input placeholder="例如: 08:00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间">
                <Input placeholder="例如: 17:00" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="状态" initialValue="scheduled">
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
              <Form.Item name="nightWork" label="夜间施工" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="workContent" label="工作内容">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="needTools" label="需要工具" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="tools" label="工具说明">
            <Input />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Schedules;
