import React, { use } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Image from 'next/image';
import { Layout as AntdLayout, Breadcrumb, Menu, theme, Dropdown, Space } from 'antd';
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { DownOutlined } from '@ant-design/icons';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
        label: "图书管理",
        key: 'book',
        children: [
            { label: '图书列表', key: '/book' },
            { label: '图书添加', key: '/book/add' },
        ]
    },
    {
        label: '借阅管理',
        key: 'borrow',
        children: [
            { label: '借阅列表', key: '/borrow' },
            { label: '借阅添加', key: '/borrow/add' },
        ]
    },
    {
        label: '分类管理',
        key: 'category',
        children: [
            { label: '分类列表', key: '/category' },
            { label: '分类添加', key: '/category/add' },
        ]
    },
    {
        label: '用户管理',
        key: 'user',
        children: [
            { label: '分类列表', key: '/user' },
            { label: '分类添加', key: '/user/add' },
        ]
    }
]

const USER_ITEMS: MenuProps['items'] = [
    {
        label: "用户中心",
        key: '0',
    },
    {
        label: "登出",
        key: '1',
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        // console.log('click ', item);
        router.push(key);
    }
    return (
        <AntdLayout>
            <Header className={styles.header}>
                <Image src="/logo.svg" alt='' width={60} height={60} className={styles.logo}></Image>
                SW图书管理系统
                <span className={styles.user}>
                    <Dropdown menu={{ items: USER_ITEMS }}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                管理员
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </span>
            </Header>
            <AntdLayout className={styles.sectionInner}>
                <Sider width={200}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['/book']} // 默认选中项
                        defaultOpenKeys={['book']} // 默认打开的子菜单
                        style={{ height: '100%', borderInlineEnd: 0 }}
                        items={ITEMS}
                        onClick={handleMenuClick}
                    />
                </Sider>
                <AntdLayout className={styles.sectionContent}>
                    <Content className={styles.content}>
                        {children}
                    </Content>
                </AntdLayout>
            </AntdLayout>
        </AntdLayout>
    )
}