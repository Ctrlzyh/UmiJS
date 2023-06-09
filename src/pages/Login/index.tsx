import { PageContainer } from '@ant-design/pro-components';
import { Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import request from '@/utils/request';
import userInfo from '@/utils/userUtils';



const AccessPage: React.FC = () => {

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [userName, setUserName] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [messageApi, ContextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState<Int>("");


  const success = (msg: string) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };

  const error = (msg: string) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
      // detectZoom()
    }
    // test()
    // detectZoom()

    // window.addEventListener('resize', handleWindowResize);

    return () => {
      // window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const test = () => {
    const keyCodeMap = {
      // 91: true, // command
      61: true,
      107: true, // 数字键盘 +
      109: true, // 数字键盘 -
      173: true, // 火狐 - 号
      187: true, // +
      189: true, // -
    };
    // 覆盖ctrl||command + ‘+’/‘-’
    document.onkeydown = function (event) {
      const e = event || window.event;
      const ctrlKey = e.ctrlKey || e.metaKey;
      if (ctrlKey && keyCodeMap[e.keyCode]) {
        e.preventDefault();
      } else if (e.detail) { // Firefox
        event.returnValue = false;
      }
    };
    // 覆盖鼠标滑动
    document.body.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        if (e.deltaY < 0) {
          e.preventDefault();
          return false;
        }
        if (e.deltaY > 0) {
          e.preventDefault();
          return false;
        }
      }
    }, { passive: false });

  }

  const detectZoom = () => {
    const { width: screenWidth, height: screenHeight } = window.screen
    let zoom = window.outerWidth / window.innerWidth;
    setZoom(zoom)
  }


  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserName(e.target.value)
  };

  const handlePsdChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPassword(e.target.value)
  };

  const onClickLogin = () => {
    if (userName.length === 0 || password.length === 0) {
      error('请先填写用户名和密码')
      return
    }
    setLoading(true)
    const params = {
      "studentUuid": userName,
      "password": password
    }
    let res = request('/user/login', { 'params': params }, 'post');
    res.then(response => {
      setLoading(false)
      if (response?.code == 200) {
        success(response?.msg)
        userInfo.setUserInfo(response?.data)
        if (userInfo.getUserInfo().studentUuid === 'admin') {
          history.push({ pathname: '/table' })
        } else {
          history.push({ pathname: '/home' })
        }
      } else {
        error(response?.msg)
      }
    })
  }

  const onClickRegister = () => {
    history.push({ pathname: '/register' })
  }

  const onClickVipLogin = () => {
    history.push({ pathname: '/home' })
  }

  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      {/* <div>
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
              <Button loading={loading} style={{ width: 260, marginTop: 25, height: 36, borderRadius: 18, fontSize: 18, fontWeight: 800, paddingTop: 2, backgroundColor: "rgb(39,92,201)" }} type="primary" onClick={onClickLogin}>登录</Button>
              <Button style={{ width: 260, marginTop: 12, height: 36, borderRadius: 18, fontSize: 18, fontWeight: 800, paddingTop: 2, backgroundColor: "rgb(39,92,201)" }} type="primary" onClick={onClickRegister}>注册</Button>
              <Button style={{ width: 260, marginTop: 12, height: 36, borderRadius: 18, fontSize: 18, fontWeight: 800, paddingTop: 2, backgroundColor: "rgb(97,148,230)" }} type="primary" onClick={onClickVipLogin}>专家登录入口</Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div>
        <img className={styles.topbg} style={{ height: windowSize.innerHeight }} src={require('../../assets/login_bg.png')} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: windowSize.innerHeight * 0.3, width: "100%", backgroundColor: "rgb(129,153,179)" }} />
        <div className={styles.container} style={{ height: windowSize.innerHeight, width: windowSize.innerWidth, }} >
          <img style={{ width: '21%', marginTop: "3%" }} src={require('../../assets/login_logo.png')} />
          <div className={styles.content} style={{ height: "65%", width: "80%", backgroundColor: 'white', marginTop: '2%', borderRadius: windowSize.innerWidth * 0.02, }}>
            <img style={{ height: "100%", width: "58%" }} src={require('../../assets/login_left.png')} />
            <div style={{ height: "100%", width: "42%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img style={{ width: '16%', marginTop: '5%' }} src={require('../../assets/login_top_logo.png')} />
              <div style={{ fontSize: windowSize.innerWidth * 0.0153, color: "#333", marginTop: '4%' }}>欢迎使用虛拟仿真实验平台</div>
              <Input style={{ width: '66%', height: '8.5%', marginTop: '5%', borderColor: "#333", }} size='large' placeholder="用户名" prefix={<UserOutlined />} onChange={handleUserChange} />
              <Input.Password style={{ width: '66%', height: '8.5%', marginTop: '4%', borderColor: "#333", fontSize: windowSize.innerWidth * 0.014, }} size='large' placeholder="密码" prefix={<LockOutlined />} onChange={handlePsdChange} />
              <Button loading={loading} style={{ width: '66%', marginTop: '6%', height: '8%', borderRadius: windowSize.innerWidth * 0.0153, fontSize: windowSize.innerWidth * 0.015, fontWeight: 800, paddingTop: windowSize.innerWidth * 0.0023, backgroundColor: "rgb(39,92,201)" }} type="primary" onClick={onClickLogin}>登录</Button>
              <Button style={{ width: '66%', marginTop: '3%', height: '8%', borderRadius: windowSize.innerWidth * 0.0153, fontSize: windowSize.innerWidth * 0.015, fontWeight: 800, paddingTop: windowSize.innerWidth * 0.0023, backgroundColor: "rgb(39,92,201)" }} type="primary" onClick={onClickRegister}>注册</Button>
              <Button style={{ width: '66%', marginTop: '3%', height: '8%', borderRadius: windowSize.innerWidth * 0.0153, fontSize: windowSize.innerWidth * 0.015, fontWeight: 800, paddingTop: windowSize.innerWidth * 0.0023, backgroundColor: "rgb(97,148,230)" }} type="primary" onClick={onClickVipLogin}>专家登录入口</Button>
            </div>
          </div>
        </div>
      </div> */}
      <div style={{ position:'relative', display:'flex', justifyContent: 'center', }}>
        <img className={styles.topbg} style={{ height: windowSize.innerHeight }} src={require('../../assets/login_bg.png')} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, height:  windowSize.innerHeight * 0.3, width: "100%", backgroundColor: "rgb(129,153,179)" }} />
        <div className={styles.container} style={{ height:  windowSize.innerHeight, width: windowSize.innerWidth, }} >
          <img style={{ height:  windowSize.innerHeight * 0.0785, marginTop: "2%" }} src={require('../../assets/login_logo.png')} />
          <div className={styles.content} style={{ height:  windowSize.innerHeight * 0.68, width: windowSize.innerWidth * 0.8, backgroundColor: 'white',  marginTop: "2%", borderRadius: 30}}>
            <img style={{ height: "100%", width: "60%" }} src={require('../../assets/login_left.png')} />
            <div style={{ height: "100%", width: "40%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img style={{ width: '18%', marginTop: '7%' }} src={require('../../assets/login_top_logo.png')} />
              <div style={{ fontSize: 22, color: "#333", marginTop: '5%' }}>欢迎使用虛拟仿真实验平台</div>
              <Input style={{ width: windowSize.innerWidth * 0.24,  height: '8%',marginTop: '7%' , borderColor: "#333" }} size='large' placeholder="用户名" prefix={<UserOutlined />} onChange={handleUserChange} />
              <Input.Password style={{ width: windowSize.innerWidth * 0.24, height: '8%', marginTop: '4%', borderColor: "#333" }} size='large' placeholder="密码" prefix={<LockOutlined />} onChange={handlePsdChange} />
              <Button loading={loading} style={{ width: windowSize.innerWidth * 0.24, marginTop: '7%' , height: '8%', borderRadius:  windowSize.innerWidth * 0.0153, fontSize: 18, fontWeight: 800, paddingTop: 2, backgroundColor: "rgb(39,92,201)" }} type="primary" onClick={onClickLogin}>登录</Button>
              <Button style={{ width: windowSize.innerWidth * 0.24, marginTop: '3%', height: '8%', borderRadius:  windowSize.innerWidth * 0.0153, fontSize: 18, fontWeight: 800, paddingTop: 2, backgroundColor: "rgb(39,92,201)" }} type="primary" onClick={onClickRegister}>注册</Button>
              <Button style={{ width: windowSize.innerWidth * 0.24, marginTop: '3%',  height: '8%', borderRadius:  windowSize.innerWidth * 0.0153, fontSize: 18, fontWeight: 800, paddingTop: 2, backgroundColor: "rgb(97,148,230)" }} type="primary" onClick={onClickVipLogin}>专家登录入口</Button>
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
