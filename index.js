const fs = require("fs");
const http = require("http");
const { exec } = require("child_process");
!fs.existsSync(`accounts`) && fs.mkdirSync(`accounts`, { recursive: true });
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
			try{
				const path = "accounts/" + chunk.user + ".json";
				switch(chunk.mode){
					case "exist":
						res.end(JSON.stringify({"exist": fs.existsSync(path)}));
						break;
					case "update":
						exec("curl -X POST -H \"Content-Type: application/json\" -d '" + JSON.stringify(chunk) + "' http://letafo-eu.herokuapp.com", (err, stdout, stderr) => {
							if(err || stdout == "ERR" || stdout.startsWith("<")) res.end("ERR");
							else {
								fs.writeFileSync(path, stdout);
							    	res.end(stdout);
							}
						});
						break;
					case "info":
						res.end(JSON.stringify({"info": fs.readFileSync(path, "utf-8")}));
						break;
					default:
						res.end("ERR");
						break;
				}
			}
			catch(e){
				res.end("ERR");
			}
		});
	}, 0);
}).listen(process.env.PORT || 8080);
console.log("Port: " + process.env.PORT || 8080);
