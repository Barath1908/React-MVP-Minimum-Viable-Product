import { useEffect } from "react";

import {
  Form,
  Input,
  Select,
} from "antd";

import { Button } from "@mui/material";

const { Option } = Select;

const RoleForm = ({
  editingRole,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingRole) {
      form.setFieldsValue(editingRole);
    } else {
      form.resetFields();
    }
  }, [editingRole, form]);

  const handleFinish = (values) => {
    onSubmit(values);

    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Role Name"
        name="roleName"
        rules={[
          {
            required: true,
            message:
              "Enter Role Name",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea
          rows={3}
        />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Option value="Active">
            Active
          </Option>

          <Option value="Inactive">
            Inactive
          </Option>
        </Select>
      </Form.Item>

      <Button
        type="submit"
        variant="contained"
      >
        {editingRole
          ? "Update Role"
          : "Add Role"}
      </Button>

      <Button
        variant="outlined"
        sx={{ ml: 2 }}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default RoleForm;