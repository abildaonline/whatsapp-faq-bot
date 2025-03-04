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

const consultantContacts = {
'1': `Контактные номера для связи с консультантами по Павлодарской области:

📞 Олжас: +7 (747) 379-09-28
📞 Айжана: +7 (778) 576-75-49
📞 Алтынай: +7 (708) 342-27-66
📞 Нурсеит: +7 (708) 182-80-38
📞 Дияр: +7 (708) 483-66-03`,

    '2': `Контактные номера для связи с консультантами по Карагандинской области:

📞 Мухтар: +7 (707) 850-04-88
📞 Бейбит: +7 (701) 912-11-15
📞 Елнур: +7 (701) 917-67-17
📞 Аяжан: +7 (777) 289-25-05`,

    '3': `Контактные номера для связи с консультантами по Улытауской области:

📞 Аскар: +7 (701) 113-53-10
📞 Дамир: +7 (747) 271-55-41
📞 Адиль: +7 (778) 111-05-48`,

    '4': `Контактные номера для связи с консультантами по Западно-Казахстанской области:

📞 Ануар: +7 (707) 614-21-60
📞 Данияр: +7 (775) 645-73-86
📞 Диас: +7 (708) 227-11-99
📞 Темірхан: +7 (707) 216-30-04`,

    '5': `Контактные номера для связи с консультантами по Мангистауской области:

📞 Санжар: +7 (702) 333-43-44
📞 Аружан: +7 (707) 855-51-96
📞 Асет: +7 (705) 149-39-01
📞 Диана: +7 (708) 128-99-29`,

    '6': `Контактные номера для связи с консультантами по Акмолинской области:

📞 Жанибек: +7 (708) 522-20-44
📞 Мадина: +7 (747) 669-90-54
📞 Улжан: +7 (705) 517-66-52
📞 Кайыржан: +7 (747) 873-47-10
📞 Айбек: +7 (707) 700-00-32`,

    '7': `Контактные номера для связи с консультантами по Актюбинской области:
📞 Алишер: +7 (700) 515-11-25
📞 Жания: +7 (701) 113-33-45
📞 Нурдаулет: +7 (777) 867-68-13
📞 Ерсаят: +7 (707) 159-13-19
📞 Бек: +7 (777) 403-95-74
📞 Зумрад: +7 (775) 666-81-24`
};

const videoLinks = {
    budgetPlanning: {
        '1': 'https://www.youtube.com/watch?v=GzjaSix006s',
        '2': 'https://www.youtube.com/watch?v=r0vhgW3alQE',
        '3': 'https://www.youtube.com/watch?v=0YDfPnUejeg',
        '4': 'https://www.youtube.com/watch?v=z4H_ozpMSq4',
        '5': 'https://www.youtube.com/watch?v=btpCmqzFcnw'
    },
    budgetExecution: {
        '1': 'https://www.youtube.com/watch?v=1LU3cm020mo',
        '2': 'https://www.youtube.com/watch?v=FnQUHdAF9pI',
        '3': 'https://www.youtube.com/watch?v=lFoY3fKLUVk',
        '4': 'https://www.youtube.com/watch?v=6OR4ztOq9mU',
        '5': 'https://www.youtube.com/watch?v=HHZv7tKh3cM'
    },
    signers: 'https://www.youtube.com/watch?v=tiCEv958CQ8&list=PL4jwFLRAXDimzcqnIRqROqSLzYREpiYZX&index=5'
};

let userState = {};
let inactivityTimers = {};

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('FAQ_Bot готов к работе!'));

client.on('message', async msg => {
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
    
    // Если пользователь нигде не застрял и не в процессе выбора (например, после контактов техподдержки)
    if (userState[chatId] === undefined) {
        client.sendMessage(chatId, '❌ Неверный ввод. Пожалуйста, отправьте 0️⃣ для возврата в главное меню.');
        return;
    }
    

    switch (userState[chatId]) {
        case 'MAIN_MENU':
            await handleMainMenuSelection(chatId, message);
            break;
            case 'BUDGET_PLANNING':
                await sendVideo(chatId, videoLinks.budgetPlanning[message]);
                await sendBudgetPlanningMenu(chatId);
                break;
            case 'BUDGET_EXECUTION':
                await sendVideo(chatId, videoLinks.budgetExecution[message]);
                await sendBudgetExecutionMenu(chatId);
                break;
        case 'CHOOSE_REGION':
            await handleRegionSelection(chatId, message);
            break;
        case 'CONSULTANT_CONTACTS':
            await sendConsultantContact(chatId, message);
            break;
        case 'OPERATOR_MODE':
            await client.sendMessage(chatId, '🕒 Пожалуйста, ожидайте ответа оператора.');
            break;
        default:
            await client.sendMessage(chatId, '❌ Неверный ввод. Пожалуйста, выберите номер из меню (0-7).');
            await sendMainMenu(chatId);
            break;
    }
});

function resetInactivityTimer(chatId) {
    if (inactivityTimers[chatId]) clearTimeout(inactivityTimers[chatId]);
    inactivityTimers[chatId] = setTimeout(() => {
        delete userState[chatId];
        client.sendMessage(chatId, '⌛ Время ожидания истекло. Возвращаю в главное меню.');
        sendMainMenu(chatId);
    }, 60 * 60 * 1000);
}

function setStateAndSend(chatId, state, sendFunction) {
    userState[chatId] = state;
    sendFunction(chatId);
}

