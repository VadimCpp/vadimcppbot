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

const KOVCHEG_CHAT_ID = -1001536533168;
const KOVCHEG_CHAT_VOCABULARY = [
  {
    questions: [
      'получения рабочей визы',
      'получение рабочей визы',
      'получить рабочую визу'
    ],
    answer:
      'В большинстве рабочая виза это Skilled worker, но есть и другие случаи. Ссылка: ' +
      '[UDI - work immigration](https://www.udi.no/en/want-to-apply/work-immigration/?c=rus)',
  },
];

const PRIVATE_CHAT_VOCABULARY = [
  ...ANY_PUBLIC_CHAT_VOCABULARY,
  ...BORINORGE_CHAT_VOCABULARY,
  ...KOVCHEG_CHAT_VOCABULARY,
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
      this._handlePrivate(msg, bot);
    } else if (msg.chat.id === BORINORGE_CHAT_ID) {
      this._handleChat(msg, bot, BORINORGE_CHAT_VOCABULARY)
    } else if (msg.chat.id === KOVCHEG_CHAT_ID) {
      this._handleChat(msg, bot, KOVCHEG_CHAT_VOCABULARY)
    } else {
      this._handleChat(msg, bot, ANY_PUBLIC_CHAT_VOCABULARY)
    }
  }

  _handlePrivate(msg, bot) {
    if (msg.text === '/start') {
      const startAnswer = `${this._getName(msg)}, привет. Чем могу помочь?`;
      bot.sendMessage(msg.chat.id, startAnswer, {
        parse_mode: "markdown",
        disable_web_page_preview: true,
      }).then();
    } else {
      // In private chat bot react on every message
      const answer = this._getAnswer(msg.text, PRIVATE_CHAT_VOCABULARY);
      const alternative = `${this._getName(msg)}, я не знаю, спроси пожалуйста у @vadimcpp. Он меня учит.`;
      bot.sendMessage(msg.chat.id, answer || alternative, {
        parse_mode: "markdown",
        disable_web_page_preview: true,
      }).then();
    }
  }

  _handleChat(msg, bot, vocabulary) {
    const answer = this._getAnswer(msg.text, vocabulary);
    if (answer) {
      bot.sendMessage(msg.chat.id, answer, {
        parse_mode: "markdown",
        disable_web_page_preview: true,
        reply_to_message_id: msg.message_id,
      }).then();
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
