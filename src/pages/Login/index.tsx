import { PageContainer } from '@ant-design/pro-components';
import { Input, Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import request from '@/utils/request';
import userInfo from  '@/utils/userUtils';



const AccessPage: React.FC = () => {

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [userName, setUserName] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [messageApi, ContextHolder] = message.useMessage();

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
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);


  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
    setUserName(e.target.value)
  };

  const handlePsdChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
    setPassword(e.target.value)
  };

  const onClickLogin = () => {
    // history.push({ pathname: '/home' })
    const params = {
      "studentUuid": userName,
       "password": password
    }
    let res = request('/user/login',{'params':params},'post');
     res.then(response => {
      if(response.code == 200) {
        success(response.msg)
        userInfo.setUserInfo(response.data)
        console.log('user--->', userInfo.getUserInfo())
        if (userInfo.getUserInfo().studentUuid === 'admin') {
          history.push({ pathname: '/table' })
        } else {
          history.push({ pathname: '/home' })
        }
      } else {
        error(response.msg)
      }
    })
  }

  const onClickRegister = () => {
    history.push({ pathname: '/register' })
  }

  const onClickVipLogin = () => {
    history.push({ pathname: '/table' })
  }

  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <div>
        <div className={styles.topbg} style={{ height: windowSize.innerHeight * 0.7 }} >
        </div>
        <div style={{ height: windowSize.innerHeight * 0.3, width: "100%", backgroundColor: "rgb(129,153,179)" }}>
        </div>
        <div className={styles.container} style={{ height: windowSize.innerHeight < 440 ? 440 : windowSize.innerHeight, width: windowSize.innerWidth, }} >
          <img style={{ width: 300, height: 60, marginTop: 30 }} src={require('../../assets/login_logo.png')} />
          <div className={styles.content} style={{ height: "65%", width: "80%", backgroundColor: 'white', marginTop: 30, borderRadius: 20, minWidth: 670, minHeight: 440 }}>
            <img style={{ height: "100%", width: "58%" }} src={require('../../assets/login_left.png')} />
            <div style={{ height: "100%", width: "42%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img style={{ width: 75, height: 75, marginTop: 24 }} src={require('../../assets/login_top_logo.png')} />
              <div style={{ fontSize: 18, color: "#333", marginTop: 18 }}>欢迎使用虛拟仿真实验平台</div>
              <Input style={{ width: 260, marginTop: 25, borderColor: "#333" }} size='large' placeholder="用户名" prefix={<UserOutlined />} onChange={handleUserChange} />
              <Input.Password style={{ width: 260, marginTop: 16, borderColor: "#333" }} size='large' placeholder="密码" prefix={<LockOutlined />} onChange={handlePsdChange} />
              <Button style={{ width: 260, marginTop: 25, height: 36, borderRadius: 18, fontSize: 18, fontWeight: 800, paddingTop: 2, backgroundColor: "rgb(39,92,201)" }} type="primary" onClick={onClickLogin}>登录</Button>
              <Button style={{ width: 260, marginTop: 12, height: 36, borderRadius: 18, fontSize: 18, fontWeight: 800, paddingTop: 2, backgroundColor: "rgb(39,92,201)" }} type="primary" onClick={onClickRegister}>注册</Button>
              <Button style={{ width: 260, marginTop: 12, height: 36, borderRadius: 18, fontSize: 18, fontWeight: 800, paddingTop: 2, backgroundColor: "rgb(97,148,230)" }} type="primary" onClick={onClickVipLogin}>专家登录入口</Button>
            </div>
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


export default AccessPage;
