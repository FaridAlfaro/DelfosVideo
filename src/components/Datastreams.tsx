// src/components/Datastreams.tsx — Minimalist matte glass pills streaming in inclined rows (Zero Neon)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT } from "./Theme";
import { Icon, IconName } from "./Ui";

const ITEMS: { icon: IconName; text: string }[] = [
    { icon: "cart", text: "Add to cart · Sneakers" },
    { icon: "user", text: "@maya_g followed @kicklab" },
    { icon: "heart", text: "Loved the new launch" },
    { icon: "bag", text: "Checkout · $128.40" },
    { icon: "star", text: "Review ★★★★★" },
    { icon: "chat", text: "this is fire 🔥" },
    { icon: "trend", text: "Trending #BrandLaunch" },
    { icon: "cart", text: "Order #48213 confirmed" },
    { icon: "heart", text: "Shared story · 12.4k views" },
    { icon: "user", text: "New follower · @leo.dsgn" },
];
const PILL_W = 400;
const GAP = 26;
const LOOP = ITEMS.length * (PILL_W + GAP);

export const DataStreams: React.FC<{ dim?: number }> = ({ dim = 0.6 }) => {
    const frame = useCurrentFrame();
    const rows = 7;
    return (
        <AbsoluteFill style={{ opacity: dim, perspective: 1500, overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: -300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 34,
                    transform: `rotateX(16deg) rotateZ(-7deg) scale(${1.22 + frame * 0.001})`,
                }}
            >
                {Array.from({ length: rows }).map((_, r) => {
                    const dir = r % 2 === 0 ? 1 : -1;
                    const speed = 5 + (r % 3) * 2.2;
                    const off = (frame * speed + r * 190) % LOOP;
                    const x = dir === 1 ? -off : -LOOP + off;
                    return (
                        <div key={r} style={{ display: "flex", gap: GAP, transform: `translateX(${x}px)`, width: LOOP * 2 }}>
                            {[...ITEMS, ...ITEMS].map((_it, i) => {
                                const item = ITEMS[(i + r * 3) % ITEMS.length];
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            width: PILL_W,
                                            flex: "none",
                                            boxSizing: "border-box",
                                            height: 76,
                                            borderRadius: 999,
                                            padding: "0 22px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 14,
                                            backgroundColor: "rgba(12, 16, 26, 0.78)",
                                            backdropFilter: "blur(24px)",
                                            border: "1px solid rgba(255, 255, 255, 0.09)",
                                        }}
                                    >
                                        <Icon name={item.icon} size={24} color="#CBD5E1" />
                                        <span style={{ fontFamily: FONT, fontSize: 21, color: "#F8FAFC", whiteSpace: "nowrap", flex: 1 }}>
                                            {item.text}
                                        </span>
                                        <div
                                            style={{
                                                width: 34,
                                                height: 34,
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(255, 255, 255, 0.04)",
                                                border: "1px solid rgba(255, 255, 255, 0.09)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Icon name="trend" size={16} sw={2.2} color="#94A3B8" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
