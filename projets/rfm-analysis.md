---
title: Analyse RFM - Segmentation client avancée
description: Segmentation client en SQL avec la méthode RFM (Récence, Fréquence, Montant) pour des stratégies marketing ciblées.
image: ../images/projets/rfm-analysis/SQL-RFM.png
date: 2025-05-06
categories: [SQL]
---

![Aperçu du code SQL RFM](../../images/projets/rfm-analysis/SQL-RFM.png)

## Présentation du projet
Ce projet implémente une segmentation client en utilisant la méthodologie RFM (Récence, Fréquence, Montant) directement en SQL sous Snowflake. 

### Objectifs principaux
- **Classer** les clients selon leur valeur commerciale
- **Identifier** les opportunités de croissance et de rétention
- **Optimiser** les ressources marketing grâce à une segmentation data-driven

### Méthodologie RFM
La méthode RFM évalue trois dimensions clés :
1. **Récence** : Délai depuis le dernier achat
2. **Fréquence** : Nombre d'achats sur une période
3. **Montant** : Valeur totale des achats

Chaque dimension est pondérée (20% Récence, 40% Fréquence, 40% Montant) pour refléter l'importance stratégique.

## Applications concrètes
Enrichie avec des données complémentaires (produits achetés, canaux d'acquisition), cette analyse permet de :

**Personnalisation marketing** : Adapter les messages aux profils clients spécifiques  
**Prévention de l'attrition** : Détecter précocement la baisse d'engagement  
**Maximisation ROI** : Concentrer les efforts sur les segments les plus prometteurs  
**Cross-selling** : Identifier les opportunités de ventes additionnelles  

## Implémentation technique

### Structure du code SQL
```SQL 
WITH RFM_PREP AS(
    SELECT
      CUSTOMERID,
      DATEDIFF(day,MAX(INVOICEDATE),CURRENT_TIMESTAMP) AS R_PREP,
      COUNT(INVOICEID) AS F_PREP,
      SUM(AMOUNT) AS M_PREP
    FROM "RFM_PROJECT"."PUBLIC"."INVOICES"
    GROUP BY CUSTOMERID),
    RFM_RANKS AS(
    SELECT
        CUSTOMERID,
        R_PREP,
        F_PREP,
        M_PREP,
        NTILE(5) OVER (ORDER BY R_PREP) R_RANK,
        NTILE(5) OVER (ORDER BY F_PREP) F_RANK,
        NTILE(5) OVER (ORDER BY M_PREP) M_RANK
    FROM RFM_PREP),
    RFM_WEIGHTED AS(
    SELECT
        CUSTOMERID,
        R_RANK,
        F_RANK,
        M_RANK,
        R_PREP,
        F_PREP,
        M_PREP,
        (R_RANK*0.2)+(F_RANK*0.4)+(M_RANK*0.4) AS RFM_WEIGHTED
    FROM RFM_RANKS)
SELECT 
    CUSTOMERID,
    R_RANK,
    F_RANK,
    M_RANK,
    R_PREP,
    F_PREP,
    M_PREP,
    RFM_WEIGHTED,
    CASE
        WHEN RFM_WEIGHTED >= 4.5 THEN '1. Champions'
        WHEN RFM_WEIGHTED >= 3.5 THEN '2. Loyal Customers'
        WHEN RFM_WEIGHTED >= 2.5 THEN '3. Potential Loyalists'
        WHEN RFM_WEIGHTED >= 1.5 THEN '4. At Risk'
        ELSE '5. Lost'
    END AS SEGMENT
FROM RFM_WEIGHTED
```

## Améliorations possibles
- Intégration avec des outils de BI (Tableau, Power BI)
- Automatisation du processus et intégration avec un CRM
- Enrichissement avec du machine learning pour la prédiction de comportement

[Voir le projet sur GitHub.](https://github.com/antoinesmts/sql_rfm_analysis/)