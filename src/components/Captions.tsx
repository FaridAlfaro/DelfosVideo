// src/components/Captions.tsx — Subtítulos desactivados
import React from "react";

interface CaptionsProps {
    enabled?: boolean;
}

export const SHOW_CAPTIONS = false;

export const Captions: React.FC<CaptionsProps> = () => {
    return null;
};
