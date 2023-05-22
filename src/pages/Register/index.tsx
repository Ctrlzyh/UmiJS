import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import type { CascaderProps } from 'antd';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';

const { Option } = Select;

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}


const ReigsterPage: React.FC = () => {

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [userName, setUserName] = useState<String>("");
  const [password, setPassword] = useState<String>("");



  const residences: CascaderProps<DataNodeType>['options'] = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
  ];

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    history.push({ pathname: '/login' })
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  );

  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="USD">$</Option>
        <Option value="CNY">¥</Option>
      </Select>
    </Form.Item>
  );

  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

  const onWebsiteChange = (value: string) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(['.com', '.org', '.net'].map((domain) => `${value}${domain}`));
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        <div style={{ width: "64%", backgroundColor: 'white', borderRadius: 4, overflow: 'hidden',width: 850 }}>
          <div style={{ width: "100%", height: 50, textAlign: 'center', backgroundColor: 'rgb(220,220,220)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: 28, color: 'white' }}>注 册</div>
          </div>
          <div style={{ paddingTop: 20}}>
            <Form
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
              style={{ width: 600, marginLeft: 40}}
              scrollToFirstError
            >

              <Form.Item
                name="number"
                label="学号"
                rules={[
                  {
                    required: true,
                    message: '请输入你的学号!',
                  },
                ]}
              >
                <Input placeholder="请输入学号" />
              </Form.Item>

              <Form.Item
                name="name"
                label="姓名"
                // tooltip="What do you want others to call you?"
                rules={[{ required: true, message: '请输入你的姓名!', whitespace: true }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>

              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择你的性别!' }]}
              >
                <Select placeholder="请选择性别">
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入你的密码!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="确认密码"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '两次密码不一致，请确认!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('密码输入不一致，请检查!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="请再次输入密码" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="电话"
                rules={[{ required: false, message: '请输入你的电话!' }]}
              >
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="请输入电话号码"/>
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  {
                    type: 'email',
                    message: '请检查你的邮箱地址格式!',
                  },
                  {
                    required: false,
                    message: '请输入你的邮箱地址!',
                  },
                ]}
              >
                <Input placeholder="请输入邮箱地址"/>
              </Form.Item>

              {/* <Form.Item
                name="residence"
                label="Habitual Residence"
                rules={[
                  { type: 'array', required: true, message: 'Please select your habitual residence!' },
                ]}
              >
                <Cascader options={residences} />
              </Form.Item> */}

              <Form.Item {...tailFormItemLayout}>
                <Button style={{width: 300, height: 40}} type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

      </div>


    </PageContainer>
  );
};

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}


export default ReigsterPage;
