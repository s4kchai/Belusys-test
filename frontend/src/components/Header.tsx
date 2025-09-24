import { Layout, Typography, Menu, Dropdown, Avatar, Space } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const userMenuItems: MenuProps["items"] = [
  {
    key: "profile",
    label: "Profile",
    icon: <UserOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: "Logout",
    icon: <LogoutOutlined />,
    danger: true,
  },
];

const navItems: MenuProps["items"] = [
  { key: "/classroom", label: "Classrooms" },
  { key: "/student", label: "Students" },
];

export function AppHeader() {
  const navigate = useNavigate();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  return (
    <Header
      style={{
        paddingInline: 24,
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          School Admin
        </Title>

        <Menu
          mode="horizontal"
          items={navItems}
          style={{ minWidth: 280 }}
          selectable
          defaultSelectedKeys={["/"]}
          onClick={handleMenuClick}
        />

        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <Space style={{ cursor: "pointer" }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <span style={{ color: "#1f1f1f" }}>Sakchai</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
}
