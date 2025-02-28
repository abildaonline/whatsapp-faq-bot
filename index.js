const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const faq = require('./config/settings');  // Вот это добавь в начале

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('FAQ_Bot готов к работе!');
});

// Вот сюда, ниже, вставляешь обработчик сообщений, который я тебе скинул
client.on('message', async msg => {
    if (msg.body.startsWith('!faq')) {
        const query = msg.body.replace('!faq', '').trim().toLowerCase();

        if (!query) {
            let response = '📚 Список доступных вопросов:\n\n';
            faq.forEach((item, index) => {
                response += `${index + 1}. ${item.question}\n`;
            });
            response += '\nНапишите `!faq ВОПРОС` чтобы получить ответ.';
            msg.reply(response);
        } else {
            const found = faq.find(item => item.question.toLowerCase() === query);
            if (found) {
                msg.reply(`ℹ️ ${found.answer}`);
            } else {
                msg.reply('❓ Вопрос не найден. Напишите !faq чтобы получить список доступных вопросов.');
            }
        }
    }
});

client.initialize();
