import puppeteer from 'puppeteer';

async function getImages(url) {
    const iOSUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1";
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials'
        ],
        devtools: true, 
        defaultViewport: { hasTouch: true, isMobile: true, height: 1080, width: 1920, },
    });
    const page = await browser.newPage();
    await page.setUserAgent(iOSUserAgent);
    await page.goto(url, { waitUntil: 'networkidle2' });

    const images = await page.evaluate(() => {
        const imgElements = document.querySelectorAll('img');
        const imgUrls = [];
        imgElements.forEach((img) => {
            const src = img.getAttribute('src');
            if (src) {
                imgUrls.push(src);
            }
        });
        return imgUrls;
    });

    await browser.close();
    return images;
}

export default { getImages };