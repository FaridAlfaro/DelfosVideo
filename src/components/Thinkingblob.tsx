// src/components/Thinkingblob.tsx — AI query thinking state using BIN loaders and isotipo
import React from "react";
import { BinAiThinking } from "./BinBrand";

export const ThinkingBlob: React.FC<{ t: number; size: number; starScale?: number }> = ({
    t,
    size,
    starScale = 1,
}) => {
    return <BinAiThinking frame={t} size={size} starScale={starScale} />;
};