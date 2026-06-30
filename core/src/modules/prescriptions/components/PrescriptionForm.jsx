import { useEffect } from "react";

import {
  Form,
  Input,
  DatePicker,
} from "antd";

import { Button } from "@mui/material";

const PrescriptionForm = ({
  editingPrescription,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingPrescription) {
      form.setFieldsValue(
        editingPrescription
      );
    } else {
      form.resetFields();
    }
  }, [
    editingPrescription,
    form,
  ]);

  const handleFinish = (
    values
  ) => {
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
        label="Patient Name"
        name="patientName"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Doctor Name"
        name="doctorName"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Medicine"
        name="medicine"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.TextArea
          rows={3}
        />
      </Form.Item>

      <Form.Item
        label="Prescription Date"
        name="date"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker
          style={{
            width: "100%",
          }}

          getPopupContainer={(trigger) =>
            trigger.parentElement
          }
        />
      </Form.Item>

      <Button
        type="submit"
        variant="contained"
      >
        {editingPrescription
          ? "Update Prescription"
          : "Add Prescription"}
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

export default PrescriptionForm;