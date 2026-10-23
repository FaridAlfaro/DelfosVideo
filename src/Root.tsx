// src/Root.tsx
import { Composition } from "remotion";
import { DelfosCommercial } from "./DelfosCommercial";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot = () => {
    return (
        <Composition
            id="DelfosCommercial"
            component={DelfosCommercial}
            durationInFrames={TOTAL_FRAMES}
            fps={FPS}
            width={1920}
            height={1080}
        />
    );
};
