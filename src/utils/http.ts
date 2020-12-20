import axios from 'axios'
import { message } from 'antd';
import envConfig from '../envConfig'

const env: string = process.env.REACT_APP_ENV || process.env.NODE_ENV||'development'
// @ts-ignore
let baseUrl = envConfig[env].api;

const instance = axios.create({
	baseURL: baseUrl,
	timeout: 60000,
	withCredentials: false, // 允许携带cookie
	validateStatus(status) {
		return status < 500
	}
});

// 添加一个请求拦截器
instance.interceptors.request.use(
	request => {
		const token = localStorage.getItem('token') || '';
		if (process && process.env && process.env.NODE_ENV !== 'development') {
			request.headers.common['x-token'] = token
		}
		return request
	},
	err => Promise.reject(err)
);

// 响应拦截器
instance.interceptors.response.use(
	response => {
		const { code, msg, success } = response.data;
		if (code === 0 || (!code && success)) {
			return Promise.resolve(response.data)
		} else if(code === 1000 || code === 20001){
			// @ts-ignore
			const loginHost = envConfig[env].loginHost;
			window.parent.location.href=`${loginHost}/login`
		} else{
			message.error(msg)
		}
		return Promise.reject()
	},
	err => {
		message.error('系统异常，请稍后再试');
		return Promise.reject(err)
	}
);

export default instance
