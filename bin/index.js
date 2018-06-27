#!/usr/bin/env node

const program = require('commander');
const lib = require('../lib');

program
    .version(require('../package.json').version)
    .usage('init [dir]')
    .arguments('<cmd> [dir]')
    .action((cmd, dir = './') => {
        if (cmd !== 'init') {
            return;
        }
        const templateName = 'vue-cli';
        lib.initDir(dir, templateName);
    });

program.parse(process.argv);
