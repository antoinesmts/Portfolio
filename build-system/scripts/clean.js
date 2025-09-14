#!/usr/bin/env node

/**
 * Clean Script
 *
 * Removes all generated files and resets the build system to a clean state.
 * Useful for development and CI/CD environments.
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

class CleanSystem {
  constructor() {
    this.baseDir = path.join(__dirname, '../../');
    this.projectsDir = path.join(this.baseDir, 'projets');

    // Files and directories to clean
    this.cleanTargets = [
      // Generated project HTML files
      {
        pattern: path.join(this.projectsDir, '*', 'index.html'),
        type: 'file',
        description: 'Project HTML files'
      },
      // Generated JSON files
      {
        path: path.join(this.projectsDir, 'index.json'),
        type: 'file',
        description: 'Project index JSON'
      },
      {
        path: path.join(this.projectsDir, 'index-simple.json'),
        type: 'file',
        description: 'Simple project index JSON'
      },
      {
        path: path.join(this.projectsDir, 'tags-metadata.json'),
        type: 'file',
        description: 'Tags metadata JSON'
      },
      {
        path: path.join(this.projectsDir, 'validation-report.json'),
        type: 'file',
        description: 'Validation report JSON'
      },
      // Generated SEO files
      {
        path: path.join(this.baseDir, 'sitemap.xml'),
        type: 'file',
        description: 'XML sitemap'
      },
      {
        path: path.join(this.baseDir, 'robots.txt'),
        type: 'file',
        description: 'Robots.txt file'
      },
      {
        path: path.join(this.baseDir, 'structured-data.json'),
        type: 'file',
        description: 'Structured data JSON'
      },
      {
        path: path.join(this.baseDir, 'social-media-data.json'),
        type: 'file',
        description: 'Social media data JSON'
      },
      {
        path: path.join(this.baseDir, 'seo-report.json'),
        type: 'file',
        description: 'SEO report JSON'
      },
      // Build output directory (GitHub Actions)
      {
        path: path.join(this.baseDir, '_site'),
        type: 'directory',
        description: 'Build output directory'
      },
      // Backup directories
      {
        path: path.join(this.baseDir, 'backup'),
        type: 'directory',
        description: 'Backup directories',
        optional: true // Don't report if missing
      }
    ];

    this.stats = {
      filesRemoved: 0,
      directoriesRemoved: 0,
      errors: 0,
      skipped: 0
    };
  }

  async clean(options = {}) {
    const spinner = ora('Cleaning generated files...').start();

    try {
      console.log(chalk.blue('🧹 Starting cleanup process...\n'));

      for (const target of this.cleanTargets) {
        await this.cleanTarget(target, options);
      }

      // Clean any temporary files in build-system
      await this.cleanBuildSystemTemp();

      spinner.succeed(chalk.green('✅ Cleanup completed successfully'));

      this.printSummary();

    } catch (error) {
      spinner.fail(chalk.red('❌ Cleanup failed'));
      console.error(chalk.red(error.message));
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  async cleanTarget(target, options) {
    try {
      if (target.pattern) {
        // Handle glob patterns
        await this.cleanPattern(target, options);
      } else {
        // Handle single files/directories
        await this.cleanSingle(target, options);
      }
    } catch (error) {
      this.stats.errors++;
      if (!target.optional) {
        console.error(chalk.red(`❌ Error cleaning ${target.description}: ${error.message}`));
      }
    }
  }

  async cleanPattern(target, options) {
    const glob = require('glob');
    const matches = glob.sync(target.pattern);

    if (matches.length === 0) {
      console.log(chalk.gray(`⏭️  No ${target.description} found`));
      return;
    }

    for (const match of matches) {
      if (await fs.pathExists(match)) {
        if (options.dryRun) {
          console.log(chalk.yellow(`[DRY RUN] Would remove: ${match}`));
        } else {
          await fs.remove(match);
          this.stats.filesRemoved++;
          if (options.verbose) {
            console.log(chalk.green(`   ✓ Removed: ${path.relative(this.baseDir, match)}`));
          }
        }
      }
    }

    if (!options.verbose) {
      console.log(chalk.green(`✅ Cleaned ${matches.length} ${target.description}`));
    }
  }

  async cleanSingle(target, options) {
    if (await fs.pathExists(target.path)) {
      const stat = await fs.stat(target.path);

      if (options.dryRun) {
        console.log(chalk.yellow(`[DRY RUN] Would remove: ${target.path}`));
        return;
      }

      await fs.remove(target.path);

      if (stat.isDirectory()) {
        this.stats.directoriesRemoved++;
      } else {
        this.stats.filesRemoved++;
      }

      console.log(chalk.green(`✅ Removed ${target.description}`));

      if (options.verbose) {
        console.log(chalk.green(`   ✓ ${path.relative(this.baseDir, target.path)}`));
      }
    } else {
      if (!target.optional) {
        console.log(chalk.gray(`⏭️  ${target.description} not found`));
        this.stats.skipped++;
      }
    }
  }

  async cleanBuildSystemTemp() {
    const tempFiles = [
      path.join(__dirname, '../.cache'),
      path.join(__dirname, '../node_modules/.cache'),
      path.join(__dirname, '../*.log'),
      path.join(__dirname, '../*.tmp')
    ];

    for (const tempFile of tempFiles) {
      if (await fs.pathExists(tempFile)) {
        await fs.remove(tempFile);
        console.log(chalk.blue(`🗑️  Removed temp file: ${path.basename(tempFile)}`));
      }
    }
  }

  printSummary() {
    console.log('\n' + chalk.cyan('📊 Cleanup Summary:'));
    console.log(`   Files removed: ${chalk.bold(this.stats.filesRemoved)}`);
    console.log(`   Directories removed: ${chalk.bold(this.stats.directoriesRemoved)}`);
    console.log(`   Skipped: ${chalk.bold(this.stats.skipped)}`);

    if (this.stats.errors > 0) {
      console.log(`   Errors: ${chalk.bold.red(this.stats.errors)}`);
    }

    console.log('\n' + chalk.green('🎉 Your build system is now clean and ready!'));
  }

  async cleanSpecific(targets) {
    console.log(chalk.blue(`🧹 Cleaning specific targets: ${targets.join(', ')}`));

    const targetMap = {
      'html': () => this.cleanTarget({
        pattern: path.join(this.projectsDir, '*', 'index.html'),
        type: 'file',
        description: 'Project HTML files'
      }),
      'json': () => Promise.all([
        this.cleanTarget({
          path: path.join(this.projectsDir, 'index.json'),
          type: 'file',
          description: 'Project index JSON'
        }),
        this.cleanTarget({
          path: path.join(this.projectsDir, 'tags-metadata.json'),
          type: 'file',
          description: 'Tags metadata JSON'
        })
      ]),
      'seo': () => Promise.all([
        this.cleanTarget({
          path: path.join(this.baseDir, 'sitemap.xml'),
          type: 'file',
          description: 'XML sitemap'
        }),
        this.cleanTarget({
          path: path.join(this.baseDir, 'robots.txt'),
          type: 'file',
          description: 'Robots.txt file'
        })
      ]),
      'reports': () => Promise.all([
        this.cleanTarget({
          path: path.join(this.projectsDir, 'validation-report.json'),
          type: 'file',
          description: 'Validation report'
        }),
        this.cleanTarget({
          path: path.join(this.baseDir, 'seo-report.json'),
          type: 'file',
          description: 'SEO report'
        })
      ])
    };

    for (const target of targets) {
      if (targetMap[target]) {
        await targetMap[target]();
      } else {
        console.warn(chalk.yellow(`⚠️  Unknown clean target: ${target}`));
      }
    }

    this.printSummary();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run') || args.includes('-n'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    help: args.includes('--help') || args.includes('-h')
  };

  if (options.help) {
    console.log(`
${chalk.cyan('Portfolio Build System - Clean Script')}

Usage: node clean.js [options] [targets]

Options:
  --dry-run, -n    Show what would be removed without actually removing
  --verbose, -v    Show detailed output
  --help, -h       Show this help message

Targets (optional):
  html            Clean only HTML files
  json            Clean only JSON files
  seo             Clean only SEO files (sitemap, robots.txt)
  reports         Clean only report files

Examples:
  node clean.js                    # Clean everything
  node clean.js --dry-run         # Preview what would be cleaned
  node clean.js html json         # Clean only HTML and JSON files
  node clean.js --verbose         # Clean with detailed output
`);
    process.exit(0);
  }

  const cleanSystem = new CleanSystem();

  // Extract specific targets
  const specificTargets = args.filter(arg =>
    !arg.startsWith('-') && ['html', 'json', 'seo', 'reports'].includes(arg)
  );

  if (specificTargets.length > 0) {
    cleanSystem.cleanSpecific(specificTargets).catch(console.error);
  } else {
    cleanSystem.clean(options).catch(console.error);
  }
}

module.exports = CleanSystem;