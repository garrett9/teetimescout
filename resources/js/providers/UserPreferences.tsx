import {
    createContext,
    PropsWithChildren,
    useContext,
    useMemo,
    useState,
} from "react";

export interface Address {
    city?: string;
    country?: string;
    latitude: number;
    longitude: number;
    state?: string;
    stateCode?: string;
    postalCode?: string;
    number?: string;
    street?: string;
}

export interface SessionPreferences {
    date?: string;
    startingAt?: number;
}

export type SortBy = "distance" | "name";

export interface UserPreferences {
    address?: Address;
    courseIds?: Record<string, boolean>;
    withinMinutes?: number;
    sortBy?: SortBy;
}

interface UserPreferencesClient {
    save(
        preferences:
            | Partial<UserPreferences>
            | ((
                  currentPreferences: UserPreferences,
              ) => Partial<UserPreferences>),
    ): void;
    saveSession(preferences: Partial<SessionPreferences>): void;
}

export type UserPreferencesStore = {
    userPreferences: UserPreferences;
    sessionPreferences: SessionPreferences;
    client: UserPreferencesClient;
};

const UserPreferencesContext = createContext<UserPreferencesStore | undefined>(
    undefined,
);

export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (!context) {
        throw new Error(
            "No UserPreferencesContext.Provider found when calling useUserPreferences!",
        );
    }
    return context;
};

const loadedUserPrefs = JSON.parse(window.localStorage.userPreferences || "{}");
const loadedSessionPrefs = JSON.parse(
    window.sessionStorage.sessionPreferences || "{}",
);

export function UserPreferencesProvider({ children }: PropsWithChildren) {
    const [userPreferences, setUserPreferences] =
        useState<UserPreferences>(loadedUserPrefs);
    const [sessionPreferences, setSessionPreferences] =
        useState<SessionPreferences>(loadedSessionPrefs);

    const client: UserPreferencesClient = useMemo(() => {
        return {
            save(
                preferences:
                    | Partial<UserPreferences>
                    | ((
                          currentPreferences: UserPreferences,
                      ) => Partial<UserPreferences>),
            ) {
                setUserPreferences((current) => {
                    const newPreferences = {
                        ...current,
                        ...(typeof preferences !== "function"
                            ? preferences
                            : preferences(current)),
                    };

                    window.localStorage.setItem(
                        "userPreferences",
                        JSON.stringify(newPreferences),
                    );

                    return newPreferences;
                });
            },
            saveSession(preferences: Partial<SessionPreferences>) {
                setSessionPreferences((current) => {
                    const newPreferences = {
                        ...current,
                        ...preferences,
                    };

                    window.sessionStorage.setItem(
                        "sessionPreferences",
                        JSON.stringify(newPreferences),
                    );

                    return newPreferences;
                });
            },
        };
    }, [setUserPreferences, setSessionPreferences]);

    const value: UserPreferencesStore = useMemo(
        () => ({
            userPreferences,
            sessionPreferences,
            client,
        }),
        [userPreferences, sessionPreferences, client],
    );

    return (
        <UserPreferencesContext.Provider value={value}>
            {children}
        </UserPreferencesContext.Provider>
    );
}
