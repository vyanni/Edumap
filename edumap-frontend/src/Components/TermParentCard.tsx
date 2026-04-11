import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useEffect, useState } from "react";

function TermParentCard({ id, data, style }: NodeProps){
    const [extraSlotCount, setExtraSlotCount] = useState(0);
    const { setNodes } = useReactFlow();

    const COURSE_HEIGHT = 80;
    const GAP = 12;
    const HEADER_SPACE = 50;

    const currentHeight = typeof style?.height === 'number' ? style?.height : 700;
    const slotCount = (currentHeight - HEADER_SPACE) / (COURSE_HEIGHT + GAP);
    const totalSlots = Math.max(slotCount + extraSlotCount, 7);
    const slotArray = Array.from({length: totalSlots});

    useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            style: { 
                ...node.style, 
                height: HEADER_SPACE + (totalSlots * (COURSE_HEIGHT + GAP)) + 500
            },
          };
        }
        return node;
      })
    );
  }, [totalSlots, id, setNodes]);

    return (
        <div style={{width: style?.width}} className="w-full h-auto bg-blue-50/50 dark:bg-blue-900/50 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl relative">
            <div className="absolute -top-6 left-4 bg-blue-50/50 dark:bg-zinc-900 border-zinc-300 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
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

                <button 
                    style={{height: COURSE_HEIGHT}}
                    className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-5xl bg-white/30 dark:bg-zinc-900/30"
                    onClick={() => setExtraSlotCount(extraSlotCount => extraSlotCount+1)}
                > +
                </button>
            </div>
        </div>
  );
}

export default TermParentCard