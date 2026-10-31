import { describe, it, expect, vi } from "vitest";
import fs from "node:fs"

import { detectSubChanges, parseSubstitution, isClassImpacted, createSubMessageText, isNewsClassImpacted } from "../tools";
import { RootSubstitution } from "../models/substitutionModels";

it("handle all announcements from the start - no error", () => {
    expect(() => {
        let new_substitutionData: RootSubstitution[];
        new_substitutionData = JSON.parse(fs.readFileSync("./data/substitutions.json").toString());

        let substitutionData: RootSubstitution[] = [];

        const changes: RootSubstitution[] = detectSubChanges(substitutionData, new_substitutionData);
        //if (changes.length>10) {throw new Error("Too much new data");}
        for (let i = 0; i < changes.length; i++) {
            const shortSub = parseSubstitution(changes[i]);
            if (shortSub != null) {
                if (isClassImpacted(shortSub, "ALL")) {
                    createSubMessageText(shortSub)
                }
            }
        }
    }).not.toThrow();

})