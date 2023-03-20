#!/usr/bin/env node

const Init = require('../lib/init').init()
const Watch = require('../lib/watch').init()
const inquirer = require('inquirer')

const commands = [{
    type: 'list',
    name: 'command',
    message: '执行 init or watch ？',
    choices: ['init', 'watch'],
    // 对用户的回答进行转换，返回转换过的结果
    filter(val) {
      return val.toLowerCase();
    },
    default: 'init', // 注意：default 值为转化前的值
  }]

const initDirs = [{
		type: 'input',
		name: 'dirs',
		message: '请输入要配置的目录',
		default: 'pages,config'
	}]
	
const watchDirs = [{
		type: 'input',
		name: 'dirs',
		message: '请输入要监听的文件目录',
		default: 'pages,config,os_project,tn_components'
	}]
	
let commKey = ''
let configDirs = []

inquirer.prompt(commands).then(res => {
	commKey = res.command
	if (commKey === 'init') {
		inquirer.prompt(initDirs).then(res => {
			const configs = res.dirs
			if (configs) {
				if (configs.indexOf(',') > -1) {
					configDirs = configs.split(',')
				} else {
					configDirs = configs
				}
				Init.start(configDirs)
			}
		}).catch(err => {
			console.log('err--initDirs', err)
		})
	} else if (commKey === 'watch') {
		inquirer.prompt(watchDirs).then(res => {
			const configs = res.dirs
			if (configs) {
				Watch.start(configs)
			}
		}).catch(err => {
			console.log('err--watchDirs', err)
		})
	}
})