import { Card, CardContent, CardHeader } from "@mui/material";

import { AppContainer } from "../components/AppContainer";
import HubspotForm from "../components/HubspotForm";

export function Contact() {
    return (
        <AppContainer>
            <Card>
                <CardHeader title="Contact" />
                <CardContent>
                    <HubspotForm formId="f384a1bc-c4f1-45b1-bf03-b0bf9797653d" />
                </CardContent>
            </Card>
        </AppContainer>
    );
}
