
const fs = require('fs')
const path = require('path')

module.exports = class {
	constructor() {
		this.watchDirs = [
			path.join(path.resolve(), "pages"),
			path.join(path.resolve(), "config")
		]
		
		this.watchFileName ="router.json,condition.json,easycom.json,globalStyle.json,tabBar.json,subPackages.json"
		
		this.pagesJsonPath = path.join(path.resolve(), "pages.json")
	}
	
	static init() {
		return new this()
	}
	
	start() {
		try {
			let pagesData = {}
			let files = []
			this.watchDirs.forEach(dir => {
			  files = files.concat(this.loadFile(dir))
			})
			files.forEach(file => {
			  const fileData = fs.readFileSync(file, 'utf-8')
				if (fileData) {
					const data = eval("(" + fileData + ")")
					for (let key in data) {
						const commKeys = ['pages', 'subPackages']
						commKeys.forEach(commKey => {
							if (key === commKey) {
								if (pagesData[commKey]) {
									if (Array.isArray(data[commKey]) && data[commKey].length) {
										for (let i = 0; i < data[commKey].length; i++) {
										  const newSubPackageData = data[commKey][i]
										  let isIdentical = false
										  for (let a = 0; a < pagesData[commKey].length; a++) {
										    const oldSubPackagesData = pagesData[commKey][a]
										    if (JSON.stringify(newSubPackageData) == JSON.stringify(oldSubPackagesData)) {
										      isIdentical = true
										      break;
										    }
										  }
										  if (!isIdentical) {
										    pagesData[commKey].push(data[commKey][i])
										  }
										}
									}
								} else {
								  pagesData[commKey] = data[commKey]
								}
							} else {
								pagesData[key] = data[key]
							}
						})
					}
				}
			})
			console.log('pagesData----', pagesData)
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





