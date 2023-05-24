import services from '@/services/demo';
import {
  ActionType,
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Tooltip, Modal, notification, Table } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { DeleteOutlined, FormOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { history, useNavigate } from 'umi';
import request from '@/utils/request';
import userInfo from '@/utils/userUtils';


const TableList: React.FC<unknown> = () => {
    useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [modal, ContextHolder] = Modal.useModal();
  const [selectItem, setSelectItem] = useState<String>("1");
  const [departmentList, setDepartmentList] = useState<Array<any>>([]);
  const [open, setOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<String>("");
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const [studentUuid, setStudentUuid] = useState('');

  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 10,
      },
    })
  };

  useEffect(() => {
    const params = { "baseCode": "department", "itemKey": "", "parentItemKey": "" }
    let res = request('/baseData/searchByCode', params, 'post');
    res.then(response => {
      if (response?.code == 200) {
        setDepartmentList(response?.data)
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
      if (response?.code == 200) {
        notification.success({
          description: response?.msg || "网络发生异常，无法连接服务器",
          message: '提示',
        })
        actionRef.current?.reload()
      } else {
        notification.error({
          description: response?.msg || "网络发生异常，无法连接服务器",
          message: '提示',
        });
        // history.push('/register');
      }
    })
  }

  const onCheckScore = (studentUuid: string, scoreType: string) => {
    setStudentUuid(studentUuid)
    setDrawerTitle('test')
    // drawerTitle
    setLoading(true)
    const params = { "page": { "pageNum": tableParams.pagination.current, "pageSize": tableParams.pagination.pageSize, }, "params": { "studentUuid": studentUuid, "scoreType": scoreType } }
    let res = request('/userScore/search', params, 'post');
    res.then(response => {
      showDrawer()
      setData(response?.data?.list || [])
      let pagination = {
        total: response?.data?.total,
        current: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
      }

      setTableParams({
        pagination,
      })
      setLoading(false)
    })
  }

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any,
  ) => {
    const { current, pageSize } = pagination
    setLoading(true)
    const params = { "page": { "pageNum": current, "pageSize": pageSize, }, "params": { "studentUuid": studentUuid, "scoreType": drawerTitle } }
    let res = request('/userScore/search', params, 'post');
    res.then(response => {
      showDrawer()
      setData(response?.data?.list || [])
      let pagination = {
        total: response?.data?.total,
        current,
        pageSize,
      }
      setTableParams({
        pagination,
      })
      setLoading(false)
    })
  };

  const onChangeInfo = (info: any) => {
    let data = info
    data.gender = info.gender ? '1' : '0'
    history.push('/register', { info: data, type: 'change' })
  }

  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '编辑',
      dataIndex: 'change',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Tooltip title="修改">
            <Button style={{ borderWidth: 0, backgroundColor: 'rgba(0,0,0,0)', boxShadow: '0 0 0 rgba(0, 0, 0, 0)' }} shape="circle" icon={<FormOutlined style={{ color: 'rgb(94,135,175)' }} onClick={() => onChangeInfo(record)} />} />
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
        return departmentList.map((item: any) => {
          if (item.itemKey == _) {
            return item.itemValue
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
      render: (_, record: any) => (
        <>
          <Button type="primary" size="small" onClick={() => { onCheckScore(record.studentUuid, "test") }}> 实验成绩</Button>
          <Divider type="vertical" />
          <Button type="primary" size="small" onClick={() => { onCheckScore(record.studentUuid, "answer") }}> 答题成绩</Button>
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
        return departmentList.map((item: any) => {
          if (item.itemKey == _) {
            return item.itemValue
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
      dataIndex: 'status',
      valueType: 'option',
      render: (_, record: any) => (
        <>
          <Button type="primary" size="small" onClick={() => onExamine(record.studentUuid, 'pass')}>通过</Button>
          <Divider type="vertical" />
          <Button disabled={record.status==="failed"} type="primary" danger size="small" onClick={() => onExamine(record.studentUuid, 'failed')}>拒绝</Button>
        </>
      ),
    },
  ];

  const scoreColumns = [
    {
      title: '学号/工号',
      dataIndex: 'studentUuid',
    },
    {
      title: '使用时长',
      dataIndex: 'useTimes',
      render: (_: any) => _ || "-"
    },
    {
      title: '分数',
      dataIndex: 'score',
    },
    {
      title: '更新时间',
      dataIndex: 'createdTime',
    }
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
            // pagination = {mainTableParams.pagination}
            request={async (params, sorter, filter) => {
              if (selectItem === '1') {
                const param = {
                  "page": { "pageNum": params.current, "pageSize": params.pageSize },
                  "params": { "studentUuid": params?.studentUuid || "", "studentName": params?.studentName || "" }
                }
                const { data, code } = await request('/user/search', param, 'post');
                return {
                  data: data?.list || [],
                  success: code == 200,
                  total: data?.total || 0,
                };
              } else {
                const param = {
                  "page": { "pageNum": params.current, "pageSize": params.pageSize },
                  "params": { "studentUuid": params?.studentUuid || "", "studentName": params?.studentName || "" }
                }
                const { data, code } = await request('/user/searchExamine', param, 'post');
                return {
                  data: data?.list || [],
                  success: code == 200,
                  total: data?.total || 0
                };
              }
            }}
            columns={selectItem == "1" ? columns : columns2}
          // rowSelection={{
          //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          // }}
          />

          <Drawer title={drawerTitle === 'test' ? '实验成绩' : '答题成绩'} size='large' placement="right" onClose={onClose} open={open}>
            <Table
              columns={scoreColumns}
              rowKey={(record) => record.studentUuid}
              dataSource={data}
              pagination={tableParams.pagination}
              loading={loading}
              onChange={handleTableChange}
            />
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
