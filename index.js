const http = require("http");
const puppeteer = require('puppeteer');

http.createServer((req, res) => {
	setTimeout(() => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/plain");
		req.on('data', chunk => {
			chunk = JSON.parse(chunk);
			// console.log(JSON.stringify(chunk)); / Убрано из-за соображений безопасности.
			try{
				(async () => {
					const browser = await puppeteer.launch({args: ["--no-sandbox", "--disable-setuid-sandbox"]});
					const page = await browser.newPage();
					await page.goto('https://canvas.letovo.ru/profile');
					await page.waitForSelector("#pseudonym_session_unique_id");
					await page.type("#pseudonym_session_unique_id", chunk.user);
					await page.waitForSelector("#pseudonym_session_password");
					await page.type("#pseudonym_session_password", chunk.password);
					await page.waitForSelector("#login_form > div.ic-Login__actions > div.ic-Form-control.ic-Form-control--login > button");
					await page.click("#login_form > div.ic-Login__actions > div.ic-Form-control.ic-Form-control--login > button");
					await page.waitForSelector("#global_nav_profile_link");
					await page.click("#global_nav_profile_link");
					await page.waitForSelector("#nav-tray-portal > span > span > div > div > div > div > div > span > div > h2");
					res.end(await page.evaluate(element => element.textContent, await page.$("#nav-tray-portal > span > span > div > div > div > div > div > span > div > h2")));
					await browser.close();
				})();
			catch(e){
				res.end("ERR");
			}
		});
	}, 0);
}).listen(process.env.PORT || 8080);
console.log("Port: " + process.env.PORT || 8080);
