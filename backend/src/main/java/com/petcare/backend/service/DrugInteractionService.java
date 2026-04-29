package com.petcare.backend.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DrugInteractionService {

    private static final Map<String, String> INTERACTIONS = new HashMap<>();

    static {
        // Common Pet Drug Interactions (Example Rule Base)
        INTERACTIONS.put("Rimadyl+Prednisone", "HIGH RISK: Combining NSAIDs (Rimadyl) with Corticosteroids (Prednisone) can cause severe gastrointestinal ulceration or perforation.");
        INTERACTIONS.put("Meloxicam+Prednisone", "HIGH RISK: Combining NSAIDs (Meloxicam) with Corticosteroids (Prednisone) significantly increases risk of stomach ulcers.");
        INTERACTIONS.put("Phenobarbital+Rifampin", "MODERATE RISK: Rifampin may decrease the effectiveness of Phenobarbital.");
        INTERACTIONS.put("Enrofloxacin+Theophylline", "MODERATE RISK: Enrofloxacin can increase the blood levels of Theophylline (toxic ranges).");
        INTERACTIONS.put("Tramadol+Amitriptyline", "HIGH RISK: Increased risk of Serotonin Syndrome when combining Tramadol and Amitriptyline.");
        INTERACTIONS.put("Apoquel+Prednisone", "CAUTION: Use Prednisone with caution alongside Apoquel as both affect the immune system. Monitor closely for signs of infection.");
    }

    public String checkInteraction(String drugA, String drugB) {
        if (drugA == null || drugB == null) return null;
        
        String d1 = drugA.trim().toLowerCase();
        String d2 = drugB.trim().toLowerCase();

        for (String key : INTERACTIONS.keySet()) {
            String[] combo = key.toLowerCase().split("\\+");
            if (combo.length == 2) {
                String c1 = combo[0].trim();
                String c2 = combo[1].trim();
                if ((d1.equals(c1) && d2.equals(c2)) || (d1.equals(c2) && d2.equals(c1))) {
                    return INTERACTIONS.get(key);
                }
            }
        }
        return null;
    }
}
