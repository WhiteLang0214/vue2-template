/**
 *  返回异步组件
 * @tips 请注意页面只能挂载在views文件下,非此路径请勿使用
 */

 const AsyncComponentHook = path => {
  // 通过 webpack 的内联注释,设置模块名
  let component = import(/* webpackChunkName: views-[request] */ `@/views/${path}.vue`)
  // component.catch( (e) => {
  //   console.error(e);
  // });
  return component
}

export default AsyncComponentHook
