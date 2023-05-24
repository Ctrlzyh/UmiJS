import services from '@/services/demo';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Tooltip, Modal, notification } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { DeleteOutlined, FormOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { history , useNavigate} from 'umi';
import request from '@/utils/request';
import userInfo from  '@/utils/userUtils';


const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [modal, ContextHolder] = Modal.useModal();
  const [selectItem, setSelectItem] = useState<String>("1");
  const [departmentList, setDepartmentList] = useState<Array<any>>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const params = { "baseCode": "department", "itemKey": "", "parentItemKey": "" }
    let res = request('/baseData/searchByCode', params, 'post');
    res.then(response => {
      if (response.code == 200) {
        setDepartmentList(response.data)
      } else {
        setDepartmentList([])
      }
    })

    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const onSelectItem = (item: String) => {
    setSelectItem(item)
    actionRef.current?.reload()
  }

  const onLogout = () => {

    modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '退出用户管理中心',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        userInfo.setUserInfo(null)
        history.replace('/login');
      }
    });
  }

  const onExamine = (studentUuid: string, status: string) => {
    const params = { "params": { "studentUuid": studentUuid, "status": status } }
    let res = request('/user/examine', params, 'post');
    res.then(response => {
      console.log('--response--->',response)
      notification.error({
        description: response?.msg || "网络发生异常，无法连接服务器",
        message: '提示',
      });
      if (response?.code == 200) {
        actionRef.current?.reload()
      } else {
        // history.push('/register');
      }
    })
  }

  const onCheckScore = (studentUuid: string,) => {
    const params = {"page": { "pageNum": 1, "pageSize": 10, }, "params": { "studentUuid": studentUuid, "scoreType": "test" } }
    let res = request('/userScore/search', params, 'post');
    res.then(response => {
      console.log('--response--->',response)
      // if (response?.code == 200) {
      //   actionRef.current?.reload()
      // } else {

      // }
    })
  }

  const onChangeInfo = (info: any) =>{
    let data = info
    data.gender = info.gender ? '1' : '0'
    history.push('/register', { info: data, type: 'change'})
  //   navigate('/register', {
  //     state: {
  //       info: data,
  //       type: 'change'
  //     }
  // })
  }

  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '编辑',
      dataIndex: 'change',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Tooltip title="修改">
            <Button style={{ borderWidth: 0, backgroundColor: 'rgba(0,0,0,0)', boxShadow: '0 0 0 rgba(0, 0, 0, 0)' }} shape="circle" icon={<FormOutlined style={{ color: 'rgb(94,135,175)' }}  onClick={() => onChangeInfo(record)}/>} />
          </Tooltip>
          {/* <Divider type="vertical" />
          <Tooltip title="删除">
            <Button style={{ borderWidth: 0, backgroundColor: 'rgba(0,0,0,0)', boxShadow: '0 0 0 rgba(0, 0, 0, 0)' }} shape="circle" icon={<DeleteOutlined style={{ color: 'rgb(217,88,66)' }} />} />
          </Tooltip> */}
        </>
      ),
    },
    {
      title: '工号/学号',
      dataIndex: 'studentUuid',
      tip: '',
      formItemProps: {
      },
    },
    {
      title: '姓名',
      dataIndex: 'studentName',
      valueType: 'text',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return <>{_ == 0 ? '男' : "女"}</>
      }
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '电话',
      dataIndex: 'phoneNumber',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '院系',
      dataIndex: 'department',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return departmentList.map((item:any) => {
          if (item.itemKey == _) {
            return  item.itemValue
          }
        })
      }
    },
    {
      title: '专业',
      dataIndex: 'specialities',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '班级',
      dataIndex: 'className',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '注册日期',
      dataIndex: 'createdTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '登录次数',
      dataIndex: 'loginCount',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '使用时间',
      dataIndex: 'useTimes',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '成绩',
      dataIndex: 'score',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record:any) => (
        <>
          <Button type="primary" size="small" onClick={()=>{onCheckScore(record.studentUuid)}}> 实验成绩</Button>
          <Divider type="vertical" />
          <Button type="primary" size="small" onClick={()=>{onCheckScore(record.studentUuid)}}> 答题成绩</Button>
        </>
      ),
    },
  ];


  const columns2: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '工号/学号',
      dataIndex: 'studentUuid',
      tip: '',
      formItemProps: {
      },
    },
    {
      title: '姓名',
      dataIndex: 'studentName',
      valueType: 'text',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return <>{_ == 0 ? '男' : "女"}</>
      }
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '电话',
      dataIndex: 'phoneNumber',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '院系',
      dataIndex: 'department',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return departmentList.map((item:any) => {
          if (item.itemKey == _) {
            return  item.itemValue
          }
        })
      }
    },
    {
      title: '专业',
      dataIndex: 'specialities',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '班级',
      dataIndex: 'className',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '注册日期',
      dataIndex: 'createdTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '审核',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record:any) => (
        <>
          <Button type="primary" size="small" onClick={() => onExamine(record.studentUuid, 'pass')}>通过</Button>
          <Divider type="vertical" />
          <Button type="primary" danger size="small"  onClick={() => onExamine(record.studentUuid, 'failed')}>拒绝</Button>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <div style={{ width: '100%', height: 60, backgroundColor: 'rgb(52,93,167)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
        <img src={require('../../assets/logo1.png')} className={styles.logoImg} />
        <span style={{ fontSize: 20, color: "#fff", fontWeight: 600 }}>虚拟仿真实验平台</span>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={require('../../assets/user.png')} style={{ width: 30 }} />
          <span style={{ fontSize: 16, color: "#fff", fontWeight: 600, paddingLeft: 8, paddingRight: 8 }}>admin</span>
          <DownOutlined style={{ color: '#fff' }} onClick={onLogout} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div style={{ width: 200, backgroundColor: '#fff', height: windowSize.innerHeight }}>
          <div className={selectItem === "1" ? styles.selectedItem : styles.defaultItem} style={{ marginTop: 40, marginLeft: 25 }} onClick={() => { onSelectItem("1") }}><span>用户管理中心</span></div>
          <div className={selectItem === "2" ? styles.selectedItem : styles.defaultItem} style={{ marginTop: 10, marginLeft: 25 }} onClick={() => { onSelectItem("2") }}><span>注册审核中心</span></div>
        </div>
        <div style={{ width: 12, backgroundColor: "rgb(245,245,245)" }}></div>
        <div style={{ flex: 1 }}>
          <ProTable<API.UserInfo>
            // search={false}
            headerTitle="用户信息"
            actionRef={actionRef}
            rowKey="studentUuid"
            search={{
              labelWidth: 120,
            }}
            // toolBarRender={() => [
            //   <Button
            //     key="1"
            //     type="primary"
            //     onClick={() => handleModalVisible(true)}
            //   >
            //     新建
            //   </Button>,
            // ]}
            request={async (params, sorter, filter) => {
              console.log('---->', params, sorter, filter)
              if (selectItem === '1'){
                const param = {
                  "page": { "pageNum": params.current, "pageSize": params.pageSize },
                  "params": { "studentUuid": params?.studentUuid || "", "studentName": params?.studentName || "" }
                }
                const { data, success } = await request('/user/search', param, 'post');
                return {
                  data: data?.list || [],
                  // success,
                };
              } else {
                const param = {
                  "page": { "pageNum": params.current, "pageSize": params.pageSize },
                  "params": { "studentUuid": params?.studentUuid || "", "studentName": params?.studentName || "" }
                }
                const { data, success } = await request('/user/searchExamine', param, 'post');
                return {
                  data: data?.list || [],
                  // success,
                };
              }
              
              
              //   res.then(response => {
              //     if (response.code == 200) {

              //     } else {

              //     }
              //  })

              // const { data, success } = await queryUserList({
              //   ...params,
              //   // FIXME: remove @ts-ignore
              //   // @ts-ignore
              //   sorter,
              //   filter,
              // });
            }}
            columns={selectItem == "1" ? columns : columns2}
          // rowSelection={{
          //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          // }}
          />
          {selectedRowsState?.length > 0 && (
            <FooterToolbar
              extra={
                <div>
                  已选择{' '}
                  <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                  项&nbsp;&nbsp;
                </div>
              }
            >
              <Button
                onClick={async () => {
                  await handleRemove(selectedRowsState);
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                批量删除
              </Button>
              {/* <Button type="primary">批量审批</Button> */}
            </FooterToolbar>
          )}
          <CreateForm
            onCancel={() => handleModalVisible(false)}
            modalVisible={createModalVisible}
          >
            <ProTable<API.UserInfo, API.UserInfo>
              onSubmit={async (value) => {
                const success = await handleAdd(value);
                if (success) {
                  handleModalVisible(false);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
              rowKey="id"
              type="form"
              columns={selectItem == "1" ? columns : columns2}
            />
          </CreateForm>
          {stepFormValues && Object.keys(stepFormValues).length ? (
            <UpdateForm
              onSubmit={async (value) => {
                const success = await handleUpdate(value);
                if (success) {
                  handleUpdateModalVisible(false);
                  setStepFormValues({});
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
              onCancel={() => {
                handleUpdateModalVisible(false);
                setStepFormValues({});
              }}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null}

          <Drawer
            width={600}
            open={!!row}
            onClose={() => {
              setRow(undefined);
            }}
            closable={false}
          >
            {row?.name && (
              <ProDescriptions<API.UserInfo>
                column={2}
                title={row?.name}
                request={async () => ({
                  data: row || {},
                })}
                params={{
                  id: row?.name,
                }}
                columns={selectItem == "1" ? columns : columns2}
              />
            )}
          </Drawer>
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

export default TableList;
