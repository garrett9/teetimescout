import { useEffect, useState } from "react";

import Radar from "radar-sdk-js";

import { Address, useUserPreferences } from "../providers/UserPreferences";

export function useFindAddress() {
    const [address, setAddress] = useState<Address>();
    const { userPreferences, client } = useUserPreferences();

    useEffect(() => {
        if (userPreferences.address) {
            setAddress(userPreferences.address);
            return;
        }

        const fallbackToIpGeocode = async () => {
            try {
                const result = await Radar.ipGeocode();
                if (!result.address) return;

                const foundAddress: Address = {
                    city: result.address.city,
                    country: result.address.country,
                    latitude: result.address.latitude,
                    longitude: result.address.longitude,
                    state: result.address.state,
                    stateCode: result.address.stateCode,
                    postalCode: result.address.postalCode,
                    number: result.address.number,
                    street: result.address.street,
                };
                client.save({ address: foundAddress });
                setAddress(foundAddress);
            } catch (err) {
                console.error("IP geocode failed:", err);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const result = await Radar.reverseGeocode({
                        latitude,
                        longitude,
                    });
                    const best = result.addresses[0];
                    const foundAddress: Address = {
                        latitude,
                        longitude,
                        city: best.city,
                        country: best.country,
                        state: best.state,
                        stateCode: best.stateCode,
                        postalCode: best.postalCode,
                        number: best.number,
                        street: best.street,
                    };
                    client.save({ address: foundAddress });
                    setAddress(foundAddress);
                } catch (e) {
                    console.error("Geolocation reverse lookup failed:", e);
                    fallbackToIpGeocode();
                }
            }, fallbackToIpGeocode);
        } else {
            fallbackToIpGeocode();
        }

        Radar.ipGeocode().then((result) => {
            if (!result.address) {
                return;
            }

            const foundAddress: Address = {
                city: result.address.city,
                country: result.address.country,
                latitude: result.address.latitude,
                longitude: result.address.longitude,
                state: result.address.state,
                stateCode: result.address.stateCode,
                postalCode: result.address.postalCode,
                number: result.address.number,
                street: result.address.street,
            };
            client.save({
                address: foundAddress,
            });

            setAddress(foundAddress);
        });
    }, [userPreferences.address, setAddress, client]);

    return address;
}
