import test from 'ava'
import puppeteer from "puppeteer";



// 要运行的 JavaScript 代码
const jsCode = `
    (() => {
        const x = 5;
        const y = 10;
        return x + y;
    })();
`;

async function runJSInBrowser(jsCode: string): Promise<any> {
    // 启动无头浏览器实例
    const browser = await puppeteer.launch();
    // 打开新页面
    const page = await browser.newPage();

    try {
        // 在页面上下文中执行 JS 代码
        const result = await page.evaluate((code) => {
            return eval(code); // 使用 eval 执行传入的 JS 代码
        }, jsCode);

        console.log('Result:', result);
        return result
    } catch (error) {
        console.error('Error executing JS code:', error);
    } finally {
        // 关闭浏览器
        await browser.close();
    }
    return null
}

test('runJSInBrowser test', async t => {
    const result = await runJSInBrowser(jsCode);
    t.is(result, 15);
});