#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const repoUrl = 'https://github.com/anoopkarnik/company-landing-page.git';

const main = () => {
  const args = process.argv.slice(2);
  const targetDir = args[0] || 'my-turborepo';

  console.log(`Cloning the repository into ${targetDir}...`);
  execSync(`git clone --depth=1 ${repoUrl} ${targetDir}`, { stdio: 'inherit' });

  console.log('Installing dependencies...');
  execSync(`cd ${targetDir} && npm install`, { stdio: 'inherit' });

  console.log('Your Turborepo is ready! 🎉');
};

main();
