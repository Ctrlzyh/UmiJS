import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { LeftOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { history,useNavigate } from 'umi';
import type { CascaderProps } from 'antd';
import {
  message,
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
import request from '@/utils/request';


const { Option } = Select;

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}


const ReigsterPage: React.FC = () => {

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [departmentList, setDepartmentList] = useState<Array<any>>([]);

  const [messageApi, ContextHolder] = message.useMessage();

  console.log('---location->',history.location)
  
  if (history.location?.state?.type === 'change') {
    document.title = "编辑信息"
  }

  const success = (msg:string) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };

  const error = (msg:string) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };


  useEffect(() => {
    const params =  { "baseCode": "department", "itemKey": "", "parentItemKey": "" }
    let res = request('/baseData/searchByCode',params,'post');
    res.then(response => {
      if (response.code == 200) {
        setDepartmentList(response.data)
      } else {
        setDepartmentList([])
        error(response.msg)
      }
   })
   }, []);

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
  const toBack = ()=>{
    // console.log('---history-->',history)
    history.back()
    // useNavigate.
    
  }
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    // 
    // history.push({ pathname: '/login' })
    const { studentUuid, studentName, gender, password, phoneNumber, email,department,specialities,className } = values
    const params = {
      "studentUuid": studentUuid,
      "studentName": studentName,
      "gender": gender,
      "password": password,
      "phoneNumber": phoneNumber,
      "email": email,
      "department": department,
      "specialities": specialities,
      "className": className
    }

    // /user/update
    if (history.location?.state?.type === 'change') {
      let res = request('/user/update',{'params':params},'post');
     res.then(response => {
      if(response.code == 200) {
        success(response.msg)
        
      } else {
        error(response.msg)
      }
    })
    } else {
      let res = request('/user/register',{'params':params},'post');
      res.then(response => {
       if(response.code == 200) {
         success(response.msg)
       } else {
         error(response.msg)
       }
     })
    }
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
        <div style={{ width: "64%", backgroundColor: 'white', borderRadius: 4, overflow: 'hidden', width: 850 }}>
          <div style={{ width: "100%", height: 50, textAlign: 'center', backgroundColor: 'rgb(220,220,220)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button style={{ color: "#000" }} type='text' size="large" icon={<LeftOutlined />} onClick={toBack}>返回</Button>
            <div style={{ fontSize: 28, color: 'white' }}>{ history.location?.state?.type === 'change'? "编辑信息" : "注册"}</div>
            <div style={{width: 100, height: 2}}> </div>
          </div>
          <div style={{ paddingTop: 20 }}>
            <Form
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              initialValues={ history.location?.state?.info || null}
              style={{ width: 600, marginLeft: 40 }}
              scrollToFirstError
            >

              <Form.Item
                name="studentUuid"
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
                name="studentName"
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
                  <Option value="0">男</Option>
                  <Option value="1">女</Option>
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
                  {
                    min: 4,
                    message: '最少4个字符',
                  },
                  {
                    max: 16,
                    message: '最多16个字符',
                  }
                ]}
                hasFeedback
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              {history.location?.state?.type !== 'change' &&  <Form.Item
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
              </Form.Item>}
             

              <Form.Item
                name="phoneNumber"
                label="电话"
                rules={[{ required: false, message: '请输入你的电话!' },
                { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码格式！' },]}
              >
                <Input style={{ width: '100%' }} placeholder="请输入电话号码" />
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
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>
              <Form.Item
                name="department"
                label="院系"
                rules={[{ required: true, message: '请选择你的学院!' }]}
              >
                <Select placeholder="请选择学院">
                  {departmentList.map((item:any)=>(
                    <Option key={item.itemKey} value={item.itemKey}>{item.itemValue}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="specialities"
                label="专业"
                // tooltip="What do you want others to call you?"
                rules={[{ required: true, message: '请输入你的专业!', whitespace: true }]}
              >
                <Input placeholder="请输入专业" />
              </Form.Item>

              <Form.Item
                name="className"
                label="班级"
                // tooltip="What do you want others to call you?"
                // rules={[{ required: false, message: '请输入你的姓名!', whitespace: true }]}
              >
                <Input placeholder="请输入班级" />
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button style={{ width: 300, height: 40 }} type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      {ContextHolder}
    </PageContainer>
  );
};

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}


export default ReigsterPage;
