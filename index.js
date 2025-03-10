const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Логирование всех событий
function logEvent(chatId, eventDescription) {
    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });
    console.log(`[${timestamp}] [${chatId}] ${eventDescription}`);
}

// Безопасная отправка сообщений
async function safeSendMessage(chatId, text) {
    try {
        await client.sendMessage(chatId, text);  // тут должен быть вызов client.sendMessage
    } catch (error) {
        console.error(`❌ Ошибка при отправке сообщения пользователю ${chatId}:`, error);
    }
}

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
        `📞 Нурсеит: +7 (705) 388-54-20\n` +
        `📞 Дияр: +7 (708) 483-66-03`,

    '2': `🧑‍💻 Контактные номера для связи с консультантами по Карагандинской области:\n\n` +
        `📞 Мухтар: +7 (707) 850-04-88\n` +
        `📞 Бейбит: +7 (701) 912-11-15\n` +
        `📞 Елнур: +7 (701) 917-67-17\n` +
        `📞 Аяжан: +7 (777) 289-25-05`,

    '3': `🧑‍💻 Контактные номера для связи с консультантами по Улытауской области:\n\n` +
        `📞 Аскар: +7 (701) 113-53-10\n` +
        `📞 Дамир: +7 (747) 271-55-41\n` +
        `📞 Адиль: +7 (778) 111-05-48\n` +
        `📞 Нурлыбек: +7 (700) 667-28-76`,

    '4': `🧑‍💻 Контактные номера для связи с консультантами по Западно-Казахстанской области:\n\n` +
        `📞 Ануар: +7 (707) 614-21-60\n` +
        `📞 Данияр: +7 (775) 645-73-86\n` +
        `📞 Диас: +7 (708) 227-11-99\n` +
        `📞 Темирхан: +7 (707) 216-30-04`,

    '5': `🧑‍💻 Контактные номера для связи с консультантами по Мангистауской области:\n\n` +
        `📞 Санжар: +7 (702) 333-43-44\n` +
        `📞 Шерхан: +7 (707) 726-00-11\n` +
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
        '1': 'https://youtu.be/GzjaSix006s',
        '2': 'https://youtu.be/r0vhgW3alQE',
        '3': 'https://youtu.be/-nvj_fBTygA',
        '4': 'https://youtu.be/z4H_ozpMSq4',
        '5': 'https://youtu.be/btpCmqzFcnw'
    },
    budgetExecution: {
        '1': 'https://youtu.be/1LU3cm020mo',
        '2': 'https://youtu.be/FnQUHdAF9pI',
        '3': 'https://youtu.be/O1E_lZr26WU',
        '4': 'https://youtu.be/6OR4ztOq9mU',
        '5': 'https://youtu.be/HHZv7tKh3cM'
    },
    popularQuestions: {
        '1': 'https://youtu.be/5EfL8z5x3nM',
        '2': 'https://youtu.be/jkuTdRfkusM',
        '3': 'https://youtu.be/s2T0HrR1JIk',
        '4': 'https://youtu.be/qjCZKNWQ3u8',
        '5': 'https://youtu.be/rsFZq_GAeb0',
        '6': 'https://youtu.be/5EfL8z5x3nM',
        '7': 'https://youtu.be/cIuQDpVJsmg',
        '8': 'https://youtu.be/jRFaVrpV70U',
        '9': 'https://youtu.be/m9BtwZHBOGA',
        '10': 'https://youtu.be/qA4bnld5eoo',
        '11': 'https://youtu.be/xsLGK5FCgb0',
        '12': 'https://youtu.be/8QkKaaS_x-c',
        '13': 'https://youtu.be/EL7yPi8BRsA',
        '14': 'https://youtu.be/rBlr4tcm1Dc',
        '15': 'https://youtu.be/pnsOuhJ9TFQ',
        '16': 'https://youtu.be/YPtKNq_FBfc',
        '17': 'https://youtu.be/RbfRhH3C3OE',
        '18': 'https://youtu.be/-DWepVRHs6A',
        '19': 'https://youtu.be/Xupc_-V3ft0',
        '20': 'https://youtu.be/5n6y_k1DZGU',
        '21': 'https://youtu.be/L03mpJJ1-j8'
    }
};

// 🔄 Сообщение для выбора другого вопроса
const RESELECT_PROMPT = '🔄 Для перехода к другому вопросу отправьте его номер';

