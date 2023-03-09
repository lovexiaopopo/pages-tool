#!/usr/bin/env node

// const program = require('commander');
const inquirer = require('inquirer');
// const pkg = require('../package.json');
// const Watch=require('../lib/watch').init();
// const init=require('../lib/init').init();

// program.command('init').description('对应用进行初始化,创建config目录、sub-packages目录、workers目录，这步不是必须，你也可以在今后的开发中，自己创建').action(function(cmd){
// 	 init.start();
// 	 console.log('inquirer----', inquirer)
// });

// program.command('watch').description('对相关文件及目录进行监控')
// .action(function(){
// 	  Watch.start();
// });

// program.version(pkg.version, '-v, --version').parse(process.argv)

// const questions = [{
// 		type: 'input',
// 		name: 'dirs',
// 		message: '请输入要配置的目录',
// 		default: 'pages,config,sub-packages'
// 	}, {
// 		type: 'input',
// 		name: 'files',
// 		message: '请输入要配置的文件',
// 		default: 'pages.json'
// 	}]
const questions = [{
		type: 'input',
		name: 'dirs',
		message: '请输入要配置的目录',
		default: 'pages,config,sub-packages,easy-com,global-style'
	}]
	
let configDirs = []
	
inquirer.prompt(questions).then(res => {
	const configs = res.dirs
	if (configs) {
		if (configs.indexOf(',') > -1) {
			configDirs = configs.split(',')
		} else {
			configDirs = configs
		}
		console.log('configDirs---', configDirs)
	}
}).catch(err => {
	console.log('err', err.message)
})

