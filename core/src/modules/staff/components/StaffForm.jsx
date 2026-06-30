import { useEffect } from "react";

import {
  Form,
  Input,
  Select,
} from "antd";

import { Button } from "@mui/material";

const { Option } = Select;

const StaffForm = ({
  editingStaff,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingStaff) {
      form.setFieldsValue(editingStaff);
    } else {
      form.resetFields();
    }
  }, [editingStaff, form]);

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
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Department"
        name="department"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Designation"
        name="designation"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Option value="Doctor">
            Doctor
          </Option>

          <Option value="Nurse">
            Nurse
          </Option>

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
        {editingStaff
          ? "Update Staff"
          : "Add Staff"}
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
export default StaffForm;