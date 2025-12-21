import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout as AntdLayout, Breadcrumb, Menu, theme } from 'antd';
import styles from './index.module.css';

const { Header, Content, Sider } = AntdLayout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,
            children: Array.from({ length: 4 }).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);

const ITEMS = [
    {
        label : "图书管理",
        key : 'book',
        children : [
            {label : '图书列表', key : '/book'},
            {label : '图书添加', key : '/book/add'},
        ]
    },
    {
        label : '借阅管理',
        key : 'borrow',
        children : [
            {label : '借阅列表', key : '/borrow'},
            {label : '借阅添加', key : '/borrow/add'},
        ]
    },
    {
        label : '分类管理',
        key : 'category',
        children : [
            {label : '分类列表', key : '/category'},
            {label : '分类添加', key : '/category/add'},
        ]
    },
    {
        label : '用户管理',
        key : 'user',
        children : [
            {label : '分类列表', key : '/user'},
            {label : '分类添加', key : '/user/add'},
        ]
    }
]

export function Layout({ children }) {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    
    return(
    <AntdLayout>
        <Header className = {styles.header}>
            <div className = {styles.logo}>
                <img src="/logo.svg" width={20} height={20} alt="logo" />
                sw图书管理系统</div>
        </Header>
            <AntdLayout>
            <Sider width={200} style={{ background: colorBgContainer }}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%', borderInlineEnd: 0 }}
                    items={ITEMS}
                />
            </Sider>
                <AntdLayout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb
                    items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                    style={{ margin: '16px 0' }}
                />
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    content
                    {children};
                </Content>
                </AntdLayout>
            </AntdLayout>
        </AntdLayout>
    )
}