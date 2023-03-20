
const fs = require('fs')
const path = require('path')

module.exports = class {
	constructor() {
		this.watchFileName ="router.json,condition.json,easycom.json,globalStyle.json,tabBar.json,subPackages.json"
		this.pagesJsonPath = path.join(path.resolve(), "pages.json")
	}
	
	static init() {
		return new this()
	}
	
	start(watchDirs) {
		let dirsList = []
		if (watchDirs) {
			let dirs = null
			if (watchDirs.indexOf(',') > -1) {
				dirs = watchDirs.split(',')
				dirs.forEach(dir => {
					dirsList.push(path.join(path.resolve(), dir))
				})
			} else {
				dirsList.push(path.join(path.resolve(), watchDirs))
			}
		}
		try {
			let pagesData = {}
			let files = []
			dirsList.forEach(dir => {
			  files = files.concat(this.loadFile(dir))
			})
			files.forEach(file => {
			  const fileData = fs.readFileSync(file, 'utf-8')
				if (fileData) {
					const data = eval("(" + fileData + ")")
					for (let key in data) {
						const objData = data[key] || {}
						if (Array.isArray(objData)) {
							if (pagesData[key]) {
								for (let i = 0; i < objData.length; i++) {
									const newSubPackageData = objData[i]
									let isIdentical = false
									for (let a = 0; a < pagesData[key].length; a++) {
										const oldSubPackagesData = pagesData[key][a]
										if (JSON.stringify(newSubPackageData) == JSON.stringify(oldSubPackagesData)) {
											isIdentical = true
											break;
										}
									}
									if (!isIdentical) {
										pagesData[key].push(newSubPackageData)
									}
								}
							} else {
								pagesData[key] = objData
							}
						} else {
							pagesData[key] = objData
						}
					}
				}
			})
			fs.writeFileSync(this.pagesJsonPath, JSON.stringify(pagesData))
		} catch(e) {
			console.error('文件解析失败', e)
		}
	}
	
	loadFile(dirPath) {
	  let files = []
	  let dirItems = fs.readdirSync(dirPath)
	  dirItems.forEach(item => {
			if (fs.statSync(path.join(dirPath, item)).isDirectory()) {
				const _files = this.loadFile(path.join(dirPath, item))
				if (_files.length > 0) {
				  files = files.concat(_files)
				}
			} else if (this.watchFileName.indexOf(item) > -1) {
				files.push(path.join(dirPath, item))
			}
	  })
	  return files
	}
}





