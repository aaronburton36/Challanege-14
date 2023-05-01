const moment = require('moment');

module.exports = {
  format_date: (date) => {
    return moment(date).format('MMM DD, YYYY [at] hh:mm A');
  },

  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }

    return word;
  },

  format_url: (url) => {
    return url
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .split('/')[0]
      .split('?')[0];
  },

  get_date_difference: (date1, date2) => {
    const start = moment(date1);
    const end = moment(date2);

    const duration = moment.duration(end.diff(start));

    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  },
};
