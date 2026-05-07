-- Migration 002 : nouvelle grille tarifaire collectif
-- Ajout du palier <10K @ 50€/an, fusion de l'ancien palier "Moins de 100K" dans "10K - 500K".
-- Renommage de la clé "100k-500k" en "10k-500k" pour cohérence avec le nouveau label.
-- Idempotent : les WHERE filtrent les lignes ciblées, rejouable sans risque.

UPDATE public_submissions
SET collectif_ca_range = 'less-10k'
WHERE collectif_ca_range = 'less-100k';

UPDATE public_submissions
SET collectif_ca_range = '10k-500k'
WHERE collectif_ca_range = '100k-500k';
