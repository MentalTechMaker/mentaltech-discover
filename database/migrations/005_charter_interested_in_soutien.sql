-- Migration 005 : case "soutien financier" du formulaire de signature de la charte.
-- Intention seulement (futur Membre Partenaire), aucun engagement ni tarif.
-- Idempotent : rejouable sans risque.

ALTER TABLE charter_signatories
    ADD COLUMN IF NOT EXISTS interested_in_soutien BOOLEAN NOT NULL DEFAULT FALSE;