let userState = {};
let inactivityTimers = {};

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('FAQ_Bot готов к работе!'));

let operatorMessageSent = {};  // Объявляем здесь, над client.on чтобы сохранять данные

client.on('message', async msg => {
    const chatId = msg.from;
    const message = msg.body.trim();

    // Лог о полученном сообщении
    console.log(`[INFO] Получено сообщение от ${chatId}: ${message}`);

    resetInactivityTimer(chatId);

    // Инициализация состояния пользователя, если оно отсутствует
    if (!userState[chatId]) {
        console.log(`[INFO] Новый пользователь ${chatId}, показываю главное меню.`);
        userState[chatId] = 'MAIN_MENU';
        await sendMainMenu(chatId);
        return;
    }

    // Возврат в главное меню при вводе 0
    if (message === '0') {
        console.log(`[INFO] Пользователь ${chatId} вернулся в главное меню.`);
        userState[chatId] = 'MAIN_MENU';
        await sendMainMenu(chatId);
        return;
    }

    // Проверка на случай, если состояние пользователя вдруг отсутствует (практически невозможно)
    if (!userState[chatId]) {
        await safeSendMessage(chatId, '❌ Неверный ввод. Пожалуйста, отправьте 0️⃣ для возврата в главное меню 🔙');
        return;
    }

    switch (userState[chatId]) {
        // 🏠 Главное меню
        case 'MAIN_MENU':
            console.log(`[INFO] Пользователь ${chatId} в главном меню.`);
            if (/^[1-8]$/.test(message)) {  // Проверяем, является ли сообщение одной цифрой от 1 до 8
                console.log(`[INFO] Пользователь ${chatId} выбрал пункт главного меню: ${message}`);
                await handleMainMenuSelection(chatId, message);
            } else {
                console.log(`[WARN] Пользователь ${chatId} ввел некорректную цифру в главном меню: ${message}`);
                await safeSendMessage(chatId, '❌ Неправильный номер. Пожалуйста, выберите цифру из списка');
            }
            break;
    
        // 👤 Зарегистрироваться в eAkimat365
        case 'CHOOSE_REGION_FOR_REGISTRATION':  // 🆕 Новый кейс для регистрации
            console.log(`[INFO] Пользователь ${chatId} выбирает регион для регистрации.`);
            await handleRegionSelection(chatId, message);  // 🟢 Отправляем инструкцию по регистрации
            break;
    
        // 🗺️ Вход в eAkimat365 (выбор региона)
        case 'CHOOSE_REGION':
            console.log(`[INFO] Пользователь ${chatId} выбирает регион для входа.`);
            await handleRegionSelection(chatId, message);  // 🟢 Отправляем инструкцию по входу
            break;
    
        // 💰 Бюджетное планирование
        case 'BUDGET_PLANNING':
            console.log(`[INFO] Пользователь ${chatId} в разделе "Бюджетное планирование".`);
            if (/^[0-5]$/.test(message)) {  // Проверяем, что введена цифра от 0 до 5
                console.log(`[INFO] Пользователь ${chatId} выбрал пункт: ${message}`);
                
                if (message === '0') {
                    userState[chatId] = 'MAIN_MENU';  // Если 0 — возвращаем в главное меню
                    await sendMainMenu(chatId);
                } else {
                    await handleVideoSelection(chatId, message, 'budgetPlanning', sendBudgetPlanningMenu);
                }
            } else {
                console.log(`[WARN] Пользователь ${chatId} ввел некорректную цифру: ${message}`);
                await safeSendMessage(chatId, '❌ Неправильный номер. Пожалуйста, выберите цифру из списка');
            }
            break;

        // ✅ Исполнение бюджета
        case 'BUDGET_EXECUTION':
            console.log(`[INFO] Пользователь ${chatId} в разделе "Исполнение бюджета".`);
            if (/^[0-5]$/.test(message)) {  // Проверяем, что введена цифра от 0 до 5
                console.log(`[INFO] Пользователь ${chatId} выбрал пункт: ${message}`);
                
                if (message === '0') {
                    userState[chatId] = 'MAIN_MENU';  // Если 0 — возвращаем в главное меню
                    await sendMainMenu(chatId);
                } else {
                    await handleVideoSelection(chatId, message, 'budgetExecution', sendBudgetPlanningMenu);
                }
            } else {
                console.log(`[WARN] Пользователь ${chatId} ввел некорректную цифру: ${message}`);
                await safeSendMessage(chatId, '❌ Неправильный номер. Пожалуйста, выберите цифру из списка');
            }
            break;

        // ❓ Ответы на самые популярные вопросы
        case 'POPULAR_QUESTIONS_VIDEOS':
            console.log(`[INFO] Пользователь ${chatId} смотрит популярные вопросы.`);
            if (/^([0-9]|1[0-9]|20|21)$/.test(message)) {  // Проверяем, является ли сообщение цифрой от 0 до 21
                console.log(`[INFO] Пользователь ${chatId} выбрал видео номер: ${message}`);
                
                if (message === '0') {
                    userState[chatId] = 'MAIN_MENU';  // Если 0 — возвращаем в главное меню
                    await sendMainMenu(chatId);
                } else {
                    await handleVideoSelection(chatId, message, 'popularQuestions', sendBudgetPlanningMenu);
                }
            } else {
                console.log(`[WARN] Пользователь ${chatId} ввел некорректную цифру: ${message}`);
                await safeSendMessage(chatId, '❌ Неправильный номер. Пожалуйста, выберите цифру из списка');
            }
            break;
    
        // 📞 Контакты консультантов по областям
        case 'CONSULTANT_CONTACTS':
            console.log(`[INFO] Пользователь ${chatId} в разделе "Контакты консультантов".`);
            if (/^[0-7]$/.test(message)) {  // Проверяем, является ли сообщение цифрой от 0 до 7
                console.log(`[INFO] Пользователь ${chatId} выбрал область: ${message}`);
                await sendConsultantContact(chatId, message);
            } else {
                console.log(`[WARN] Пользователь ${chatId} ввел некорректную цифру: ${message}`);
                await safeSendMessage(chatId, '❌ Неправильный номер. Пожалуйста, выберите цифру из списка');
            }
            break;
    
            case 'TECH_SUPPORT':
                console.log(`[INFO] Пользователь ${chatId} в разделе "Техническая поддержка".`);
                if (message === '0') {
                    userState[chatId] = 'MAIN_MENU';  // Возвращаем в главное меню
                    await sendMainMenu(chatId);
                } else {
                    console.log(`[WARN] Пользователь ${chatId} ввел некорректную цифру: ${message}`);
                    await safeSendMessage(chatId, '❌ Неправильный номер. Пожалуйста, выберите цифру из списка');
                }
                break;            
    
        // 💬 Связаться с оператором
        case 'OPERATOR_MODE':
            console.log(`[INFO] Пользователь ${chatId} ждет оператора.`);
            if (!operatorMessageSent[chatId]) {  // Проверяем, отправлено ли сообщение ранее
                await safeSendMessage(chatId,
                    '🕒 Пожалуйста, подождите немного. Наш оператор скоро ответит.\n\n' +
                    '0️⃣ Для возврата в главное меню 🔙'
                );
                operatorMessageSent[chatId] = true;  // Помечаем, что сообщение отправлено
            }
            break;
    
        // ❌ Неверный ввод
        default:
            console.log(`[WARN] Пользователь ${chatId} попал в неизвестное состояние: ${userState[chatId]}`);
            await safeSendMessage(chatId, '❌ Неверный ввод. Пожалуйста, выберите номер из меню (0-8).');
            await sendMainMenu(chatId);
            break;
    }
});
    


    

