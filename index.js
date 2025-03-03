const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

const regionLinks = {
    '1': { name: 'Павлодарская область', link: 'https://pavlodar.csi.kz' },
    '2': { name: 'Карагандинская область', link: 'https://krg.csi.kz' },
    '3': { name: 'Улытауская область', link: 'https://ulytau.csi.kz' },
    '4': { name: 'Западно-Казахстанская область', link: 'https://oral.csi.kz' },
    '5': { name: 'Мангистауская область', link: 'https://mangystau.csi.kz' },
    '6': { name: 'Акмолинская область', link: 'https://aqmola.csi.kz' },
    '7': { name: 'Актюбинская область', link: 'https://aktobe.csi.kz' }
};

const videoLinks = {
    budgetPlanning: { '1': 'https://www.youtube.com/watch?v=GzjaSix006s', '2': 'https://www.youtube.com/watch?v=r0vhgW3alQE' },
    budgetExecution: { '1': 'https://www.youtube.com/watch?v=1LU3cm020mo', '2': 'https://www.youtube.com/watch?v=FnQUHdAF9pI' },
    signers: 'https://www.youtube.com/watch?v=tiCEv958CQ8&list=PL4jwFLRAXDimzcqnIRqROqSLzYREpiYZX&index=5'
};

let userState = {};
let inactivityTimers = {};

client.on('qr', (qr) => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('FAQ_Bot готов к работе!'));

client.on('message', async (msg) => {
    const chatId = msg.from;
    const message = msg.body.trim();

    resetInactivityTimer(chatId);

    if (!userState[chatId]) {
        userState[chatId] = 'MAIN_MENU';
        await sendMainMenu(chatId);
        return;
    }

    if (message === '0') {
        userState[chatId] = 'MAIN_MENU';
        await sendMainMenu(chatId);
        return;
    }

    switch (userState[chatId]) {
        case 'MAIN_MENU':
            await handleMainMenuSelection(chatId, message);
            break;
        case 'CHOOSE_REGION':
            await handleRegionSelection(chatId, message);
            break;
        case 'BUDGET_PLANNING':
        case 'BUDGET_EXECUTION':
            if (message === '0') {
                userState[chatId] = 'MAIN_MENU';
                await sendMainMenu(chatId);
            }
            break;
        case 'OPERATOR_MODE':
            await client.sendMessage(chatId, '🕒 Ваше сообщение отправлено оператору. Ожидайте ответа.');
            break;
    }
});

async function handleMainMenuSelection(chatId, message) {
    const handlers = {
        '1': async () => {
            userState[chatId] = 'CHOOSE_REGION';
            await sendRegionMenu(chatId);
        },
        '2': async () => {
            userState[chatId] = 'BUDGET_PLANNING';
            await sendBudgetPlanningMenu(chatId);
        },
        '3': async () => {
            userState[chatId] = 'BUDGET_EXECUTION';
            await sendBudgetExecutionMenu(chatId);
        },
        '4': sendSignersMenu,
        '5': sendRegionContacts,
        '6': sendTechnicalSupportContacts,
        '7': async () => {
            userState[chatId] = 'OPERATOR_MODE';
            await sendOperatorModeMessage(chatId);
        }
    };

    if (handlers[message]) {
        await handlers[message](chatId);
    } else {
        await sendMainMenu(chatId);
    }
}

async function handleRegionSelection(chatId, message) {
    if (regionLinks[message]) {
        await sendLoginInstructions(chatId, regionLinks[message]);
        userState[chatId] = 'MAIN_MENU';
    } else {
        await sendRegionMenu(chatId);
    }
}

async function sendMainMenu(chatId) {
    const menu = `
Добро пожаловать в службу поддержки eAkimat365.

Выберите интересующий вас раздел или задайте свой вопрос:
1️⃣ Как зайти в eAkimat365?
2️⃣ Бюджетное планирование / Бюджетные заявки
3️⃣ Исполнение бюджета
4️⃣ Подписанты
5️⃣ Контакты консультантов по областям
6️⃣ Контакты технической поддержки
7️⃣ Связаться с оператором

Введите номер категории или напишите ваш вопрос.
    `;
    await client.sendMessage(chatId, menu);
}

async function sendRegionMenu(chatId) {
    const menu = `
Выберите область РК:
1️⃣ Павлодарская область
2️⃣ Карагандинская область
3️⃣ Улытауская область
4️⃣ Западно-Казахстанская область
5️⃣ Мангистауская область
6️⃣ Акмолинская область
7️⃣ Актюбинская область

Введите номер области.
    `;
    await client.sendMessage(chatId, menu);
}

async function sendLoginInstructions(chatId, region) {
    const message = `
📌 Инструкция по входу в систему eAkimat365 (${region.name})
🌐 Ссылка: ${region.link}
🔑 Способы входа: ЭЦП или ИИН+пароль (12345)

📧 help@csi.kz
📞 +7 (7172) 97-22-42, +7 (778) 021-13-17

🔙 Для возврата в меню отправьте 0️⃣
    `;
    await client.sendMessage(chatId, message);
}

async function sendBudgetPlanningMenu(chatId) {
    const menu = `
Бюджетное планирование:
1️⃣ Формирование заявок
2️⃣ Корректировка бюджета

🔙 Для возврата в меню отправьте 0️⃣
    `;
    await client.sendMessage(chatId, menu);
}

async function sendBudgetExecutionMenu(chatId) {
    const menu = `
Исполнение бюджета:
1️⃣ Индивидуальный план
2️⃣ План финансирования

🔙 Для возврата в меню отправьте 0️⃣
    `;
    await client.sendMessage(chatId, menu);
}

async function sendSignersMenu(chatId) {
    const message = `
📺 Видео-инструкция по работе с подписантами:
${videoLinks.signers}

🔙 Для возврата в меню отправьте 0️⃣
    `;
    await client.sendMessage(chatId, message);
}

async function sendRegionContacts(chatId) {
    const contacts = `
Контакты консультантов по областям:
1️⃣ Павлодарская область
2️⃣ Карагандинская область
3️⃣ Улытауская область
4️⃣ Западно-Казахстанская область
5️⃣ Мангистауская область
6️⃣ Акмолинская область
7️⃣ Актюбинская область

🔙 Для возврата в меню отправьте 0️⃣
    `;
    await client.sendMessage(chatId, contacts);
}

async function sendTechnicalSupportContacts(chatId) {
    const message = `
📧 Техподдержка: help@csi.kz
📞 +7 (7172) 97-22-42
📞 +7 (778) 021-13-17

🔙 Для возврата в меню отправьте 0️⃣
    `;
    await client.sendMessage(chatId, message);
}

async function sendOperatorModeMessage(chatId) {
    const message = `
🕒 Пожалуйста, подождите. Оператор скоро свяжется с вами.
💬 Вы можете отправлять свои вопросы, и оператор ответит как можно скорее.
🔙 Для возврата в меню отправьте 0️⃣
    `;
    await client.sendMessage(chatId, message);
}

function resetInactivityTimer(chatId) {
    if (inactivityTimers[chatId]) clearTimeout(inactivityTimers[chatId]);
    inactivityTimers[chatId] = setTimeout(() => returnToMainMenuAfterInactivity(chatId), 3600000);
}

async function returnToMainMenuAfterInactivity(chatId) {
    await client.sendMessage(chatId, '⏳ Чат был неактивен в течение 1 часа. Возвращаем вас в главное меню.');
    userState[chatId] = 'MAIN_MENU';
    await sendMainMenu(chatId);
}

client.initialize();
