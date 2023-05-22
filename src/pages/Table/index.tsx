import services from '@/services/demo';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Tooltip, Space } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';

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
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '',
      dataIndex: 'change',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Tooltip title="修改">
            <Button style={{borderWidth: 0, backgroundColor: 'rgba(0,0,0,0)', boxShadow:'0 0 0 rgba(0, 0, 0, 0)'}} shape="circle" icon={<FormOutlined style={{color:'rgb(94,135,175)'}}/>} />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="删除">
            <Button style={{borderWidth: 0, backgroundColor: 'rgba(0,0,0,0)', boxShadow:'0 0 0 rgba(0, 0, 0, 0)'}} shape="circle" icon={<DeleteOutlined style={{color:'rgb(217,88,66)'}}/>} />
          </Tooltip>
        </>
      ),
    },
    {
      title: '工号/学号',
      dataIndex: 'number',
      tip: '',
      formItemProps: {
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        // rules: [
        //   {
        //     required: true,
        //     message: '名称为必填项',
        //   },
        // ],
      },
    },
    {
      title: '性别',
      dataIndex: 'nickName',
      valueType: 'text',
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'text',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      valueType: 'text',
    },
    {
      title: '成绩',
      dataIndex: '1',
      valueType: 'text',
    },
    {
      title: '院系',
      dataIndex: '2',
      valueType: 'text',
    },
    {
      title: '专业',
      dataIndex: '3',
      valueType: 'text',
    },
    {
      title: '班级',
      dataIndex: '4',
      valueType: 'text',
    },
    {
      title: '注册日期',
      dataIndex: '5',
      valueType: 'text',
    },
    {
      title: '登录次数',
      dataIndex: '6',
      valueType: 'text',
    },
    {
      title: '使用时间',
      dataIndex: '7',
      valueType: 'text',
    },
    // {
    //   title: '性别',
    //   dataIndex: 'gender',
    //   hideInForm: true,
    //   valueEnum: {
    //     0: { text: '男', status: 'MALE' },
    //     1: { text: '女', status: 'FEMALE' },
    //   },
    // },
    {
      title: '登录查询',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            点击查看
          </a>
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
      <ProTable<API.UserInfo>
        // search={false}
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
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
          console.log('---->',params, sorter, filter)
          const { data, success } = await queryUserList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data?.list || [],
            success,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
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
          columns={columns}
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
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
