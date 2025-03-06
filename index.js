const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

const regionLinks = {
    '1': { name: '🌳 Павлодарская область', link: 'https://pavlodar.csi.kz' },
    '2': { name: '⛏️ Карагандинская область', link: 'https://krg.csi.kz' },
    '3': { name: '🏔️ Улытауская область', link: 'https://ulytau.csi.kz' },
    '4': { name: '🏭 Западно-Казахстанская область', link: 'https://oral.csi.kz' },
    '5': { name: '🌊 Мангистауская область', link: 'https://mangystau.csi.kz' },
    '6': { name: '🏞️ Акмолинская область', link: 'https://aqmola.csi.kz' },
    '7': { name: '🏜️ Актюбинская область', link: 'https://aktobe.csi.kz' }
};

const consultantContacts = {
    '1': `🧑‍💻 Контактные номера для связи с консультантами по Павлодарской области:\n\n` +
        `📞 Олжас: +7 (747) 379-09-28\n` +
        `📞 Айжана: +7 (778) 576-75-49\n` +
        `📞 Алтынай: +7 (708) 342-27-66\n` +
        `📞 Нурсеит: +7 (708) 182-80-38\n` +
        `📞 Дияр: +7 (708) 483-66-03`,

    '2': `🧑‍💻 Контактные номера для связи с консультантами по Карагандинской области:\n\n` +
        `📞 Мухтар: +7 (707) 850-04-88\n` +
        `📞 Бейбит: +7 (701) 912-11-15\n` +
        `📞 Елнур: +7 (701) 917-67-17\n` +
        `📞 Аяжан: +7 (777) 289-25-05`,

    '3': `🧑‍💻 Контактные номера для связи с консультантами по Улытауской области:\n\n` +
        `📞 Аскар: +7 (701) 113-53-10\n` +
        `📞 Дамир: +7 (747) 271-55-41\n` +
        `📞 Адиль: +7 (778) 111-05-48`,

    '4': `🧑‍💻 Контактные номера для связи с консультантами по Западно-Казахстанской области:\n\n` +
        `📞 Ануар: +7 (707) 614-21-60\n` +
        `📞 Данияр: +7 (775) 645-73-86\n` +
        `📞 Диас: +7 (708) 227-11-99\n` +
        `📞 Темірхан: +7 (707) 216-30-04`,

    '5': `🧑‍💻 Контактные номера для связи с консультантами по Мангистауской области:\n\n` +
        `📞 Санжар: +7 (702) 333-43-44\n` +
        `📞 Аружан: +7 (707) 855-51-96\n` +
        `📞 Асет: +7 (705) 149-39-01\n` +
        `📞 Диана: +7 (708) 128-99-29`,

    '6': `🧑‍💻 Контактные номера для связи с консультантами по Акмолинской области:\n\n` +
        `📞 Жанибек: +7 (708) 522-20-44\n` +
        `📞 Мадина: +7 (747) 669-90-54\n` +
        `📞 Улжан: +7 (705) 517-66-52\n` +
        `📞 Кайыржан: +7 (747) 873-47-10\n` +
        `📞 Айбек: +7 (707) 700-00-32`,

    '7': `🧑‍💻 Контактные номера для связи с консультантами по Актюбинской области:\n\n` +
        `📞 Алишер: +7 (700) 515-11-25\n` +
        `📞 Жания: +7 (701) 113-33-45\n` +
        `📞 Нурдаулет: +7 (777) 867-68-13\n` +
        `📞 Ерсаят: +7 (707) 159-13-19\n` +
        `📞 Бек: +7 (777) 403-95-74\n` +
        `📞 Зумрад: +7 (775) 666-81-24`
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
    popularQuestions: {
        '1': 'https://youtu.be/5EfL8z5x3nM',
        '2': 'https://youtu.be/jkuTdRfkusM',
        '3': 'https://youtu.be/s2T0HrR1JIk',
        '4': 'https://youtu.be/qjCZKNWQ3u8',
        '5': 'https://youtu.be/GkRHVqFNzz4'
    }
};

let userState = {};
let inactivityTimers = {};

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('FAQ_Bot готов к работе!'));

