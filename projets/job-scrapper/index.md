---
title: Automatisation de la veille des offres d'emploi
slug: job-scrapper
description: >-
  Automatisation de la collecte et du scoring des offres d'emploi via IA,
  intégrant n8n, scraping, bases SQL et une application no-code.
excerpt: >-
  Automatisation de la collecte et du scoring des offres d'emploi via IA,
  intégrant n8n, scraping, bases SQL et une app...
hero_image: ../images/projets/job-scrapper/job-scrapper-n8n.png
date: 2025-07-23
status: published
featured: false
categories:
  - Automatisation
  - n8n
  - IA
  - No-code
  - SQL
tags: []
tech_stack: []
seo_title: null
canonical_url: 'https://antoinesmeets.com/projets/job-scrapper'
schema_type: SoftwareApplication
duration: null
team_size: 1
client: Personnel
github_url: null
demo_url: null
case_study: true
---
## Présentation du projet

L'objectif de ce projet est d'automatiser une veille personnalisée des offres d'emploi, enrichie d'analyses IA. Chaque offre est résumée sur les outils demandés, les tâches principales, le salaire éventuel et les avantages sociaux. Une intelligence artificielle attribue également un score de pertinence de 0 à 100 en fonction de mon profil et de mes critères de recherche.

## Stack technique et fonctionnement

### Première version

- **n8n** : Automatisation des appels API, nettoyage et préparation des données par IA
- **API APIFY (Google Jobs)** : Scraping des offres selon critères prédéfinis
- **Notion** : Interface simple pour gérer les mots-clés de recherche et leur activation
- **Supabase** : Base SQL pour stocker et historiser les offres collectées
- **OpenAI GPT4.1-mini via Openrouter** : Traitement IA pour résumé et scoring
- **KChat (Slack d'Infomaniak)** : Envoi quotidien de résumés des offres pertinentes avec score
- **Flutterflow** : Application no-code affichant les offres d'eemploi et les détails pertinents

### Seconde version

Suite à l'arrêt de l'API APIFY, le scraping a été repris via un script Python utilisant la [bibliothèque JobSpy](https://github.com/speedyapply/JobSpy), capable de collecter des offres sur LinkedIn, Indeed et autres plateformes.

Ce script a été transformé en API grâce à l'IA (modèle DEVSTRAL de Mistral) via Flask, et packagé en image Docker automatisée via GitHub Actions [(Voir le projet sur Github)](https://github.com/antoinesmts/Jobs-scrapper).

Quelques ajustements ont été nécessaires dans n8n pour intégrer ce nouveau flux et retrouver une veille opérationnelle.

![Aperçu de l'application Flutterflow](../../images/projets/job-scrapper/job-scrapper-app.png)

## Améliorations possibles

- Raffiner le prompt IA pour un scoring encore plus précis et pertinent
- Ajouter des filtres dynamiques dans l'application Flutterflow pour affiner les recherches
- Étendre les sources de scraping à d'autres plateformes
- Intégration d’alertes personnalisées basées sur le score
