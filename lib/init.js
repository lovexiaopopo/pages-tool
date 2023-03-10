
const fs = require('fs')
const path = require('path')

module.exports = class {
	constructor(pagesJsonData) {
		this.pagesData = pagesJsonData
	}
	
	static init() {
		// 获取pages.json文件内容
		let pagesJsonData = {}
		const pagesJsonFilePath = path.join(path.resolve(),'pages.json')
		if(fs.existsSync(pagesJsonFilePath)) {
			let dataStr = fs.readFileSync(pagesJsonFilePath,'utf-8')
			pagesJsonData = eval("("+dataStr+")")
		}
		return new this(pagesJsonData)
	}
	
	start(customDirs) {
		console.log('开始目录初始化...--start')
		this.initDir(customDirs)
		this.createPagesConfigRouter(this.pagesData)
		this.createPagesFileRouter(this.pagesData)
		this.createSubPackagesFileRouter(this.pagesData)
		console.log('目录初始化完成...--end')
	}
	
	// 创建要初始化的目录文件
	initDir(customDirs) {
		const initDirsPath = customDirs.map(dir => {
			return path.join(path.resolve(), dir)
		})
		
		initDirsPath.forEach(dirPath => {
			if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)
		})
	}
	
	// copyDirectory(src, dest) {
	//   if (!fs.existsSync(src)) {
	//     return false
	//   }
	//   if (!fs.existsSync(dest)) {
	//     fs.mkdirSync(dest)
	//   }
	//   var dirs = fs.readdirSync(src)
	//   dirs.forEach((item)=>{
	//     var item_path = path.join(src, item)
	//     var temp = fs.statSync(item_path)
	//     if (temp.isFile()) { // 是文件
	//       // console.log("Item Is File:" + item)
	//       fs.copyFileSync(item_path, path.join(dest, item))
	//     } else if (temp.isDirectory()){ // 是目录
	//       // console.log("Item Is Directory:" + item)
	//       this.copyDirectory(item_path, path.join(dest, item))
	//     }
	//   })
	// }
	createPagesConfigRouter(pagesData) {
		// 将pages.json ['condition', 'easy-com', 'global-style', 'tab-bar']值映射到config文件中
		// config中展示文件（condition.json, easy-com.json, global-style.json, tab-bar.json）
		// 声明pages.json设置项和分包配置文件
		const pagesConfigJson = ['condition', 'easycom', 'globalStyle', 'tabBar']
		pagesConfigJson.forEach(config => {
			const jsonPath = path.join(path.resolve(), 'config', `${config}.json`)
			let jsonData = {}
			jsonData[`${config}`] = pagesData[config]
			if (!fs.existsSync(jsonPath)) {
				fs.writeFileSync(jsonPath,JSON.stringify(jsonData))
			}
		})
	}
	
	createPagesFileRouter(pagesData) {
		// 将pages文件下在pages.json中存在的路由 配置在pages中对应的文件夹下router.json中
		const pagesDir = path.join(path.resolve(),'pages')
		const pagesDirItems = fs.readdirSync(pagesDir)
		pagesDirItems.forEach(item => {
			const dirPath = path.join(pagesDir, item)
			// 当前路径是否是文件夹 若是 则为每个文件夹创建router.json文件
			if (fs.statSync(dirPath).isDirectory()) {
				const itemRouterFilePath = path.join(dirPath,'router.json')
				if (!fs.existsSync(itemRouterFilePath)) {
					let jsonData = { "pages":[] }
					const pagesJsonData = pagesData['pages'] || []
					
					if(Array.isArray(pagesJsonData) && pagesJsonData.length) {
						pagesJsonData.forEach(pageData => {
							if(path.join(path.resolve(), '/'+pageData.path,'../').indexOf(dirPath) > -1) {
								jsonData['pages'].push(pageData)
							}
						})
						fs.writeFileSync(itemRouterFilePath,JSON.stringify(jsonData))
					}
				}
			}
		})
	}
	
	// 创建sub-packages分包配置文件
	createSubPackagesFileRouter(pagesData) {
		// 对pages.json中sub-packages文件的路由router.json配置到对应的子包下面
		const subPackagesJson = ['os_project', 'tn_components']
		subPackagesJson.forEach(subPackAgeFile => {
			const subPackagePath = path.join(path.resolve(), subPackAgeFile)
			const subPackageJsonData = pagesData['subPackages'] || []
			
			if (!fs.existsSync(subPackagePath)) {
				fs.mkdirSync(subPackagePath)
			}
			if (Array.isArray(subPackageJsonData) && subPackageJsonData.length) {
				subPackageJsonData.forEach(subPackageData => {
					const root = subPackageData && subPackageData.root
					let jsonData = { "subPackages": [] }
					if (root === subPackAgeFile) {
						jsonData['subPackages'].push(subPackageData)
						const subPackagesRootPath = path.join(subPackagePath, 'subPackages.json')
						fs.writeFileSync(subPackagesRootPath, JSON.stringify(jsonData))
					}
				})
			}
		})
	}
}