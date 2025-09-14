/**
 * Dynamic Tag Manager
 *
 * Automatically extracts and manages tags, categories, and tech stack
 * from all projects. Updates main site filters and CSS accordingly.
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const Handlebars = require('handlebars');
const slugify = require('slugify');

class TagManager {
  constructor(options = {}) {
    this.projectsDir = options.projectsDir || path.join(__dirname, '../../projets');
    this.mainSiteDir = options.mainSiteDir || path.join(__dirname, '../../');

    this.allTags = new Set();
    this.allCategories = new Set();
    this.allTechStack = new Set();

    // Track tag statistics
    this.tagStats = new Map();
    this.categoryStats = new Map();
    this.techStats = new Map();

    // Predefined tag colors for consistency
    this.tagColors = {
      'automatisation': '#4a6cf7',
      'python': '#3776ab',
      'n8n': '#8a2be2',
      'power-bi': '#f2c811',
      'ia': '#ff6b6b',
      'no-code': '#51cf66',
      'sql': '#336791',
      'vibe-coding': '#ff8787',
      'javascript': '#f7df1e',
      'css': '#1572b6',
      'html': '#e34f26',
      'nodejs': '#339933',
      'react': '#61dafb',
      'docker': '#2496ed',
      'git': '#f05032'
    };
  }

  /**
   * Extract all tags from project data
   */
  extractTagsFromProjects(projectsData) {
    console.log(chalk.blue('🏷️  Extracting tags from projects...'));

    projectsData.forEach(project => {
      // Process categories
      if (project.categories) {
        project.categories.forEach(category => {
          this.allCategories.add(category);
          this.updateStats(this.categoryStats, category);
        });
      }

      // Process tags
      if (project.tags) {
        project.tags.forEach(tag => {
          this.allTags.add(tag);
          this.updateStats(this.tagStats, tag);
        });
      }

      // Process tech stack
      if (project.tech_stack) {
        project.tech_stack.forEach(tech => {
          this.allTechStack.add(tech);
          this.updateStats(this.techStats, tech);
        });
      }
    });

    console.log(chalk.green(`✅ Extracted ${this.allCategories.size} categories, ${this.allTags.size} tags, ${this.allTechStack.size} technologies`));
  }

  /**
   * Update statistics for tags
   */
  updateStats(statsMap, item) {
    const current = statsMap.get(item) || 0;
    statsMap.set(item, current + 1);
  }

  /**
   * Generate filter buttons configuration
   */
  generateFilterConfig() {
    // Combine categories and major tech stack items for filters
    const filterItems = new Set([...this.allCategories]);

    // Add popular tech stack items (used by 2+ projects)
    this.allTechStack.forEach(tech => {
      const count = this.techStats.get(tech) || 0;
      if (count >= 2) {
        filterItems.add(tech);
      }
    });

    // Convert to sorted array
    const sortedFilters = Array.from(filterItems).sort((a, b) => {
      // Sort by usage count (descending), then alphabetically
      const countA = (this.categoryStats.get(a) || 0) + (this.techStats.get(a) || 0);
      const countB = (this.categoryStats.get(b) || 0) + (this.techStats.get(b) || 0);

      if (countA !== countB) {
        return countB - countA;
      }
      return a.localeCompare(b);
    });

    return {
      filters: sortedFilters,
      categories: Array.from(this.allCategories).sort(),
      tags: Array.from(this.allTags).sort(),
      techStack: Array.from(this.allTechStack).sort(),
      stats: {
        categoryStats: Object.fromEntries(this.categoryStats),
        tagStats: Object.fromEntries(this.tagStats),
        techStats: Object.fromEntries(this.techStats)
      }
    };
  }

  /**
   * Update main site HTML with new filter buttons
   */
  async updateMainSiteFilters(filterConfig) {
    const mainIndexPath = path.join(this.mainSiteDir, 'index.html');

    if (!await fs.pathExists(mainIndexPath)) {
      throw new Error('Main index.html not found');
    }

    console.log(chalk.blue('🔄 Updating main site filter buttons...'));

    let content = await fs.readFile(mainIndexPath, 'utf-8');

    // Generate new filter buttons HTML
    const filterButtonsHtml = this.generateFilterButtonsHtml(filterConfig.filters);

    // Replace the filter container content
    const filterContainerRegex = /(<div class="filter-container"[^>]*>)([\s\S]*?)(<\/div>)/;

    if (filterContainerRegex.test(content)) {
      content = content.replace(filterContainerRegex, `$1${filterButtonsHtml}$3`);

      await fs.writeFile(mainIndexPath, content, 'utf-8');
      console.log(chalk.green('✅ Updated main site filter buttons'));
    } else {
      console.warn(chalk.yellow('⚠️  Could not find filter container in main index.html'));
    }
  }

  /**
   * Generate HTML for filter buttons
   */
  generateFilterButtonsHtml(filters) {
    let html = '\n                <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true" aria-controls="projects-container">Tous</button>\n';

    filters.forEach(filter => {
      const normalizedFilter = this.normalizeFilterName(filter);
      html += `                <button class="filter-btn" data-filter="${filter}" role="tab" aria-selected="false" aria-controls="projects-container">${filter}</button>\n`;
    });

    return html;
  }

  /**
   * Normalize filter names for CSS classes and data attributes
   */
  normalizeFilterName(filter) {
    return slugify(filter, { lower: true, strict: true });
  }

  /**
   * Generate CSS for new tag styles
   */
  generateTagCSS(filterConfig) {
    console.log(chalk.blue('🎨 Generating CSS for tags...'));

    const css = ['/* Auto-generated tag styles */'];

    // Generate CSS for each category/tech item
    [...filterConfig.categories, ...filterConfig.techStack].forEach(item => {
      const normalizedName = this.normalizeFilterName(item);
      const color = this.getTagColor(item);

      css.push(`.tag-${normalizedName} {`);
      css.push(`    background-color: ${color};`);
      css.push(`    color: ${this.getContrastColor(color)};`);
      css.push(`}`);
      css.push('');
    });

    return css.join('\n');
  }

  /**
   * Get color for a tag
   */
  getTagColor(tag) {
    const normalized = this.normalizeFilterName(tag);

    // Use predefined colors if available
    if (this.tagColors[normalized]) {
      return this.tagColors[normalized];
    }

    // Generate a color based on the tag name
    return this.generateColorFromString(tag);
  }

  /**
   * Generate a consistent color from a string
   */
  generateColorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate a pleasant color (avoid too dark or too light colors)
    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash) % 30); // 60-90%
    const lightness = 45 + (Math.abs(hash) % 20);   // 45-65%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Get contrasting text color for a background color
   */
  getContrastColor(backgroundColor) {
    // Simple contrast calculation
    // For now, return white for most colors (can be enhanced)
    return '#ffffff';
  }

  /**
   * Update CSS file with new tag styles
   */
  async updateCSS(filterConfig) {
    const cssPath = path.join(this.mainSiteDir, 'css', 'style.css');

    if (!await fs.pathExists(cssPath)) {
      throw new Error('Main CSS file not found');
    }

    console.log(chalk.blue('🎨 Updating CSS with new tag styles...'));

    let content = await fs.readFile(cssPath, 'utf-8');

    // Remove old auto-generated tag styles
    const autoGenRegex = /\/\* Auto-generated tag styles \*\/[\s\S]*?(?=\/\*[^*]*\*\/|$)/;
    content = content.replace(autoGenRegex, '');

    // Add new tag styles
    const newTagCSS = this.generateTagCSS(filterConfig);

    // Insert before the last closing brace or at the end
    const lastBraceIndex = content.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      content = content.substring(0, lastBraceIndex + 1) + '\n\n' + newTagCSS + content.substring(lastBraceIndex + 1);
    } else {
      content += '\n\n' + newTagCSS;
    }

    await fs.writeFile(cssPath, content, 'utf-8');
    console.log(chalk.green('✅ Updated CSS with new tag styles'));
  }

  /**
   * Generate metadata file for tags
   */
  async generateTagMetadata(filterConfig) {
    const metadataPath = path.join(this.projectsDir, 'tags-metadata.json');

    const metadata = {
      generated_at: new Date().toISOString(),
      version: '1.0.0',

      summary: {
        total_categories: filterConfig.categories.length,
        total_tags: filterConfig.tags.length,
        total_tech_stack: filterConfig.techStack.length,
        total_filters: filterConfig.filters.length
      },

      categories: filterConfig.categories.map(cat => ({
        name: cat,
        slug: this.normalizeFilterName(cat),
        count: filterConfig.stats.categoryStats[cat] || 0,
        color: this.getTagColor(cat)
      })),

      tags: filterConfig.tags.map(tag => ({
        name: tag,
        slug: this.normalizeFilterName(tag),
        count: filterConfig.stats.tagStats[tag] || 0
      })),

      tech_stack: filterConfig.techStack.map(tech => ({
        name: tech,
        slug: this.normalizeFilterName(tech),
        count: filterConfig.stats.techStats[tech] || 0,
        color: this.getTagColor(tech)
      })),

      filters: filterConfig.filters.map(filter => ({
        name: filter,
        slug: this.normalizeFilterName(filter),
        type: this.allCategories.has(filter) ? 'category' : 'technology',
        count: (filterConfig.stats.categoryStats[filter] || 0) + (filterConfig.stats.techStats[filter] || 0)
      }))
    };

    await fs.writeJson(metadataPath, metadata, { spaces: 2 });
    console.log(chalk.green(`📊 Generated tag metadata: ${metadataPath}`));

    return metadata;
  }

  /**
   * Complete tag management process
   */
  async manageTagsFromProjects(projectsData) {
    console.log(chalk.blue('🏷️  Starting dynamic tag management...'));

    // Extract tags from all projects
    this.extractTagsFromProjects(projectsData);

    // Generate filter configuration
    const filterConfig = this.generateFilterConfig();

    // Update main site filters
    await this.updateMainSiteFilters(filterConfig);

    // Update CSS styles
    await this.updateCSS(filterConfig);

    // Generate metadata
    const metadata = await this.generateTagMetadata(filterConfig);

    console.log(chalk.green('✅ Tag management completed successfully'));

    return {
      filterConfig,
      metadata,
      summary: {
        categories: this.allCategories.size,
        tags: this.allTags.size,
        techStack: this.allTechStack.size,
        filters: filterConfig.filters.length
      }
    };
  }

  /**
   * Generate summary report
   */
  printTagSummary(result) {
    console.log('\n' + chalk.cyan('🏷️  Tag Management Summary:'));
    console.log(`   Categories: ${chalk.bold(result.summary.categories)} (${Array.from(this.allCategories).join(', ')})`);
    console.log(`   Tags: ${chalk.bold(result.summary.tags)} unique tags`);
    console.log(`   Tech Stack: ${chalk.bold(result.summary.techStack)} technologies`);
    console.log(`   Active Filters: ${chalk.bold(result.summary.filters)}`);

    console.log('\n' + chalk.cyan('📊 Most Used Categories:'));
    const topCategories = Array.from(this.categoryStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    topCategories.forEach(([category, count]) => {
      console.log(`   ${chalk.green('▶')} ${category}: ${chalk.bold(count)} project${count > 1 ? 's' : ''}`);
    });
  }
}

module.exports = TagManager;