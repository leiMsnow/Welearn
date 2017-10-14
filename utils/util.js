const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const welcome = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) {
    return '早上好';
  }
  if (hour >= 12 && hour < 14) {
    return '中午好';
  }
  if (hour >= 14 && hour < 18) {
    return '下午好';
  }
  if (hour >= 18 && hour < 23) {
    return '晚上好';
  }
  if (hour >= 0 && hour < 6) {
    return '别熬夜';
  }
  return '你好';
};

module.exports = {
  formatTime: formatTime,
  welcome: welcome,
};
