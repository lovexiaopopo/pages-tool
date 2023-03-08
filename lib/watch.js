const fs = require('fs');
const path = require('path');
const CreatePages = require('./create-pages');
module.exports = class {
	constructor() {
		this.watchDirs = [
			path.join(path.resolve(), "pages")
		];
		
		this.watchFileName ="router.json,condition.json,easy-com.json,global-style.json,config.json,tab-bar.json,preload-rule.json,sub-packages.json";
	}
	
	static init(){
		return new this();
	}
	
	start(){
		let pagesJsonFilePath = path.join(path.resolve(), "pages.json");
		console.log('pagesJsonFilePath----', pagesJsonFilePath)
		let createPages = CreatePages.init(this.watchDirs, this.watchFileName);
		createPages.start();
		// this.watchDirs.forEach((item) => {
		// 	fs.watch(item, {
		// 		recursive: true
		// 	}, (eventType, filename)=> {
		// 		let filePath = path.join(item, filename);
		// 		let fileName = path.basename(filePath);
		// 		console.log('filePath',filename);
		// 		console.log('fileName',fileName);
		// 		if (this.watchFileName.indexOf(fileName) > -1) {
		// 			if (fs.existsSync(pagesJsonFilePath)) {
		// 				let state = fs.statSync(pagesJsonFilePath);
		// 				let lastEditTime = state.mtimeMs;
		// 				let now = new Date().getTime();
		// 				if (now - lastEditTime > 20) {
		// 					createPages.start();
		// 				}
		// 			}
		// 		}
					
		// 	});
		// });
	}
}





