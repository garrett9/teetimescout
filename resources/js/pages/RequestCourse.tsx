import { Card, CardContent, CardHeader } from "@mui/material";

import { AppContainer } from "../components/AppContainer";
import HubspotForm from "../components/HubspotForm";

export function RequestCourse() {
    return (
        <AppContainer>
            <Card>
                <CardHeader title="Request a Course" />
                <CardContent>
                    <HubspotForm formId="f323e034-74e8-4c56-929e-c557211d0aa3" />
                </CardContent>
            </Card>
        </AppContainer>
    );
}
