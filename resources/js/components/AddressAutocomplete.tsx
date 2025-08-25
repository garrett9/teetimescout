import { useCallback, useRef } from "react";

import "radar-sdk-js/dist/radar.css";
import { Box, FormControl, FormLabel } from "@mui/material";
import Radar from "radar-sdk-js";
import { RadarAddress } from "radar-sdk-js/dist/types";
import AutocompleteUI from "radar-sdk-js/dist/ui/autocomplete";

import { Address } from "../providers/UserPreferences";

interface AddressAutocompleteProps {
    value?: Address;
    onChange: (address: RadarAddress) => void;
}

export function AddressAutocomplete({
    value,
    onChange,
}: AddressAutocompleteProps) {
    const autocompleteRef = useRef<AutocompleteUI>(null);

    const setupAutocomplete = useCallback(
        (node: HTMLDivElement | null) => {
            if (!node) {
                return () => {};
            }

            autocompleteRef.current = Radar.ui.autocomplete({
                container: node,
                width: "100%",
                countryCode: "US",
                placeholder: "Your address",
                onSelection: (address: RadarAddress) => onChange(address),
            });

            if (value) {
                const addressString = [
                    [value.number, value.street].filter(Boolean).join(" "),
                    value.city,
                    [value.stateCode, value.postalCode, value.country]
                        .filter(Boolean)
                        .join(" "),
                ]
                    .filter(Boolean)
                    .join(", ");

                autocompleteRef.current.inputField.value = addressString;
            }

            return () => autocompleteRef.current?.remove();
        },
        [value, onChange],
    );

    return (
        <FormControl
            fullWidth
            sx={{
                position: "relative",
            }}
        >
            <FormLabel
                sx={{
                    fontSize: 12,
                    position: "absolute",
                    py: 0.05,
                    px: 0.75,
                    bgcolor: "white",
                    top: -8,
                    left: 8,
                    zIndex: 101,
                }}
            >
                My Address
            </FormLabel>
            <Box
                ref={setupAutocomplete}
                sx={{
                    width: 1,
                    zIndex: 100,
                }}
            />
        </FormControl>
    );
}
