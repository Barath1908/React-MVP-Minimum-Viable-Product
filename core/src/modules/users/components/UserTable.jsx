import { useMemo, useState } from "react";

import { Table, Input, Select, Space, Button, Tag } from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const UserTable = ({
  users,
  loading,
  onEdit,
  onDelete,
}) => {

  const [searchText, setSearchText] = useState("");

  const [roleFilter, setRoleFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const filteredUsers = useMemo(() => {

    return users.filter((user) => {

      const matchesSearch =
        user.id.toString().includes(searchText) ||
        user.name.toLowerCase().includes(searchText.toLowerCase());

      const matchesRole =
        roleFilter === "" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;

    });

  }, [users, searchText, roleFilter, statusFilter]);

  const columns = [

    {
      title: "ID",
      dataIndex: "id",
      key: "id",

      sorter: (a, b) => a.id - b.id,
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",

      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },

    {
      title: "Actions",
      key: "actions",

      render: (_, record) => (

        <Space>

          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          >
            Delete
          </Button>

        </Space>

      ),
    },

  ];

  return (

    <>

      <Space
        style={{
          marginBottom: 20,
          width: "100%",
          justifyContent: "space-between",
        }}
      >

        <Search

          placeholder="Search by ID or Name"

          allowClear

          style={{ width: 300 }}

          onChange={(e) =>
            setSearchText(e.target.value)
          }

        />

        <Space>

          <Select

            placeholder="Role"

            style={{ width: 180 }}

            allowClear

            onChange={(value) =>
              setRoleFilter(value || "")
            }

          >

            <Option value="Admin">Admin</Option>

            <Option value="Doctor">Doctor</Option>

            <Option value="Nurse">Nurse</Option>

            <Option value="Receptionist">
              Receptionist
            </Option>

            <Option value="Pharmacist">
              Pharmacist
            </Option>

          </Select>

          <Select

            placeholder="Status"

            style={{ width: 150 }}

            allowClear

            onChange={(value) =>
              setStatusFilter(value || "")
            }

          >

            <Option value="Active">
              Active
            </Option>

            <Option value="Inactive">
              Inactive
            </Option>

          </Select>

        </Space>

      </Space>

      <Table

        rowKey="id"

        columns={columns}

        dataSource={filteredUsers}

        loading={loading}

        pagination={{
          pageSize: 5,
          showSizeChanger: false,
        }}

      />

    </>

  );

};

export default UserTable;