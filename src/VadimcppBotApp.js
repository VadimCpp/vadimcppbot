const ANY_PUBLIC_CHAT_VOCABULARY = [
  {
    questions: [
      'Привет',
      'Всем привет',
    ],
    answer: 'Привет 👋',
  },
];


const BORINORGE_CHAT_ID = -1001784009474;
const BORINORGE_CHAT_VOCABULARY = [
  {
    questions: [ 'розмовляти українською?' ],
    answer: 'Розмовляти українською - чудово! 🇺🇦',
  },
  {
    questions: [ 'курси норвезької мови' ],
    answer: 'Запрошую разом вивчати новезьку мову в мій Інстаграм - [kom.fra.ukraina](https://instagram.com/kom.fra.ukraina)',
  },
  {
    questions: [ 'украинцам проезд бесплатный?' ],
    answer: 'Официально бесплатный проезд только в центр приема беженцев.',
  },
];

const PRIVATE_CHAT_VOCABULARY = [
  ...ANY_PUBLIC_CHAT_VOCABULARY,
  ...BORINORGE_CHAT_VOCABULARY,
  {
    questions: [
      'Привет',
      'Приветствую',
      'Доброе утро',
      'Добрый день',
      'Добрый вечер',
      'Здорова',
      'Вітаю',
      'Добрий ранок',
      'Добрий день',
      'Добрий вечір',
      "Здоровеньки були",
    ],
    answer: 'Привет 👋',
  },
  {
    questions: [
      'Як справи?',
      'Як життя?',
      'Що робиш?',
      'Що поробляєш?',
      'Как дела?',
      'Как жизнь?',
      'Как поживаешь?',
      'Что делаешь?',
    ],
    answer: 'Все хорошо. Чем могу помочь?',
  },
];

function normalizeText(text) {
  // remove spaces
  let normalized = text.trim();

  // put all to lowercase
  normalized = normalized.toLowerCase();

  // replace 'й' to 'и'
  normalized = normalized.replace('й', 'и');

  // replace 'ё' to 'е'
  normalized = normalized.replace('ё', 'е');

  return normalized;
}

class VadimcppBotApp {
  constructor() {
    console.log('');
    console.log('[VadimcppBotApp]: Create Application...');
  }

  handleMessage(msg, bot) {
    console.log(''); // NOTE! view logs on your server
    console.log(JSON.stringify(msg));

    const isPrivateMsg = msg.chat.id > 0;
    if (isPrivateMsg) {
      if (msg.text === '/start') {
        const startAnswer = `${this._getName(msg)}, привет. Чем могу помочь?`;
        bot.sendMessage(msg.chat.id, startAnswer, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }).then();
      } else {
        // In private chat bot react on every message
        const answer = this._getAnswer(msg.text, PRIVATE_CHAT_VOCABULARY);
        const alternative = `${this._getName(msg)}, я не знаю, спроси пожалуйста в @borinorge. Я там учусь.`;
        bot.sendMessage(msg.chat.id, answer || alternative, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }).then();
      }
    } else if (msg.chat.id === BORINORGE_CHAT_ID) {
      const answer = this._getAnswer(msg.text, BORINORGE_CHAT_VOCABULARY);
      if (answer) {
        bot.sendMessage(msg.chat.id, answer, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
          reply_to_message_id: msg.message_id,
        }).then();
      }
    } else {
      // In public groups bot react only to questions and greetings
      const answer = this._getAnswer(msg.text, ANY_PUBLIC_CHAT_VOCABULARY);
      if (answer) {
        bot.sendMessage(msg.chat.id, answer, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_to_message_id: msg.message_id,
        }).then();
      }
    }
  }

  _getAnswer(text, vocabulary) {
    for (let i = 0; i < vocabulary.length; i++) {
      const option = vocabulary[i];
      for (let j = 0; j < option.questions.length; j++) {
        const normalizedMsgText = normalizeText(text);
        const normalizedQuestion = normalizeText(option.questions[j]);
        if (normalizedMsgText.indexOf(normalizedQuestion) !== -1) {
          console.log('Found answer for question: ', normalizedMsgText);
          return option.answer;
        }
      }
    }

    return null;
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
