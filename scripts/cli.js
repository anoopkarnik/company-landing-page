#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repoUrl = "https://github.com/anoopkarnik/company-landing-page.git";

const copyFile = (source, destination) => {
  try {
    fs.copyFileSync(source, destination);
    console.log(`✅ Copied ${source} -> ${destination}`);
  } catch (error) {
    console.error(`❌ Failed to copy ${source} -> ${destination}:`, error.message);
  }
};

const main = () => {
  const args = process.argv.slice(2);
  const targetDir = args[0] || "company-landing-page";

  console.log(`Cloning the repository into ${targetDir}...`);
  execSync(`git clone --depth=1 ${repoUrl} ${targetDir}`, { stdio: "inherit" });

  console.log("Copying environment file for next-js app...");
  copyFile(
    path.join(targetDir, "apps/nextjs-app/.env.example"),
    path.join(targetDir, "apps/nextjs-app/.env")
  );

  console.log("Copying environment file for strapi-cms app...");
  copyFile(
    path.join(targetDir, "apps/strapi-cms-app/.env.example"),
    path.join(targetDir, "apps/strapi-cms-app/.env")
  );

  console.log("Installing dependencies...");
  execSync(`cd ${targetDir} && npm install`, { stdio: "inherit" });

  console.log("🚀 Your SaaS company landing page is ready! 🎉");
};

main();