async function handleMainMenuSelection(chatId, message) {
    const actions = {
        '1': () => setStateAndSend(chatId, 'CHOOSE_REGION', sendRegionMenu),
        '2': () => setStateAndSend(chatId, 'BUDGET_PLANNING', sendBudgetPlanningMenu),
        '3': () => setStateAndSend(chatId, 'BUDGET_EXECUTION', sendBudgetExecutionMenu),
        '4': async () => {
            await sendVideo(chatId, videoLinks.signers);
            await client.sendMessage(chatId, '0️⃣ Для возврата в главное меню 🔙');
        },
        '5': () => setStateAndSend(chatId, 'CONSULTANT_CONTACTS', sendRegionMenu),
        '6': () => sendTechnicalSupportContacts(chatId),
        '7': () => setStateAndSend(chatId, 'OPERATOR_MODE', () => client.sendMessage(chatId, '🕒 Оператор подключится...'))
    };

    if (actions[message]) {
        await actions[message]();
    } else {
        await sendMainMenu(chatId);
    }
}

async function handleBudgetPlanningSelection(chatId, message) {
    const link = videoLinks.budgetPlanning[message];
    if (link) await sendVideo(chatId, link);
    await sendBudgetPlanningMenu(chatId);
}

async function handleBudgetExecutionSelection(chatId, message) {
    const link = videoLinks.budgetExecution[message];
    if (link) await sendVideo(chatId, link);
    await sendBudgetExecutionMenu(chatId);
}

async function sendVideo(chatId, link) {
    if (link) await client.sendMessage(chatId, `🖥️ Видео: ${link}`);
}

async function sendConsultantContact(chatId, message) {
    const contact = consultantContacts[message];
    if (contact) {
        await client.sendMessage(chatId, contact);
        await client.sendMessage(chatId, '0️⃣ Для возврата в главное меню отправьте 0.');
    } else {
        await client.sendMessage(chatId, '❌ Некорректный ввод. Пожалуйста, выберите правильную область или нажмите 0️⃣ для возврата в главное меню.');
    }
}


async function handleRegionSelection(chatId, message) {
    const region = regionLinks[message];
    if (region) {
        await client.sendMessage(chatId, `📍 ${region.name}\n🌐 ${region.link}\n🔑 Способы входа: ЭЦП или ИИН+пароль

1. Вход с помощью ЭЦП
👉 Выберите вход по ЭЦП пользователя, зарегистрированного в системе eAkimat365.
🔐 Введите пароль от ключа.

2. Вход по ИИН и паролю
👉 Выберите вход по ИИН и паролю.
🔐 Введите ваш ИИН зарегистрированного в системе eAkimat365 и пароль.

❓ Если вы заходите в систему впервые, используйте стандартный пароль: *12345*

💡 Важно: Если у вас возникли трудности со входом, обратитесь в техподдержку:\n📧 help@csi.kz\n📞 +7 (7172) 97-22-42\n📞 +7 (778) 021-13-17

🔄 Для выбора другой области просто отправьте номер области.
0️⃣ Для возврата в главное меню 🔙
`);
        // НЕ отправляем главное меню сразу, оставляем в состоянии выбора области
    } else {
        await sendRegionMenu(chatId);  // Если выбрал неправильную цифру
    }
}


function sendMainMenu(chatId) {
    client.sendMessage(chatId, `
Добро пожаловать в службу поддержки eAkimat365.

Выберите интересующий вас раздел:

1️⃣ Вход в eAkimat365
2️⃣ Бюджетное планирование
3️⃣ Исполнение бюджета
4️⃣ Видео по подписантам
5️⃣ Контакты консультантов по областям
6️⃣ Контакты техподдержки
7️⃣ Связаться с оператором
`);
}

function sendRegionMenu(chatId) {
    client.sendMessage(chatId, 
        'Выберите область РК:\n\n' +  // Добавил дополнительный перенос строки здесь
        '1️⃣ Павлодарская\n' +
        '2️⃣ Карагандинская\n' +
        '3️⃣ Улытауская\n' +
        '4️⃣ Западно-Казахстанская область\n' +
        '5️⃣ Мангистауская\n' +
        '6️⃣ Акмолинская\n' +
        '7️⃣ Актюбинская\n\n' +  // Дополнительный перенос перед меню
        '0️⃣ Главное меню'
    );
}

function sendBudgetPlanningMenu(chatId) {
    client.sendMessage(chatId, `
Бюджетное планирование:

1️⃣ Свод по АБП/ГУ/ГККП
2️⃣ Форма расчетов
3️⃣ Штатное расписание
4️⃣ Бюджетные инвестпроекты
5️⃣ Бюджетные программы
0️⃣ Главное меню
`);
}

function sendBudgetExecutionMenu(chatId) {
    client.sendMessage(chatId, `
Исполнение бюджета:

1️⃣ Индивидуальный план финансирования
2️⃣ План финансирования
3️⃣ Заявки на изменения
4️⃣ Уточненный план
5️⃣ Мониторинг исполнения
0️⃣ Главное меню
`);
}

function sendTechnicalSupportContacts(chatId) {
    client.sendMessage(chatId,
        'Cлужба технической поддержки eAkimat 365\n\n' +  // Добавил дополнительный перенос строки здесь
        '📧 help@csi.kz\n' +
        '📞 +7 (7172) 97-22-42\n' +
        '📞 +7 (778) 021-13-17\n\n' +
        '0️⃣ Для возврата в главное меню 🔙'
    );
}


client.initialize();
