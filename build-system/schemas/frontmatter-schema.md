# Enhanced Frontmatter Schema for SEO Optimization

This document defines the complete frontmatter structure for portfolio projects, optimized for SEO, social sharing, and automated processing.

## Schema Structure

### Basic Information
```yaml
title: "Project Title"              # Main title (required)
slug: "url-friendly-slug"           # URL identifier (auto-generated if not provided)
description: "Brief description"    # Meta description for SEO (required, 150-160 chars)
excerpt: "Short summary"            # Brief summary for cards (optional, 80-120 chars)
```

### Content & Media
```yaml
hero_image: "images/hero.png"       # Main project image (required)
hero_alt: "Description of image"    # Alt text for hero image (auto-generated if not provided)
gallery:                            # Additional project images (optional)
  - "images/screenshot1.png"
  - "images/screenshot2.png"
video_url: "https://youtube.com/..."  # Demo video URL (optional)
```

### Metadata
```yaml
date: "2025-01-15"                  # Creation date (required, YYYY-MM-DD format)
last_updated: "2025-01-15"          # Last modification (auto-updated on build)
status: "published"                 # Status: draft, published, archived (required)
featured: true                      # Show in featured section (optional, default: false)
priority: 1                         # Display priority 1-10 (optional, default: 5)
```

### Categories & Tags
```yaml
categories:                         # Primary categories (required, 1-5 items)
  - "Automatisation"
  - "n8n"
  - "IA"
tags:                              # Secondary tags (optional, unlimited)
  - "Python"
  - "Scraping"
  - "Machine Learning"
tech_stack:                        # Technologies used (optional)
  - "n8n"
  - "Python"
  - "SQL"
  - "OpenAI API"
```

### SEO Optimization
```yaml
seo_title: "Custom SEO Title"       # Custom title for search engines (optional, 50-60 chars)
seo_description: "SEO description"  # Meta description (auto-generated if not provided)
canonical_url: "https://..."       # Canonical URL (auto-generated if not provided)
keywords:                          # SEO keywords (optional)
  - "automatisation"
  - "emploi"
  - "intelligence artificielle"
```

### Open Graph (Facebook/LinkedIn)
```yaml
og_title: "Social Media Title"      # Open Graph title (auto-generated if not provided)
og_description: "Social description" # Open Graph description (auto-generated if not provided)
og_image: "images/og-image.png"     # Social sharing image (auto-generated if not provided)
og_type: "article"                  # Open Graph type (default: article)
```

### Twitter Cards
```yaml
twitter_card: "summary_large_image"  # Card type (default: summary_large_image)
twitter_title: "Twitter Title"      # Twitter-specific title (auto-generated if not provided)
twitter_description: "Description"  # Twitter description (auto-generated if not provided)
twitter_image: "images/twitter.png" # Twitter image (auto-generated if not provided)
```

### Schema.org Structured Data
```yaml
schema_type: "SoftwareApplication"   # Schema.org type (default: CreativeWork)
application_category: "Automation"   # Application category for software projects
operating_system: "Web-based"       # Operating system compatibility
programming_language: "Python"      # Primary programming language
```

### Project Details
```yaml
duration: "2 semaines"              # Project duration (optional)
team_size: 1                        # Team size (optional, default: 1)
client: "Personnel"                 # Client/company (optional)
role: "Développeur Full-Stack"      # Your role in the project (optional)
```

### Links & Resources
```yaml
github_url: "https://github.com/..." # GitHub repository (optional)
demo_url: "https://demo.example.com" # Live demo URL (optional)
case_study: true                     # Is this a detailed case study? (optional)
documentation_url: "https://..."    # Documentation link (optional)
```

### Localization
```yaml
language: "fr"                      # Content language (default: fr)
alternate_languages:                # Alternate language versions (optional)
  en: "https://example.com/en/project"
```

## Auto-Generated Fields

The build system automatically generates these fields if not provided:

- `slug` - from title
- `last_updated` - current build date
- `seo_title` - from title
- `seo_description` - from description
- `canonical_url` - from base URL + slug
- `og_title` - from title
- `og_description` - from description
- `og_image` - from hero_image
- `twitter_title` - from title
- `twitter_description` - from description
- `twitter_image` - from hero_image
- `hero_alt` - AI-generated from image analysis

## Validation Rules

- `title` and `description` are required
- `date` must be in YYYY-MM-DD format
- `status` must be: draft, published, or archived
- `categories` must contain 1-5 items
- `description` should be 150-160 characters for optimal SEO
- `excerpt` should be 80-120 characters
- Image paths should be relative to project folder

## Migration Strategy

For existing projects, the build system will:
1. Parse existing frontmatter
2. Map to new schema
3. Auto-generate missing fields
4. Preserve all existing data
5. Add new SEO fields with defaults