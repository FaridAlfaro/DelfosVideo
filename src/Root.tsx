// src/Root.tsx — Remotion Root
import { Composition } from "remotion";
import { BinCommercial, DelfosCommercial } from "./DelfosCommercial";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot = () => {
    return (
        <>
            <Composition
                id="BinCommercial"
                component={BinCommercial}
                durationInFrames={TOTAL_FRAMES}
                fps={FPS}
                width={1920}
                height={1080}
            />
            <Composition
                id="DelfosCommercial"
                component={DelfosCommercial}
                durationInFrames={TOTAL_FRAMES}
                fps={FPS}
                width={1920}
                height={1080}
            />
        </>
    );
};
