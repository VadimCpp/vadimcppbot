class VadimcppBotApp {
  constructor() {
    console.log('');
    console.log('[VadimcppBotApp]: Create Application...');
  }

  handleMessage(msg, bot) {
    console.log(''); // NOTE! view logs on your server
    console.log(JSON.stringify(msg));

    const isPrivateMsg = msg.chat.id > 0;

    if (isPrivateMsg) { // This is private chat
      const messageText =
        'Привет, ' + this._getName(msg) + "\n\n" +
        'Я только учусь нормально общаться. Как дела?';

      bot.sendMessage(msg.chat.id, messageText, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    } else {
      // NOTE!
      // This is public chat
      // TODO:
    }
  }

  _getName(msg) {
    let result = 'Без имени 👤';
    const fname = msg.from.first_name;
    const lname = msg.from.last_name;
    const uname = msg.from.username;

    if (fname) {
      result = fname + ( lname ? ' ' + lname : '') ;
    } else if (uname) {
      result = uname;
    }

    return result;
  }
}

module.exports = VadimcppBotApp;
