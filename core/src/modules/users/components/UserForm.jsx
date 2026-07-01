import { useEffect } from "react";

import { Form, Input, Select } from "antd";

import { Button } from "@mui/material";

const { Option } = Select;

const UserForm = ({
  editingUser,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue(editingUser);
    } else {
      form.resetFields();
    }
  }, [editingUser, form]);

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
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Enter Name",
          },
        ]}
      >
        <Input placeholder="Enter Name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Enter Valid Email",
          },
        ]}
      >
        <Input placeholder="Enter Email" />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: "Select Role",
          },
        ]}
      >
        <Select placeholder="Select Role">
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
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[
          {
            required: true,
            message: "Select Status",
          },
        ]}
      >
        <Select placeholder="Select Status">
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </Form.Item>

      <Button
        type="submit"
        variant="contained"
      >
        {editingUser ? "Update User" : "Add User"}
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

export default UserForm;