#!/usr/bin/env node

/**
 * Production Build Script for GitHub Actions
 *
 * This script integrates our new automated build system with GitHub Actions.
 * It handles environment setup, builds the portfolio, and prepares for deployment.
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Set production environment
process.env.NODE_ENV = 'production';

class ProductionBuilder {
  constructor() {
    this.rootDir = path.join(__dirname, '../../');
    this.buildSystemDir = path.join(this.rootDir, 'build-system');
    this.outputDir = path.join(this.rootDir, '_site');

    console.log(chalk.blue('🚀 Starting production build for GitHub Actions...'));
    console.log(`   Root directory: ${this.rootDir}`);
    console.log(`   Build system: ${this.buildSystemDir}`);
    console.log(`   Output directory: ${this.outputDir}`);
  }

  async build() {
    try {
      // Step 1: Validate environment
      await this.validateEnvironment();

      // Step 2: Clean previous build
      await this.cleanBuild();

      // Step 3: Run the new build system
      await this.runBuildSystem();

      // Step 4: Prepare for deployment
      await this.prepareDeployment();

      // Step 5: Validate output
      await this.validateOutput();

      console.log(chalk.green('\n✅ Production build completed successfully!'));

    } catch (error) {
      console.error(chalk.red('\n❌ Production build failed:'));
      console.error(chalk.red(error.message));
      console.error(error.stack);
      process.exit(1);
    }
  }

  async validateEnvironment() {
    console.log(chalk.blue('\n🔍 Validating environment...'));

    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`   Node.js version: ${nodeVersion}`);

    // Check if build system exists
    if (!await fs.pathExists(this.buildSystemDir)) {
      throw new Error('Build system directory not found');
    }

    // Check if build system dependencies are installed
    const packageJsonPath = path.join(this.buildSystemDir, 'package.json');
    const nodeModulesPath = path.join(this.buildSystemDir, 'node_modules');

    if (!await fs.pathExists(packageJsonPath)) {
      throw new Error('Build system package.json not found');
    }

    if (!await fs.pathExists(nodeModulesPath)) {
      throw new Error('Build system dependencies not installed. Run: cd build-system && npm install');
    }

    // Check if projects exist
    const projectsDir = path.join(this.rootDir, 'projets');
    if (!await fs.pathExists(projectsDir)) {
      console.warn(chalk.yellow('⚠️  No projects directory found'));
    }

    console.log(chalk.green('   ✅ Environment validation passed'));
  }

  async cleanBuild() {
    console.log(chalk.blue('\n🧹 Cleaning previous build...'));

    // Remove output directory if it exists
    if (await fs.pathExists(this.outputDir)) {
      await fs.remove(this.outputDir);
      console.log('   ✅ Removed previous _site directory');
    }

    // Clean any previous generated files
    const filesToClean = [
      path.join(this.rootDir, 'sitemap.xml'),
      path.join(this.rootDir, 'robots.txt'),
      path.join(this.rootDir, 'seo-report.json'),
      path.join(this.rootDir, 'structured-data.json'),
      path.join(this.rootDir, 'social-media-data.json')
    ];

    for (const file of filesToClean) {
      if (await fs.pathExists(file)) {
        await fs.remove(file);
        console.log(`   ✅ Removed ${path.basename(file)}`);
      }
    }
  }

  async runBuildSystem() {
    console.log(chalk.blue('\n⚙️  Running automated build system...'));

    // Change to build system directory
    const originalCwd = process.cwd();
    process.chdir(this.buildSystemDir);

    try {
      // Import and run the build system
      const PortfolioBuildSystem = require(path.join(this.rootDir, 'build-system', 'build.js'));
      const buildSystem = new PortfolioBuildSystem();

      // Run the build
      await buildSystem.build();

      console.log(chalk.green('   ✅ Build system completed successfully'));

    } catch (error) {
      throw new Error(`Build system failed: ${error.message}`);
    } finally {
      // Restore original working directory
      process.chdir(originalCwd);
    }
  }

  async prepareDeployment() {
    console.log(chalk.blue('\n📦 Preparing deployment...'));

    // Create output directory
    await fs.ensureDir(this.outputDir);

    // Copy main site files
    const staticFiles = [
      'index.html',
      'css/',
      'js/',
      'images/'
    ];

    for (const file of staticFiles) {
      const sourcePath = path.join(this.rootDir, file);
      const targetPath = path.join(this.outputDir, file);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
        console.log(`   ✅ Copied ${file}`);
      } else {
        console.warn(chalk.yellow(`   ⚠️  ${file} not found, skipping`));
      }
    }

    // Copy projects with generated HTML
    const projectsSource = path.join(this.rootDir, 'projets');
    const projectsTarget = path.join(this.outputDir, 'projets');

    if (await fs.pathExists(projectsSource)) {
      await fs.copy(projectsSource, projectsTarget);
      console.log('   ✅ Copied projects directory');
    }

    // Copy generated SEO files
    const seoFiles = [
      'sitemap.xml',
      'robots.txt'
    ];

    for (const file of seoFiles) {
      const sourcePath = path.join(this.rootDir, file);
      const targetPath = path.join(this.outputDir, file);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
        console.log(`   ✅ Copied ${file}`);
      }
    }

    console.log(chalk.green('   ✅ Deployment preparation completed'));
  }

  async validateOutput() {
    console.log(chalk.blue('\n🔍 Validating build output...'));

    // Check essential files
    const requiredFiles = [
      'index.html',
      'css/style.css',
      'js/main.js',
      'projets/index.json'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.outputDir, file);
      if (!await fs.pathExists(filePath)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }

    // Check if we have project HTML files
    const projectsDir = path.join(this.outputDir, 'projets');
    const projectDirs = await fs.readdir(projectsDir);
    const htmlFiles = [];

    for (const dir of projectDirs) {
      const dirPath = path.join(projectsDir, dir);
      const stat = await fs.stat(dirPath);

      if (stat.isDirectory()) {
        const htmlFile = path.join(dirPath, 'index.html');
        if (await fs.pathExists(htmlFile)) {
          htmlFiles.push(dir);
        }
      }
    }

    console.log(`   ✅ Found ${htmlFiles.length} project HTML files`);

    // Validate JSON structure
    const indexJsonPath = path.join(this.outputDir, 'projets', 'index.json');
    if (await fs.pathExists(indexJsonPath)) {
      try {
        const indexData = await fs.readJson(indexJsonPath);
        const projectCount = Array.isArray(indexData) ? indexData.length :
                            indexData.projects ? indexData.projects.length : 0;
        console.log(`   ✅ Project index contains ${projectCount} projects`);
      } catch (error) {
        throw new Error(`Invalid project index JSON: ${error.message}`);
      }
    }

    // Check sitemap
    const sitemapPath = path.join(this.outputDir, 'sitemap.xml');
    if (await fs.pathExists(sitemapPath)) {
      const sitemap = await fs.readFile(sitemapPath, 'utf-8');
      const urlCount = (sitemap.match(/<loc>/g) || []).length;
      console.log(`   ✅ Sitemap contains ${urlCount} URLs`);
    }

    console.log(chalk.green('   ✅ Output validation passed'));
  }

  async printBuildSummary() {
    console.log('\n' + chalk.cyan('📊 Production Build Summary:'));

    try {
      // Count files in output directory
      const countFiles = async (dir) => {
        let count = 0;
        const items = await fs.readdir(dir);

        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = await fs.stat(itemPath);

          if (stat.isDirectory()) {
            count += await countFiles(itemPath);
          } else {
            count++;
          }
        }
        return count;
      };

      const totalFiles = await countFiles(this.outputDir);
      const outputSize = await this.getDirectorySize(this.outputDir);

      console.log(`   Total files: ${chalk.bold(totalFiles)}`);
      console.log(`   Output size: ${chalk.bold(this.formatBytes(outputSize))}`);
      console.log(`   Output directory: ${chalk.bold(this.outputDir)}`);

      // Build timing
      console.log(`   Environment: ${chalk.bold(process.env.NODE_ENV || 'development')}`);
      console.log(`   Node.js: ${chalk.bold(process.version)}`);

    } catch (error) {
      console.warn(chalk.yellow('   Could not generate complete summary'));
    }
  }

  async getDirectorySize(dir) {
    let size = 0;
    const items = await fs.readdir(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory()) {
        size += await this.getDirectorySize(itemPath);
      } else {
        size += stat.size;
      }
    }

    return size;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Execute if called directly
if (require.main === module) {
  const builder = new ProductionBuilder();
  builder.build()
    .then(() => builder.printBuildSummary())
    .then(() => {
      console.log(chalk.green('\n🎉 Ready for deployment!'));
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('\n💥 Build failed:'), error.message);
      process.exit(1);
    });
}

module.exports = ProductionBuilder;