function resetInactivityTimer(chatId) {
    if (inactivityTimers[chatId]) clearTimeout(inactivityTimers[chatId]);
    
    inactivityTimers[chatId] = setTimeout(() => {
        console.log(`[INFO] Автосброс пользователя ${chatId} через 15 минут бездействия`);
        userState[chatId] = 'MAIN_MENU';  // Просто сбрасываем в главное меню
        safeSendMessage(chatId, '⌛ Время ожидания истекло. Возвращаю в главное меню 🔙');
        sendMainMenu(chatId);
    }, 15 * 60 * 1000); // 15 минут в миллисекундах
}


function setStateAndSend(chatId, state, sendFunction) {
    userState[chatId] = state;
    sendFunction(chatId);
}

async function handleMainMenuSelection(chatId, message) {
    const actions = {
        '1': () => setStateAndSend(chatId, 'CHOOSE_REGION_FOR_REGISTRATION', sendRegionMenu),  // 🆕 Новый пункт для регистрации
        '2': () => setStateAndSend(chatId, 'CHOOSE_REGION', sendRegionMenu),
        '3': () => setStateAndSend(chatId, 'BUDGET_PLANNING', sendBudgetPlanningMenu),
        '4': () => setStateAndSend(chatId, 'BUDGET_EXECUTION', sendBudgetExecutionMenu),
        '5': () => setStateAndSend(chatId, 'POPULAR_QUESTIONS_VIDEOS', sendPopularQuestionsMenu),
        '6': () => setStateAndSend(chatId, 'CONSULTANT_CONTACTS', sendRegionMenu),
        '7': () => {  // Добавили состояние для техподдержки
            userState[chatId] = 'TECH_SUPPORT';
            sendTechnicalSupportContacts(chatId);
        },
        '8': () => setStateAndSend(chatId, 'OPERATOR_MODE', () => safeSendMessage(chatId, 
        '✍️ Пожалуйста, напишите свой вопрос. Наш оператор ответит вам как можно скорее. Мы ценим ваше терпение и постараемся помочь в ближайшее время 😊\n\n' +
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
        await safeSendMessage(chatId, RESELECT_PROMPT);  // Используем константу
        await safeSendMessage(chatId, '0️⃣ Для возврата в главное меню 🔙');
    } else {
        await safeSendMessage(chatId, '❌ Видео для этого раздела пока недоступно.');
    }
}

async function handleBudgetPlanningSelection(chatId, message) {
    await handleVideoSelection(chatId, message, 'budgetPlanning', sendBudgetPlanningMenu);
}

async function handleBudgetExecutionSelection(chatId, message) {
    await handleVideoSelection(chatId, message, 'budgetExecution', sendBudgetExecutionMenu);
}

async function handlePopularQuestionsSelection(chatId, message) {
    await handleVideoSelection(chatId, message, 'popularQuestions', sendPopularQuestionsMenu);
}

async function sendVideo(chatId, link) {
    if (link) {
        await safeSendMessage(chatId, 
            '🎥 Посмотрите видеоинструкцию по ссылке:\n\n' +
            `${link}`
        );
    }
}


async function sendConsultantContact(chatId, message) {
    const contact = consultantContacts[message];
    if (contact) {
        await safeSendMessage(chatId, contact);
        await safeSendMessage(chatId, 
            '🔄 Для выбора другой области отправьте её номер\n' +
            '0️⃣ Для возврата в главное меню 🔙'
        );
    }
}

async function sendRegistrationInstructions(chatId, region) {
    await safeSendMessage(chatId, 
        `📍 ${region.name}\n\n` +
        `👤 *Как зарегистрироваться*\n` +
        `1. Перейдите по ссылке: ${region.link}\n` +
        `2. На сайте нажмите на *ЗАЯВКА НА ДОСТУП*\n` +
        `3. Вы увидите следующее сообщение:\n\n` +
        `> *Уважаемый Пользователь!*\n` +
        `> Для предоставления доступа к системе eAkimat365 вам необходимо оформить заявку\n` +
        `> Подписанную и заверенную печатью заявку нужно:\n` +
        `> - Отсканировать;\n` +
        `> - Вложить в письмо отсканированную версию и файл заявки в формате Excel;\n` +
        `> - Отправить на электронную почту 📧 *help@csi.kz*\n\n` +
        `4. Чтобы скачать файл Excel для оформления заявки, нажмите на текст *Формы заявок*\n\n` +
        `❗ Внутри файла Excel представлены примеры заполнения для получения доступа к системе eAkimat365\n\n` +
        `💡 Если у вас возникли трудности с регистрацией, обратитесь в техподдержку\n` +
        `📧 help@csi.kz\n` +
        `📞 +7 (7172) 97-22-42\n` +
        `📞 +7 (778) 021-13-17\n` +
        `💬 WhatsApp: +7 (707) 227-57-58 (только для сообщений)\n\n` +
        `🔄 Для выбора другой области отправьте её номер\n` +
        `0️⃣ Для возврата в главное меню.`
    );
}



async function handleRegionSelection(chatId, message) {
    const region = regionLinks[message];
    if (region) {
        if (userState[chatId] === 'CHOOSE_REGION_FOR_REGISTRATION') {
            // 🟢 Если пользователь выбрал регистрацию, отправляем инструкцию по регистрации
            await sendRegistrationInstructions(chatId, region);
        } else if (userState[chatId] === 'CHOOSE_REGION') {
            // 🟢 Если пользователь выбрал вход, отправляем инструкцию по входу
            if (message === '7') {  // Проверяем, выбрана ли Актюбинская область (ключ '7')
                await safeSendMessage(chatId, 
                    `📍 ${region.name}\n` +
                    `🌐 ${region.link}\n\n` +
                    `🔑 Способ входа\n\n` +
                    `🛡️ Вход с помощью ЭЦП\n` +
                    `👉 Выберите вход по ЭЦП пользователя, зарегистрированного в системе eAkimat365\n` +
                    `🔐 Введите пароль от ключа\n\n` +
                    `❗ Пожалуйста, выберите ЭЦП ключ физического лица, зарегистрированного в системе eAkimat365\n\n` +
                    `💡 Если у вас возникли трудности со входом, обратитесь в техподдержку\n` +
                    `📧 help@csi.kz\n` +
                    `📞 +7 (7172) 97-22-42\n` +
                    `📞 +7 (778) 021-13-17\n` +
                    `💬 WhatsApp: +7 (707) 227-57-58 (только для сообщений)\n\n` +
                    `🔄 Для выбора другой области отправьте её номер\n` +
                    `0️⃣ Для возврата в главное меню 🔙`
                );
            } else {
                await safeSendMessage(chatId, 
                    `📍 ${region.name}\n` +
                    `🌐 ${region.link}\n\n` +
                    `🔑 Способы входа\n\n` +
                    `1. Вход с помощью ЭЦП\n` +
                    `👉 Выберите вход по ЭЦП пользователя, зарегистрированного в системе eAkimat365\n` +
                    `🔐 Введите пароль от ключа\n\n` +
                    `2. Вход по ИИН и паролю\n` +
                    `👉 Выберите вход по ИИН и паролю\n` +
                    `🔐 Введите ваш ИИН зарегистрированного в системе eAkimat365 и пароль\n\n` +
                    `❗ Если вы входите впервые, используйте стандартный пароль: *12345*\n` +
                    `После этого создайте новый надёжный пароль и никому его не сообщайте (конфиденциально)\n\n` +
                    `💡 Если у вас возникли трудности со входом, обратитесь в техподдержку\n` +
                    `📧 help@csi.kz\n` +
                    `📞 +7 (7172) 97-22-42\n` +
                    `📞 +7 (778) 021-13-17\n` +
                    `💬 WhatsApp: +7 (707) 227-57-58 (только для сообщений)\n\n` +
                    `🔄 Для выбора другой области отправьте её номер\n` +
                    `0️⃣ Для возврата в главное меню 🔙`
                );
            }
        } else {
            await sendRegionMenu(chatId);  // Если состояние не определено
        }
    } else {
        await safeSendMessage(chatId, '❌ Неправильный номер. Пожалуйста, выберите цифру из списка');
    }
}



function sendMainMenu(chatId) {
    safeSendMessage(chatId, 
        '👋 Добро пожаловать в службу поддержки eAkimat365\n\n' +
        '🏠 Главное меню\n\n' +
        'Чтобы перейти в нужный раздел, отправьте соответствующую цифру 👇\n\n' +
        '1️⃣ 👤 Зарегистрироваться в eAkimat365\n' +  // 🆕 Новый пункт меню
        '2️⃣ 🔑 Вход в eAkimat365\n' +
        '3️⃣ 💰 Бюджетное планирование\n' +
        '4️⃣ ✅ Исполнение бюджета\n' +
        '5️⃣ ❓ Ответы на самые популярные вопросы\n' +
        '6️⃣ 📞 Контакты консультантов по областям\n' +
        '7️⃣ ⚙️ Контакты техподдержки\n' +
        '8️⃣ 💬 Связаться с оператором'
    );
}


function sendRegionMenu(chatId) {
    safeSendMessage(chatId, 
        '🗺️ Выберите область РК\n\n' +
        'Чтобы перейти в нужный раздел, отправьте соответствующую цифру 👇\n\n' +
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
    safeSendMessage(chatId, 
        '💰 Бюджетное планирование\n\n' +
        'Чтобы перейти в нужный раздел, отправьте соответствующую цифру 👇\n\n' +
        '1️⃣ Свод по АБП/ГУ/ГККП\n' +
        '2️⃣ Форма расчетов\n' +
        '3️⃣ Штатное расписание\n' +
        '4️⃣ Бюджетные инвестиционные проекты\n' +
        '5️⃣ Бюджетные программы\n\n' +
        '0️⃣ 🔙 Главное меню'
    );
}


function sendBudgetExecutionMenu(chatId) {
    safeSendMessage(chatId, 
        '✅ Исполнение бюджета\n\n' +
        'Чтобы перейти в нужный раздел, отправьте соответствующую цифру 👇\n\n' +
        '1️⃣ Индивидуальный план финансирования\n' +
        '2️⃣ План финансирования\n' +
        '3️⃣ Заявки на внесение изменений и дополнений\n' +
        '4️⃣ Уточненный план\n' +
        '5️⃣ Мониторинг исполнения. Казначейские формы\n\n' +
        '0️⃣ 🔙 Главное меню'
    );
}


function sendPopularQuestionsMenu(chatId) {
    safeSendMessage(chatId, 
        '❓ Ответы на самые популярные вопросы\n\n' +
        'Чтобы перейти в нужный раздел, отправьте соответствующую цифру 👇\n\n' +
        '1️⃣ Как АБП вернуть БЗ на доработку в ГУ?\n' +
        '2️⃣ Почему я не могу ввести данные в формах расчета? (Форма расчетов)\n' +
        '3️⃣ Как продублировать БЗ на последующие года планового периода? (Форма расчетов)\n' +
        '4️⃣ Как ГУ отправить БЗ на согласование в АБП?\n' +
        '5️⃣ Как распределить сумму оклада и доплат по разным подпрограммам? (Штатное расписание)\n' +
        '6️⃣ Как в досье поменять год? (Штатное расписание)\n' +
        '7️⃣ Как ввести данные на следующий плановый период или год? (Форма расчетов)\n' +
        '8️⃣ Как выгрузить все формы расчетов? (Форма расчетов)\n' +
        '9️⃣ Как заполнять специфики с расшифровкой в форме расчетов? (Форма расчетов)\n' +
        '1️⃣0️⃣ Как сделать так, чтобы сотруднику не начислялись пенсионные взносы? (Штатное расписание)\n' +
        '1️⃣1️⃣ Как указать часовую нагрузку в тарификации? (Штатное расписание)\n' +
        '1️⃣2️⃣ Как в системе выбрать другую бюджетную программу для начисления доплаты? (Штатное расписание)\n' +
        '1️⃣3️⃣ Как распределить оклад, если повышение по поправочному коэффициенту идет по другой бюджетной программе? (Штатное расписание)\n' +
        '1️⃣4️⃣ Что делать если неправильно рассчитался оклад? (Штатное расписание)\n' +
        '1️⃣5️⃣ Что делать если неправильно рассчитались доплаты? (Штатное расписание)\n' +
        '1️⃣6️⃣ Как отметить сезонных рабочих? (Штатное расписание)\n' +
        '1️⃣7️⃣ Как выгрузить сводные приложения 57-61? (Форма ГУ)\n' +
        '1️⃣8️⃣ Как внести изменения в ИПФ или в заявку на внесение изменений после отправки на согласование к АБП? (Заявки на внесение изменений)\n' +
        '1️⃣9️⃣ Как добавить программу в индивидуальном плане финансирования?\n' +
        '2️⃣0️⃣ Не активна кнопка «Создать» во вкладке «Заявки ГУ». (Заявки)\n' +
        '2️⃣1️⃣ Как отправить на доработку ИПФ? (Индивидуальный план финансирования)\n\n' +
        '0️⃣ 🔙 Главное меню'
    );
}


function sendTechnicalSupportContacts(chatId) {
    safeSendMessage(chatId,
        'Cлужба технической поддержки eAkimat 365\n\n' +
        '📧 help@csi.kz\n' +
        '📞 +7 (7172) 97-22-42\n' +
        '📞 +7 (778) 021-13-17\n' +
        '💬 WhatsApp: +7 (707) 227-57-58 (только для сообщений)\n\n' +
        '0️⃣ Для возврата в главное меню 🔙'
    );
}


client.initialize();
