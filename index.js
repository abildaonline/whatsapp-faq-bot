const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

const contacts = {
    '1': `Павлодарская область\n\nНурсеит: wa.me/77081828038\nАйжана: wa.me/77785767549\nОлжас: wa.me/77473790928\nАлтынай: wa.me/77083422766`,
    '2': `Карагандинская область\n\nМухтар: wa.me/77078500488\nНурдаулет: wa.me/77778676813\nБейбит ага: wa.me/77019121115\nЕлнур: wa.me/77019176717\nАяжан: wa.me/77772892505`,
    '3': `Улытау\n\nАскар: wa.me/77011135310\nДамир: wa.me/77472715541\nДиас: wa.me/77082271199`,
    '4': `Западно-Казахстанская область\n\nАнуар: wa.me/77076142160\nДанияр: wa.me/77756457386`,
    '5': `Мангистауская область\n\nСанжар: wa.me/77023334344\nАружан: wa.me/77078555196\nАсет: wa.me/77051493901`,
    '6': `Акмолинская область\n\nЖанибек: wa.me/77085222044\nМадина: wa.me/77476699054\nДиас: wa.me/77019593424\nУлжан: wa.me/770755176652`,
    '7': `Актюбинская область\n\nАлишер: wa.me/77005151125\nЖания: wa.me/77011133345\nКайыржан: wa.me/77478734710\nАйым: wa.me/77077296172\nСабина: wa.me/77471415989`,
};

let userState = {};

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('FAQ_Bot готов к работе!');
});

client.on('message', async (msg) => {
    const chatId = msg.from;
    const message = msg.body.trim();

    if (!userState[chatId]) {
        userState[chatId] = 'MAIN_MENU';
        await sendMainMenu(chatId);
        return;
    }

    if (userState[chatId] === 'MAIN_MENU') {
        if (message === '1') {
            await sendBudgetPlanningMenu(chatId);
        } else if (message === '2') {
            await sendBudgetExecutionMenu(chatId);
        } else if (message === '3') {
            await sendRegionMenu(chatId);
            userState[chatId] = 'REGION_SELECTION';
        } else {
            await sendMainMenu(chatId);
        }
    } else if (userState[chatId] === 'REGION_SELECTION') {
        if (contacts[message]) {
            await client.sendMessage(chatId, contacts[message]);
            userState[chatId] = 'MAIN_MENU';
            await sendMainMenu(chatId);
        } else {
            await sendRegionMenu(chatId);
        }
    }
});

async function sendMainMenu(chatId) {
    const menu = `
Добро пожаловать в службу поддержки eAkimat365. Напишите ваш вопрос, и мы ответим вам как можно скорее.
eAkimat365 қолдау қызметіне қош келдіңіз. Сұрағыңызды жазыңыз, біз сізге тезірек жауап беруге тырысамыз.

Выберите интересующий вас раздел или задайте свой вопрос:
1️⃣ Бюджетное планирование / Бюджетные заявки
2️⃣ Исполнение бюджета
3️⃣ Контакты консультантов по регионам

Введите номер категории или напишите ваш вопрос.
    `;
    await client.sendMessage(chatId, menu);
}

async function sendBudgetPlanningMenu(chatId) {
    const message = `
📊 Бюджетное планирование / Бюджетные заявки

1. Свод по АБП/ГУ/ГККП - https://www.youtube.com/watch?v=GzjaSix006s
2. Форма расчетов - https://www.youtube.com/watch?v=r0vhgW3alQE
3. Штатное расписание - https://www.youtube.com/watch?v=0YDfPnUejeg
4. Бюджетные инвестиционные проекты - https://www.youtube.com/watch?v=z4H_ozpMSq4
5. Бюджетные программы - https://www.youtube.com/watch?v=btpCmqzFcnw

🔙 Для возврата в главное меню отправьте любое сообщение.
    `;
    await client.sendMessage(chatId, message);
    userState[chatId] = 'MAIN_MENU';
}

async function sendBudgetExecutionMenu(chatId) {
    const message = `
📊 Исполнение бюджета

Формирование:
1. Индивидуальный план финансирования - https://www.youtube.com/watch?v=1LU3cm020mo
2. План финансирования - https://www.youtube.com/watch?v=FnQUHdAF9pI

Заявки на внесение изменений:
3. Заявки и Справки - https://www.youtube.com/watch?v=lFoY3fKLUVk
4. Уточненный план - https://www.youtube.com/watch?v=6OR4ztOq9mU

Мониторинг исполнения:
5. Мониторинг исполнения - https://www.youtube.com/watch?v=HHZv7tKh3cM

🔙 Для возврата в главное меню отправьте любое сообщение.
    `;
    await client.sendMessage(chatId, message);
    userState[chatId] = 'MAIN_MENU';
}

async function sendRegionMenu(chatId) {
    const regions = `
Выберите регион:
1️⃣ Павлодарская область
2️⃣ Карагандинская область
3️⃣ Улытау
4️⃣ Западно-Казахстанская область
5️⃣ Мангистауская область
6️⃣ Акмолинская область
7️⃣ Актюбинская область

Введите номер региона.
    `;
    await client.sendMessage(chatId, regions);
}

client.initialize();
