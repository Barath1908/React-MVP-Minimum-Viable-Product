import {
  useEffect,
  useState,
} from "react";

import {
  Card,
  Form,
  Input,
  List,
  Button,
} from "antd";

import useNotifications from "../hooks/useNotification";

const NotificationManagement =
  () => {
    const {
      notifications,
      loading,
      fetchNotifications,
      createNotification,
      deleteNotification,
    } = useNotifications();

    const [form] =
      Form.useForm();

    const [open,
      setOpen] =
      useState(false);

    useEffect(() => {
      fetchNotifications();
    }, []);

    const handleSubmit = (
      values
    ) => {
      createNotification(
        values
      );

      form.resetFields();

      setOpen(false);
    };

    return (
      <div
        style={{
          padding: 20,
        }}
      >
        <Card title="Notifications">
          <Button
            type="primary"
            onClick={() =>
              setOpen(true)
            }
          >
            Create Notification
          </Button>

          {open && (
            <Form
              form={form}
              layout="vertical"
              onFinish={
                handleSubmit
              }
              style={{
                marginTop: 20,
              }}
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                />
              </Form.Item>

              <Button
                htmlType="submit"
                type="primary"
              >
                Save
              </Button>
            </Form>
          )}

          <List
            loading={loading}
            style={{
              marginTop: 20,
            }}
            dataSource={
              notifications
            }
            renderItem={(
              item
            ) => (
              <List.Item
                actions={[
                  <Button
                    danger
                    onClick={() =>
                      deleteNotification(
                        item.id
                      )
                    }
                  >
                    Delete
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    item.title
                  }
                  description={
                    item.message
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  };

export default NotificationManagement;