import { Button, Col, Form, Input, Row, Select, Space, Table, TablePaginationConfig, Image, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { use, useEffect, useState } from 'react';
import styles from './index.module.css';
import axios from 'axios';
import dayjs from 'dayjs';
import { getBookList } from '@/api/book';
import { BookQueryType } from '@/type';


const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '3',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '4',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '5',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '6',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '7',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '8',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '9',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '10',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '11',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '12',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const COLUMNS = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: '封面',
    dataIndex: 'cover',
    key: 'cover',
    width: 120,
    render: (text: string) => {
      return <Image
        width={100}
        src={text}
        alt=""
      />
    }
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
    width: 120,
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 80,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    ellipsis: true,
    render: (text: string) => {
      return <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    }
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    key: 'CreatedAt',
    width: 130,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  }
];

export default function Home() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0
  })

  useEffect(() => {
    async function fetchData() {
      const list = await getBookList({ current: 1, pageSize: pagination.pageSize })
      const { data } = list;
      setData(data);
    }
    fetchData();
  }, [])

  const handleSearchFinish = async (values?: BookQueryType) => {
    const res = await getBookList({ ...values, current: 1, pageSize: pagination.pageSize });
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  }

  const handleSearchReset = () => {
    form.resetFields();
  }

  const handleBookEdit = () => {
    router.push('/book/edit/id');
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination)
    const query = form.getFieldsValue();
    getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
  }

  const columns = [...COLUMNS,
  {
    title: '操作', key: 'action', render: (text: any, row: any) => {
      return <Space>
        <Button type='link' onClick={handleBookEdit}>编辑</Button>
        <Button type='link' danger>删除</Button>
      </Space>
    }
  }
  ]


  return <>
    <Form
      name="search"
      form={form}
      onFinish={handleSearchFinish}
      initialValues={{
        name: '', author: '', category: ''
      }}
    >
      <Row gutter={25}>
        <Col span={5}>
          <Form.Item name="name" label="名称" >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="author" label="作者">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="category" label="分类">
            <Select
              placeholder="请选择"
              allowClear
              showSearch
              style={{ width: 100 }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
                { value: 'disabled', label: 'Disabled', disabled: true },
              ]} />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button htmlType="submit" onClick={handleSearchReset}>
                清空
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
    <div className={styles.tableWrap}>
      <Table
        dataSource={data}
        columns={columns}
        scroll={{ x: 1000 }}
        onChange={handleTableChange}
        pagination={{ ...pagination, showTotal: () => `共 ${pagination.total} 条数据` }}
      />
    </div>
  </>;

}
