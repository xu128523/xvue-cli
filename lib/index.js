const shelljs = require('shelljs');
const path = require('path');
const request = require('request');
const fs = require('fs');
const unzip = require('unzip');

const tmpFilename = 'tmp_~~~~.zip';
const getDownloadUri = (type) => {
    if (type === 'vue-cli') {
        return 'https://github.com/xu128523/vue-template/archive/master.zip?ref=v1.0.1';
    }
    return null;
}

const downloadFile = (uri) => {
    return new Promise((resolve, reject) => {
        console.log('开始下载');
        const stream = fs.createWriteStream(tmpFilename);
        request(uri).pipe(stream).on('close', () => {
            console.log('下载完成');
            resolve();
        }).on('error', () => {
            reject();
        })
    });
}

const unzipFile = (dir) => {
    return new Promise((resolve, reject) => {
        console.log('开始解压');
        const outputTmp = 'output_~~~~/'
        fs.createReadStream(tmpFilename)
        .pipe(unzip.Extract({path: outputTmp}))
        .on('close', () => {
            const arr = fs.readdirSync(outputTmp);
            const source = outputTmp + arr[0];
            if (dir === './') {
                shelljs.mv(source + '/.*', dir);
                shelljs.mv(source + '/*', dir);
            } else {
                shelljs.mv(source, dir);
            }
            shelljs.rm('-rf', outputTmp);
            console.log('解压完成');
            resolve();
        }).on('error', () => {
            reject();
        })
    })
}

exports.initDir = (dirPath, type) => {
    const uri = getDownloadUri(type);
    downloadFile(uri).then(() => {
        return unzipFile(dirPath);
    }).then(() => {
        shelljs.rm(tmpFilename);
        console.log(`
# 初始化完成, 请执行以下命令，完成依赖安装:

# 设置node-sass代理地址
npm config set sass_binary_site http://npm.taobao.org/mirrors/node-sass

# 安装yarn工具
npm i -g yarn

cd ${dirPath}

# 安装node_modules依赖
yarn install
...

# 启动服务
npm start
        `);
    }).catch((err) => {
        console.log(err);
    });
}