client.on('message', async msg => {
    const chatId = msg.from;
    const message = msg.body.trim();

    resetInactivityTimer(chatId);

    // Инициализация состояния пользователя, если оно отсутствует
    if (!userState[chatId]) {
        userState[chatId] = 'MAIN_MENU';
        await sendMainMenu(chatId);
        return;
    }

    // Возврат в главное меню при вводе 0
    if (message === '0') {
        userState[chatId] = 'MAIN_MENU';
        await sendMainMenu(chatId);
        return;
    }

    // Проверка на случай, если состояние пользователя вдруг отсутствует (практически невозможно)
    if (!userState[chatId]) {
        await client.sendMessage(chatId, '❌ Неверный ввод. Пожалуйста, отправьте 0️⃣ для возврата в главное меню 🔙');
        return;
    }

    switch (userState[chatId]) {
        // 🏠 Главное меню
        case 'MAIN_MENU':
            await handleMainMenuSelection(chatId, message);
            break;
    
        // 💰 Бюджетное планирование
        case 'BUDGET_PLANNING':
            await handleVideoSelection(chatId, message, 'budgetPlanning', sendBudgetPlanningMenu);
            break;
    
        // ✅ Исполнение бюджета
        case 'BUDGET_EXECUTION':
            await handleVideoSelection(chatId, message, 'budgetExecution', sendBudgetExecutionMenu);
            break;
    
        // ❓ Ответы на самые популярные вопросы
        case 'POPULAR_QUESTIONS_VIDEOS':
            await handleVideoSelection(chatId, message, 'popularQuestions', sendPopularQuestionsMenu);
            break;
    
        // 🗺️ Выберите область РК
        case 'CHOOSE_REGION':
            await handleRegionSelection(chatId, message);
            break;
    
        // 📞 Контакты консультантов по областям
        case 'CONSULTANT_CONTACTS':
            await sendConsultantContact(chatId, message);
            break;
    
        // 💬 Связаться с оператором
        case 'OPERATOR_MODE':
            await client.sendMessage(chatId,
                '🕒 Пожалуйста, подождите немного. Наш оператор скоро ответит.\n\n' +
                '0️⃣ Для возврата в главное меню 🔙'
            );
            break;
    
        // ❌ Неверный ввод
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
        client.sendMessage(chatId, '⌛ Время ожидания истекло. Возвращаю в главное меню 🔙');
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
        '4': () => setStateAndSend(chatId, 'POPULAR_QUESTIONS_VIDEOS', sendPopularQuestionsMenu),  // 🆕 Изменено: используем состояние и меню для подписантов
        '5': () => setStateAndSend(chatId, 'CONSULTANT_CONTACTS', sendRegionMenu),
        '6': () => sendTechnicalSupportContacts(chatId),
        '7': () => setStateAndSend(chatId, 'OPERATOR_MODE', () => client.sendMessage(chatId, 
        '🕒 Пожалуйста, напишите свой вопрос. Наш оператор ответит вам как можно скорее. Мы ценим ваше терпение и постараемся помочь в ближайшее время.\n\n' +
        '0️⃣ Для возврата в главное меню 🔙'))
    };

    if (actions[message]) {
        await actions[message]();
    } else {
        await sendMainMenu(chatId);
    }
}


// 🛠️ Универсальная функция для обработки выбора видео
async function handleVideoSelection(chatId, message, section, menuFunction) {
    const link = videoLinks[section][message];
    if (link) {
        await sendVideo(chatId, link);  // Отправляем ссылку на видео
    }
    await menuFunction(chatId);  // Сразу отправляем меню раздела
}

async function handleBudgetPlanningSelection(chatId, message) {
    await handleVideoSelection(chatId, message, 'budgetPlanning', sendBudgetPlanningMenu);
}

async function handleBudgetExecutionSelection(chatId, message) {
    await handleVideoSelection(chatId, message, 'budgetExecution', sendBudgetExecutionMenu);
}

async function handlePopularQuestionsSelection(chatId, message) {  // 🆕 Для подписантов
    await handleVideoSelection(chatId, message, 'popularQuestions', sendPopularQuestionsMenu);
}

async function sendVideo(chatId, link) {
    if (link) {
        await client.sendMessage(chatId, 
            '🎥 Посмотрите видеоинструкцию по ссылке\n\n' +
            `👉 ${link} 👈`
        );
    }
}


async function sendConsultantContact(chatId, message) {
    const contact = consultantContacts[message];
    if (contact) {
        await client.sendMessage(chatId, contact);
        await client.sendMessage(chatId, 
            '🔄 Для выбора другой области просто отправьте номер области.\n' +
            '0️⃣ Для возврата в главное меню 🔙'
        );
    }
}



async function handleRegionSelection(chatId, message) {
    const region = regionLinks[message];
    if (region) {
        await client.sendMessage(chatId, 
            `📍 ${region.name}\n` +
            `🌐 ${region.link}\n\n` +
            `🔑 Способы входа 👇\n\n` +
            `1. Вход с помощью ЭЦП — электронная (цифровая) подпись\n` +
            `👉 Выберите вход по ЭЦП пользователя, зарегистрированного в системе eAkimat365.\n` +
            `🔐 Введите пароль от ключа.\n\n` +
            `2. Вход по ИИН и паролю\n` +
            `👉 Выберите вход по ИИН и паролю.\n` +
            `🔐 Введите ваш ИИН зарегистрированного в системе eAkimat365 и пароль.\n\n` +
            `❓ Если вы входите впервые, используйте стандартный пароль: *12345*\n` +
            `После этого создайте новый надёжный пароль и никому его не сообщайте (конфиденциально).\n\n` +
            `💡 Важно: Если у вас возникли трудности со входом, обратитесь в техподдержку:\n` +
            `📧 help@csi.kz\n` +
            `📞 +7 (7172) 97-22-42\n` +
            `📞 +7 (778) 021-13-17\n` +
            `💬 WhatsApp: +7 (707) 227-57-58 (только для сообщений)\n\n` +
            `🔄 Для выбора другой области просто отправьте номер области.\n` +
            `0️⃣ Для возврата в главное меню 🔙`
        );
        // НЕ отправляем главное меню сразу, оставляем в состоянии выбора области
    } else {
        await sendRegionMenu(chatId);  // Если выбрал неправильную цифру
    }
}



function sendMainMenu(chatId) {
    client.sendMessage(chatId, 
        '👋 Добро пожаловать в службу поддержки eAkimat365\n\n' +
        '👇 Чтобы перейти в нужный раздел, отправьте соответствующую цифру:\n\n' +
        '1️⃣ 🔑 Вход в eAkimat365\n' +
        '2️⃣ 💰 Бюджетное планирование\n' +
        '3️⃣ ✅ Исполнение бюджета\n' +
        '4️⃣ ❓ Ответы на самые популярные вопросы\n' +
        '5️⃣ 📞 Контакты консультантов по областям\n' +
        '6️⃣ ⚙️ Контакты техподдержки\n' +
        '7️⃣ 💬 Связаться с оператором'
    );
}


function sendRegionMenu(chatId) {
    client.sendMessage(chatId, 
        '🗺️ Выберите область РК:\n\n' +
        '👇 Чтобы перейти в нужный раздел, отправьте соответствующую цифру:\n\n' +
        '1️⃣ 🌳 Павлодарская область\n' +
        '2️⃣ ⛏️ Карагандинская область\n' +
        '3️⃣ 🏔️ Улытауская область\n' +
        '4️⃣ 🏭 Западно-Казахстанская область\n' +
        '5️⃣ 🌊 Мангистауская область\n' +
        '6️⃣ 🏞️ Акмолинская область\n' +
        '7️⃣ 🏜️ Актюбинская область\n\n' +
        '0️⃣ 🔙 Главное меню'
    );
}


function sendBudgetPlanningMenu(chatId) {
    client.sendMessage(chatId, 
        '💰 Бюджетное планирование:\n\n' +
        '👇 Чтобы перейти в нужный раздел, отправьте соответствующую цифру:\n\n' +
        '1️⃣ ● Свод по АБП/ГУ/ГККП\n' +
        '2️⃣ ● Форма расчетов\n' +
        '3️⃣ ● Штатное расписание\n' +
        '4️⃣ ● Бюджетные инвестиционные проекты\n' +
        '5️⃣ ● Бюджетная программы\n\n' +
        '0️⃣ 🔙 Главное меню'
    );
}


function sendBudgetExecutionMenu(chatId) {
    client.sendMessage(chatId, 
        '✅ Исполнение бюджета:\n\n' +
        '👇 Чтобы перейти в нужный раздел, отправьте соответствующую цифру:\n\n' +
        '1️⃣ ● Индивидуальный план финансирования\n' +
        '2️⃣ ● План финансирования\n' +
        '3️⃣ ● Заявки на внесение изменений и дополнений\n' +
        '4️⃣ ● Уточненный план\n' +
        '5️⃣ ● Мониторинг исполнения. Казначейские формы\n\n' +
        '0️⃣ 🔙 Главное меню'
    );
}


function sendPopularQuestionsMenu(chatId) {
    client.sendMessage(chatId, 
        '❓ Ответы на самые популярные вопросы:\n\n' +
        '1️⃣ ● Как АБП вернуть БЗ на доработку в ГУ?\n' +
        '2️⃣ ● Почему я не могу ввести данные в формах расчета? (Форма расчетов)\n' +
        '3️⃣ ● Как продублировать БЗ на последующие года планового периода? (Форма расчетов)\n' +
        '4️⃣ ● Как ГУ отправить БЗ на согласование в АБП?\n' +
        '5️⃣ ● Как в досье поменять год? (Штатное расписание)\n\n' +
        '0️⃣ 🔙 Главное меню'
    );
}


function sendTechnicalSupportContacts(chatId) {
    client.sendMessage(chatId,
        'Cлужба технической поддержки eAkimat 365\n\n' +
        '📧 help@csi.kz\n' +
        '📞 +7 (7172) 97-22-42\n' +
        '📞 +7 (778) 021-13-17\n' +
        '💬 WhatsApp: +7 (707) 227-57-58 (только для сообщений)\n\n' +
        '0️⃣ Для возврата в главное меню 🔙'
    );
}


client.initialize();
