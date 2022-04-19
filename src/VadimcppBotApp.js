const PUBLIC_VOCABULARY = [
  {
    questions: [
      'Привет',
      'Всем привет',
    ],
    answer: 'Привет 👋',
  },
];

const PRIVATE_VOCABULARY = [
  ...PUBLIC_VOCABULARY,
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
    answer: 'Давайте сразу к делу. Какой у Вас вопрос?',
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
    answer: 'Я работаю. Какой у Вас вопрос?',
  },
];

// TODO: implement
function extractQuestionOrGreeting(text) {
  if (text.toLowerCase() === "привет" || text.toLowerCase() === "всем привет") {
    return "привет";
  }
  return null;
}

function normalizeText(text) {
  // remove spaces
  let normalized = text.trim();

  // put all to lowercase
  normalized = normalized.toLowerCase();

  // replace 'й' to 'и'
  normalized = normalized.replace('й', 'и');

  // replace 'ё' to 'е'
  normalized = normalized.replace('ё', 'е');

  // remove dots, commas, spaces etc.
  normalized = normalized.replace('.', '');
  normalized = normalized.replace(' ', '');
  normalized = normalized.replace(',', '');
  normalized = normalized.replace('\n', '');
  normalized = normalized.replace('!', '');
  normalized = normalized.replace('?', '');

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
      // In private chat bot react on every message
      const answer = this._getAnswer(msg.text, PRIVATE_VOCABULARY);
      const alternative = `${this._getName(msg)}, я не знаю, спроси пожалуйста в @borinorge. Я там учусь.`;
      bot.sendMessage(msg.chat.id, answer || alternative, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }).then();
    } else {
      // In public groups bot react only to questions and greetings
      const question = extractQuestionOrGreeting(msg.text || '');
      if (question) {
        const answer = this._getAnswer(msg.text, PUBLIC_VOCABULARY);
        if (answer) {
          bot.sendMessage(msg.chat.id, answer, {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_to_message_id: msg.message_id,
          }).then();
        }
      }
    }
  }

  _getAnswer(text, vocabulary) {
    for (let i = 0; i < vocabulary.length; i++) {
      const option = vocabulary[i];
      for (let j = 0; j < option.questions.length; j++) {
        const normalizedMsgText = normalizeText(text);
        const normalizedQuestion = normalizeText(option.questions[j]);
        if (normalizedMsgText === normalizedQuestion) {
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
