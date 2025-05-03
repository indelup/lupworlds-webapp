import { useStore, AppState } from "src/hooks/useStore";
import { useCheckUser } from "src/hooks/useCheckUser";
import { useState } from "react";
import { Characters } from "./Characters";
import { Materials } from "./Materials";
import { Banners } from "./Banners";
import { Stores } from "./Stores";
import classes from "./StreamerApp.module.scss";

import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import {
    RadarChartOutlined,
    GoldOutlined,
    FireOutlined,
    ShoppingCartOutlined,
    TwitchOutlined,
    SettingOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem => {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
};

const items: MenuItem[] = [
    getItem("Characters", "characters", <RadarChartOutlined />),
    getItem("Materials", "materials", <GoldOutlined />),
    getItem("Banners", "banners", <FireOutlined />),
    getItem("Stores", "stores", <ShoppingCartOutlined />),
    getItem("Twitch Config", "twitch", <TwitchOutlined />),
    getItem("Settings", "settings", <SettingOutlined />),
];

export const StreamerApp = () => {
    const user = useStore((state: AppState) => state.user);
    const [view, setView] = useState<string>("characters");
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const ActiveView = getActiveView(view);

    useCheckUser();

    return (
        <Layout className={classes.layout}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className={classes.logoContainer}>
                    <img className={classes.logo} src="/indelup_iso.png" />
                </div>
                <Menu
                    theme="dark"
                    selectedKeys={[view]}
                    mode="inline"
                    items={items}
                    onClick={(e) => {
                        setView(e.key);
                    }}
                />
            </Sider>
            <Layout>
                <Header />
                <Content className={classes.background}>
                    <div className={classes.content}>
                        <ActiveView />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

const getActiveView = (view: string) => {
    switch (view) {
        case "charaters":
            return Characters;
        case "materials":
            return Materials;
        case "banners":
            return Banners;
        case "stores":
            return Stores;
        default:
            return Characters;
    }
};
