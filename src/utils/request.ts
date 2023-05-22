/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
// import umi_request from 'umi-request';
import { request } from 'umi'
import { notification } from 'antd';
import { history } from 'umi';


// const http_url = 'http://heymock.uneedcode.com/mock/5fcb3bdb1f1f08da/';

const umi_request = (url: string, data: any, method = 'post') => {

    //   url = http_url+url;
    url = '/api' + url
    console.log(url, '提交参数:', data);
    return request(url, {
        method: method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
        },
        requestType: 'form',
        data: data
    })
        .then(response => {
            console.log(url, '网络请求成功：', response);
            // if (response.code === -1) {
            //     history.replace('/login');
            // }
            return response;
        })
        .catch(function (error) {
            notification.error({
                description: '您的网络发生异常，无法连接服务器',
                message: '网络异常',
            });
            console.log(url, '网络请求异常：', error);
        });

}
export default umi_request;