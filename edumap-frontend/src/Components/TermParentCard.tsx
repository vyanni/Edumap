import type { NodeProps } from "@xyflow/react";

function TermParentCard({ data, style }: NodeProps){
    const COURSE_HEIGHT = 80;
    const GAP = 12;
    const HEADER_SPACE = 50;

    const currentHeight = typeof style?.height === 'number' ? style?.height : 800;
    const slotCount = Math.floor((currentHeight - HEADER_SPACE) / (COURSE_HEIGHT + GAP));
    const slotArray = Array.from({length: Math.max(slotCount, 5)});

    return (
        <div style={{width: style?.width, height: style?.height}} className="w-full h-full bg-blue-50/50 dark:bg-blue-900/50 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl relative">
            <div className="absolute -top-3 left-4 bg-white dark:bg-zinc-900 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                {data.label as string}
            </div>

            <div style={{marginTop: HEADER_SPACE}} className="px-2 space-y-[12px]">
                {slotArray.map((_, i) => (
                    <div
                        key={i}
                        style={{height: COURSE_HEIGHT}}
                        className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white/30 dark:bg-zinc-900/30"
                    />
                ))}
            </div>
        </div>
  );
}

export default TermParentCard