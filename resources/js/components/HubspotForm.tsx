import { useEffect, useRef } from "react";

interface HubspotFormProps {
    formId: string;
    portalId?: string;
    region?: string;
}

export function HubspotForm({
    formId,
    portalId = "243517234",
    region = "na2",
}: HubspotFormProps) {
    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement("script");
            script.src = "//js-na2.hsforms.net/forms/embed/v2.js";
            script.type = "text/javascript";
            script.async = true;
            script.charset = "utf-8";

            script.onload = () => {
                if (window.hbspt) {
                    window.hbspt.forms.create({
                        portalId,
                        formId,
                        region,
                        target: `#hubspotForm-${formId}`,
                    });
                }
            };

            document.body.appendChild(script);
        };

        const formSelector = `#hubspotForm-${formId}`;

        if (!window.hbspt) {
            loadScript();
        } else {
            window.hbspt.forms.create({
                portalId,
                formId,
                region,
                target: formSelector,
            });
        }
    }, [formId, portalId, region]);

    return <div id={`hubspotForm-${formId}`} ref={formRef} />;
}

export default HubspotForm;
