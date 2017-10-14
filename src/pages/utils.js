// 0: time only, 1: include date, 2: include month, 3: include year
export function timeToString(time, level) {
  let result = '';
  if (level > 2)
    result += time.getFullYear() + '年';
  if (level > 1)
    result += (time.getMonth() + 1) + '月';
  if (level > 0)
    result += time.getDate() + '日 ';
  const hours = time.getHours(), minutes = time.getMinutes();
  if (hours < 10)
    result += '0' + hours;
  else
    result += hours;
  result += ':';
  if (minutes < 10)
    result += '0' + minutes;
  else
    result += minutes;
  return result;
}

export function durationToString(begin, end) {
  const now = new Date();
  if (begin.getFullYear() !== end.getFullYear())
    return timeToString(begin, 3) + '－' + timeToString(end, 3);
  else if (begin.getFullYear() !== now.getFullYear()) {
    if (begin.getMonth() !== end.getMonth() || begin.getDate() !== end.getDate())
      return begin.getFullYear() + '年' + timeToString(begin, 2) + '－' + timeToString(end, 2);
    else
      return begin.getFullYear() + '年' + (begin.getMonth() + 1) + '月' + begin.getDate() + '日 ' +
        timeToString(begin, 0) + '－' + timeToString(end, 0);
  } else if (begin.getMonth() !== end.getMonth() || begin.getDate() !== end.getDate())
    return timeToString(begin, 2) + '－' + timeToString(end, 2);
  else
    return (begin.getMonth() + 1) + '月' + begin.getDate() + '日 ' +
      timeToString(begin, 0) + '－' + timeToString(end, 0);
}

const oneDay = 86400 * 1000, oneHour = 3600 * 1000, oneMinute = 60 * 1000,
  oneSecond = 1000;

export function countingDownToString(time) {
  const day = Math.floor(time / oneDay),
    hour = Math.floor(time % oneDay / oneHour),
    minute = Math.floor(time  % oneHour / oneMinute),
    second = Math.round(time % oneMinute / oneSecond);
  let result = '';
  if (day)
    result += day + '天';
  if (hour)
    result += hour + '小时';
  if (hour || minute)
    result += minute + '分';
  if (hour || minute || second)
    result += second + '秒';
  return result;
}

export function activityStatus(activity, time) {
  if (!activity.published)
    return 0;
  else if (time.getTime() < activity.bookBeginTime.getTime())
    return 1;
  else if (time.getTime() > activity.endTime.getTime())
    return 5;
  else if (time.getTime() <= activity.bookEndTime.getTime())
    return 2;
  else if (time.getTime() >= activity.beginTime.getTime())
    return 4;
  else
    return 3;
}

export function activityStatusString(index) {
  return [
    '未发布',
    '抢票未开始',
    '正在抢票中',
    '抢票已结束，活动未开始',
    '活动进行中',
    '已结束'
  ][index];
}
