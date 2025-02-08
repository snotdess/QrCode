import { XOutlined } from "@ant-design/icons";
import { Card, List, Typography } from "antd";
import React from "react";

const { Text } = Typography;

const NotificationCard = ({ notifications, onClose }) => {
    return (
        <Card
            style={{
                position: "absolute",
                zIndex: 80,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                fontFamily: "Roboto, sans-serif",
            }}
            className="w-[55%] top-[5%] right-4 sm:w-[35%] md:w-[30%] lg:w-[25%] md:right-[9%] lg:right-[5%] lg:top-[10%]"
            title="Notifications"
            extra={
                <a onClick={onClose}>
                    <XOutlined />
                </a>
            }
        >
            <List
                style={{
                    fontFamily: "Roboto, sans-serif",
                }}
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item>
                        <Text>{item.message}</Text>{" "}
                        {/* Access the 'message' property */}
                        <br />
                        <Text type="secondary">{item.timestamp}</Text>{" "}
                        {/* Access the 'timestamp' property */}
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default NotificationCard;
