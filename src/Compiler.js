const path = require('path');
const fs = require('fs');
const { Table } = require('console-table-printer');
const p = new Table();

class Complier {
  constructor(config) {
    this.config = config
  }
  run() {
    try {
      this.diffPackage(this.config.packageJson, this.config.packageLock)
    } catch (error) {
      console.log('Error: 内容错误')
    }
  }
  diffPackage (packageJson, packageLock) {
    const dependencies = packageJson.dependencies || {}
    for (const key in dependencies) {
      const packageVersion = dependencies[key]
      const lockDependencies = packageLock.dependencies || {}
      for (const current in lockDependencies) {
        // 找到这个包
        if (current === key) {
          // 去掉尖叫号
          const row = {}
          let version = packageVersion
          if (!/\d/.test(packageVersion[0])) {
            version = packageVersion.slice(1)
          }
          // 比较安装的版本
          const lockVersion = lockDependencies[current].version
          row['name'] = key
          row['package'] = packageVersion
          row['package-lock'] = lockVersion
          let color = { color: 'green' }
          if (version === lockVersion) {
            row['result'] = 'Yes'
          } else {
            row['result'] = 'No'
            color = { color: 'red' }
          }
          p.addRow(row, color)
        }
      }
    }
    p.printTable()
  }
}

module.exports = Complier
