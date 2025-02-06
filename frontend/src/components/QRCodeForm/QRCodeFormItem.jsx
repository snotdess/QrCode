// components/FormItem.js
import { Form } from "antd";

const QRCodeFormItem = ({ label, name, component, rules }) => {
    return (
        <Form.Item label={label} name={name} rules={rules}>
            {component}
        </Form.Item>
    );
};

export default QRCodeFormItem;
