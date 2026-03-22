function parseRemindTime(text) {
  const match = text.match(/(\d+)\s*(hour|day|week)s?/i);
  if (!match) return null;
  const number = Number(match[1])
  let now = new Date();
  let hour = 60 * 60 * 1000
  let day = 24 * 60 * 60 * 1000
  let week = 7 * 24 * 60 * 60 * 1000
  
  if (match[2]==='hour'){
    let remindTime = new Date(now.getTime()+ number*hour )
    return remindTime
  } else if(match[2]==='day') {
    let remindTime = new Date(now.getTime()+ number*day )
    return remindTime
  } else if(match[2]==='week'){
    let remindTime = new Date(now.getTime()+ number*week )
    return remindTime
  } else {
    return null
  }
  
}

module.exports = { parseRemindTime };