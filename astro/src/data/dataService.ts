import type { EnrichedTimetableData, TimetableData } from '../types/timetable';
import { enrichTimetableData } from '../utilities/enrichTimetableData';

const CACHE_NAME = 'data-cache';
const DATA_URL = '/data.json';

/**
 * Charge les données de la timetable enrichies (Stratégie Cache-First avec Revalidation en arrière-plan)
 * @param {Function} [onUpdate] - Callback optionnel pour avertir le Front qu'une mise à jour réseau a eu lieu
 * @returns {Promise<EnrichedTimetableData|null>}
 */
export async function getTimetableData(onUpdate?: (data: EnrichedTimetableData) => void): Promise<EnrichedTimetableData | null> {
    // 1. Tente d'abord le Cache Storage (le plus rapide pour la PWA)
    let localData = await fetchFromCache(DATA_URL);

    // 2. Si le Cache Storage échoue, tente le LocalStorage (Backup)
    if (!localData) {
        localData = getDataFromLocalStorage();
        if (localData) console.log('✅ Données chargées depuis le localStorage (Backup)');
    } else {
        console.log('✅ Données chargées depuis Cache Storage (SW)');
    }

    // 3. Lance SYNCHRONEMENT ou ASYNCHRONEMENT la requête réseau
    if (!localData) {
        // Bloquant : l'app n'a rien du tout, on doit attendre le réseau
        return await getDataFromNetwork();
    } else {
        // Non-bloquant (Arrière-plan) : On a du cache, on l'affiche, mais on vérifie s'il y a du neuf sur le serveur
        fetchSilentUpdate(onUpdate);
        return localData;
    }
}

/**
 * Revalidation en arrière-plan sans bloquer l'affichage de l'utilisateur
 */
async function fetchSilentUpdate(onUpdate?: (data: EnrichedTimetableData) => void) {
    try {
        const response = await fetch(DATA_URL);
        if (response.ok) {
            const rawData: TimetableData = await response.json();
            const enrichedData = enrichTimetableData(rawData);
            
            // On compare les chaînes JSON pour voir si la donnée a vraiment changé
            const oldDataStr = localStorage.getItem('timetableData');
            const freshDataStr = JSON.stringify(enrichedData);

            if (oldDataStr !== freshDataStr) {
                console.log('🔄 Nouvelle timetable détectée sur le réseau, mise à jour des caches...');
                await saveToCache(enrichedData);
                saveToLocalStorage(enrichedData);
                
                // Si le front-end a fourni un callback, on l'exécute pour mettre à jour l'UI à la volée
                if (typeof onUpdate === 'function') {
                    onUpdate(enrichedData);
                }
            }
        }
    } catch (e) {
        console.log('📶 Mode hors-ligne détecté lors de la vérification en arrière-plan.');
    }
}

/**
 * Charge les données depuis le Cache Storage
 */
async function fetchFromCache(url: string): Promise<EnrichedTimetableData | null> {
    try {
        if (!('caches' in window)) return null; // Sécurité si vieux navigateur
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(url);
        return response ? await response.json() : null;
    } catch (error) {
        console.error('Erreur lors de la lecture du cache:', error);
        return null;
    }
}

/**
 * Sauvegarde dans Cache Storage
 */
async function saveToCache(data: EnrichedTimetableData) {
    try {
        if (!('caches' in window)) return;
        const cache = await caches.open(CACHE_NAME);
        await cache.put(DATA_URL, new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        }));
    } catch (error) {
        console.error('Erreur Sauvegarde Cache Storage:', error);
    }
}

/**
 * Sauvegarde dans le Local Storage
 */
function saveToLocalStorage(data: EnrichedTimetableData) {
    try {
        localStorage.setItem('timetableData', JSON.stringify(data));
    } catch (error) {
        console.error("Erreur lors de l'enregistrement dans Local Storage:", error);
    }
}

/**
 * Récupère les données depuis le Local Storage
 */
function getDataFromLocalStorage(): EnrichedTimetableData | null {
    try {
        const data = localStorage.getItem('timetableData');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erreur lors de la lecture du Local Storage:', error);
        return null;
    }
}

/**
 * Récupère les données depuis le réseau (uniquement si aucun cache au démarrage)
 */
async function getDataFromNetwork(): Promise<EnrichedTimetableData | null> {
    try {
        console.log('🔍 Premier démarrage : Chargement obligatoire depuis le réseau...');
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const rawData: TimetableData = await response.json();
        console.log('✅ Données récupérées depuis le réseau');

        const enrichedData = enrichTimetableData(rawData);

        await saveToCache(enrichedData);
        saveToLocalStorage(enrichedData);
        
        return enrichedData;
    } catch (error) {
        console.error('❌ Échec critique du réseau au premier démarrage:', error);
        return null; // Retourne null proprement au lieu de faire crasher l'application
    }
}
