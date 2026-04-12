import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";

const SEASONS = [
  { value: 'Fall', label: 'Fall', color: 'bg-orange-100' },
  { value: 'Winter', label: 'Winter', color: 'bg-blue-100' },
  { value: 'Spring', label: 'Spring', color: 'bg-green-100' },
];

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

    const [isDropDownOpen, setDropDownOpen] = useState(false);

    const updateSeason = (newSeason: string) => {
        setNodes((nds) =>
        nds.map((node) => {
            if (node.id === id) {
            return {
                ...node,
                data: {
                ...node.data,
                season: newSeason,
                },
            };
            }
            return node;
        })
        );
        setDropDownOpen(false);
    };

    const currentSeason = SEASONS.find(s => s.value === data.season) || { label: 'Select Season', color: 'bg-zinc-100' };  
    const dropDownReference = useRef<HTMLDivElement>(null);
      
    useEffect(() => {
        const clickOutside = (event: MouseEvent) => {
            if(dropDownReference.current && !dropDownReference.current.contains(event.target as Node)){
                setDropDownOpen(false);
            }
        };

        document.addEventListener('mousedown', clickOutside, true);
        return () => {document.removeEventListener('mousedown', clickOutside, true)};
    }, []);

    return (
        <div style={{width: style?.width}} className="w-full h-auto bg-blue-50/50 dark:bg-blue-900/50 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl relative">
            <div className="absolute -top-8 left-4 bg-blue-100 rounded-lg dark:bg-zinc-900 border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                {data.label as string}
            </div>

            <div>
                <div className={`flex flex-col ml-36`} ref={dropDownReference}>
                    {isDropDownOpen && (
                        <div className={`w-24 m-2 p-2 gap-2 rounded-lg bottom-full absolute z-[200] bg-purple-100 border border-gray-100 flex flex-col
                            max-h-60`}>
                        
                            {(SEASONS.map((season) => (
                                    <button 
                                        className={`w-full text-center text-xs cursor-pointer`}
                                        onClick={() => {updateSeason(season.value); setDropDownOpen(false)}}
                                    > {season.label} 
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    <button className={`w-24 ${currentSeason?.color} rounded-xl m-2 p-1 text-xs right-0`}
                        onClick={() => setDropDownOpen(!isDropDownOpen)}
                        title={`${currentSeason.label}`}
                        > {currentSeason?.label} 
                    </button>
                </div>
            </div>

            <div className="px-2 space-y-[12px]">
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