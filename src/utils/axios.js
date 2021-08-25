import axios from 'axios';

const instance = axios.create({
  baseURL: '',
  timeout: 10000,
});

const getToken = () => {
  return ''
}

// 在实例已创建后修改默认值
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers.common['Authorization'] = getToken();

// 请求拦截器
instance.interceptors.request.use((config) => {
  return config
}, (err) => {
  return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use((response) => {
  const { status, data } = response;
  if (status === 200) {
    return Promise.resolve(data);
    // switch (data.code) {
    //   case 200:
    //     return Promise.resolve(data);
    //     break;
    
    //   default:
    //     console.log('请求失败:', data.msg);
    //     return Promise.reject(response);
    //     break;
    // }
  } else {
    return Promise.reject(response)
  }
}, (err) => {
  console.log('请求失败:', err);
  return Promise.reject(err)
})

/**
 * get
 * @param {请求地址} url 
 * @param {请求参数} params 
 * @returns 
 */
export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    instance.get(url, {
      params
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * post
 * @param {请求地址} url 
 * @param {请求参数} data 
 * @param {请求配置} config 
 * @returns 
 */
export const post = (url, data, config) => {
  return new Promise((resolve, reject) => {
    instance.get(url, data, config).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}
