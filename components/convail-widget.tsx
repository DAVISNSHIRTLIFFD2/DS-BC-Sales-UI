"use client";

import { useEffect } from "react";

interface ConvaiElement extends HTMLElement {
  'agent-id': string;
}

declare global {
  interface HTMLElementTagNameMap {
    'elevenlabs-convai': ConvaiElement;
  }
}

export function ConvaiWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <elevenlabs-convai agent-id="YeHykcdml8LW0OoML2w6"></elevenlabs-convai>
  );
}
