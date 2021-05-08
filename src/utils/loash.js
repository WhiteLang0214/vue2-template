
/**
 * 防抖
 * @param {执行函数} fn 
 * @param {延时时间} delay 
 * @returns 
 */
export const debounce = (fn, delay) => {
  let timer = null
  return () => {
    if(timer) clearTimeout(timer) 
    timer = setTimeout(fn,delay)
  }
}

/**
 * 节流
 * @param {执行函数} fn 
 * @param {延时时间} delay 
 * @returns 
 */
export const throttle = (fn, delay) => {
  let timer = null
  let start = Date.now();
  return () => {
    const context = this;
    const args = arguments;
    const cur = Date.now();
    const diff = delay - cur - start;
    clearTimeout(timer);
    if (diff <= 0) {
      fn.apply(context, args);
      start = Date.now();
    } else {
      timer = setTimeout(fn, delay);
    }
  }
}
