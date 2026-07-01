import {
  useEffect,
  useState,
} from "react";

import {
  Card,
  Input,
  Button,
  List,
} from "antd";

import useChat from "../hooks/useChat";

const ChatManagement = () => {
  const {
    messages,
    loading,
    fetchMessages,
    sendMessage,
    deleteMessage,
  } = useChat();

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage({
      message,
    });

    setMessage("");
  };

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <Card title="Communication">
        <Input.TextArea
          rows={3}
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder="Type message..."
        />

        <Button
          type="primary"
          style={{
            marginTop: 10,
          }}
          onClick={handleSend}
        >
          Send Message
        </Button>

        <List
          loading={loading}
          style={{
            marginTop: 20,
          }}
          dataSource={
            messages
          }
          renderItem={(
            item
          ) => (
            <List.Item
              actions={[
                <Button
                  danger
                  onClick={() =>
                    deleteMessage(
                      item.id
                    )
                  }
                >
                  Delete
                </Button>,
              ]}
            >
              {item.message}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ChatManagement;