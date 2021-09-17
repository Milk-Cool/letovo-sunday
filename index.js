const http = require("http");
const puppeteer = require('puppeteer');

http.createServer((req, res) => {
	setTimeout(() => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		req.on('data', chunk => {
			try{
				chunk = JSON.parse(chunk);
			}catch(e){
				res.end("ERR");
			}
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
					const o1 = await page.evaluate(element => element.textContent, await page.$("#nav-tray-portal > span > span > div > div > div > div > div > span > div > h2"));
					await page.waitForSelector("#edit_profile_form > div > div.image-block-image.profile-avatar-wrapper > a");
					const o2 = await page.evaluate(() => getComputedStyle(document.querySelector("#edit_profile_form > div > div.image-block-image.profile-avatar-wrapper > a")).backgroundImage);
					const o3 = await page.evaluate(() => document.querySelector("#breadcrumbs > ul > li:nth-child(2) > a").getAttribute("href"));
					const o4 = await page.evaluate(element => element.textContent, await page.$("#edit_profile_form > div > div.profileContent__Block > div:nth-child(5) > div.hide-if-editing"));
					
					res.end(JSON.stringify({
						"bio": o4,
						"grade": new Date().getFullYear() - parseInt(chunk.user) + 11 + Number(new Date().getMonth() > 7),
						"icon-url": o2.slice(5, -2),
						"id": o3.slice(7),
						"name": {
							"full": o1,
							"first": o1.split(" ")[0],
							"last": o1.split(" ")[1]
						}
					}));
					await browser.close();
				})().catch(err => {
					res.end("ERR");
				});
			}
			catch(e){
				res.end("ERR");
			}
		});
	}, 0);
}).listen(/*process.env.PORT || */8080);
console.log("Port: " + process.env.PORT || 8080);
