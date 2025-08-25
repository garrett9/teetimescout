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
