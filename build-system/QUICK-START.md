# 🚀 Quick Start Guide

Get your automated portfolio publishing system up and running in 5 minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- Your existing portfolio files

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd build-system
npm install
```

### 2. (Optional) Migrate Existing Projects
If you have existing `.md` files in the `projets/` folder:
```bash
npm run migrate
```
This creates a backup and moves your files to the new folder structure.

### 3. Create Your First Project
```bash
# Copy the template
mkdir ../projets/my-awesome-project
cp templates/project-template.md ../projets/my-awesome-project/index.md

# Edit the project (use your favorite editor)
code ../projets/my-awesome-project/index.md
```

### 4. Build Everything
```bash
npm run build
```

**🎉 That's it!** Your portfolio is now automated!

## 📁 What Happened?

The build system just:

✅ **Generated** `projets/index.json` automatically from your markdown files
✅ **Created** individual HTML pages for each project with full SEO
✅ **Updated** your main site's filter buttons with new categories
✅ **Added** CSS styles for any new tags you used
✅ **Generated** XML sitemap, robots.txt, and structured data
✅ **Optimized** everything for search engines and social media

## 🏗️ New Workflow

From now on, to add a new project:

1. **Create folder**: `mkdir projets/project-name`
2. **Copy template**: `cp build-system/templates/project-template.md projets/project-name/index.md`
3. **Edit content**: Add your project details and content
4. **Build**: `npm run build`
5. **Done!** 🎉

Everything else is automated:
- JSON index updated
- HTML page created
- Filters updated
- SEO optimized
- Social media ready

## 📝 Frontmatter Example

Here's the minimum you need in your `index.md`:

```yaml
---
title: "My Amazing Project"
description: "A brief description that will be used for SEO and social media"
date: "2025-01-15"
categories: ["Python", "Automatisation"]
hero_image: "images/hero.png"
status: "published"
---

# My Amazing Project

Your content goes here...
```

## 🔧 Essential Commands

```bash
npm run build      # Build everything (main command)
npm run validate   # Check for issues before building
npm run dev        # Watch mode for development
npm run clean      # Clean generated files
```

## 🏷️ Smart Tag Management

The system automatically:

- **Finds all unique tags** from your projects
- **Generates filter buttons** on your main page
- **Creates CSS styles** for consistent colors
- **Updates everything** when you add new tags

No manual maintenance required!

## 📱 SEO & Social Media

Every project gets:

- **Rich meta tags** for search engines
- **Open Graph** for Facebook/LinkedIn sharing
- **Twitter Cards** for Twitter previews
- **Structured data** for Google rich results
- **Optimized images** with lazy loading

## 🔍 Quality Checks

Run validation before building:
```bash
npm run validate
```

This checks for:
- Missing required fields
- SEO optimization issues
- Image problems
- Content quality issues

## 📊 Monitoring

After building, check these files:
- `seo-report.json` - SEO analysis and recommendations
- `validation-report.json` - Quality check results
- `sitemap.xml` - Generated sitemap
- `projets/tags-metadata.json` - Tag statistics

## 🐛 Troubleshooting

### Build Fails?
1. Check `npm run validate` for errors
2. Ensure all required frontmatter fields are present
3. Verify image paths exist

### Missing Filter Buttons?
- Check that categories are in array format: `["Category1", "Category2"]`
- Rebuild with `npm run build`

### SEO Issues?
- Run `npm run validate` to see specific recommendations
- Check `seo-report.json` for detailed analysis

### Images Not Loading?
- Use relative paths: `images/hero.png`
- Ensure images exist in the project folder
- Check console for 404 errors

## 💡 Pro Tips

### 🎯 **SEO Optimization**
- Keep descriptions between 120-160 characters
- Use descriptive titles under 60 characters
- Always include hero images
- Add alt text to all images

### 🏷️ **Smart Tagging**
- Use 1-5 categories per project
- Be consistent with category names
- Popular tags become filter buttons automatically

### 📱 **Social Media**
- Hero images are used for social sharing
- Descriptions become social media previews
- Consider creating specific social media images

### ⚡ **Performance**
- Keep markdown files under 5000 words
- Optimize images before adding them
- Use the generated lazy loading features

## 🎯 Next Steps

1. **Customize Templates**: Edit `templates/project.hbs` for your design
2. **Add GitHub Actions**: Automate builds on every push
3. **Monitor SEO**: Regularly check the generated reports
4. **Optimize Content**: Use validation recommendations

## 🆘 Need Help?

- Check the full `README.md` for detailed documentation
- Run `npm run validate` to identify specific issues
- Review generated reports for optimization tips

---

**🚀 Your portfolio is now fully automated!**

Just focus on creating great content - the system handles everything else automatically.