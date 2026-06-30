import {
  Table,
  Tag,
  Space,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { Button } from "@mui/material";

const RoleTable = ({
  roles,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Role",
      dataIndex: "roleName",
    },

    {
      title: "Description",
      dataIndex:
        "description",
    },

    {
      title: "Status",
      dataIndex: "status",

      render: (status) => (
        <Tag
          color={
            status === "Active"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },

    {
      title: "Actions",

      render: (_, record) => (
        <Space>
          <Button
            variant="contained"
            startIcon={
              <EditOutlined />
            }
            onClick={() =>
              onEdit(record)
            }
          >
            Edit
          </Button>

          <Button
            color="error"
            variant="contained"
            startIcon={
              <DeleteOutlined />
            }
            onClick={() =>
              onDelete(record.id)
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={roles}
      loading={loading}
    />
  );
};

export default RoleTable;