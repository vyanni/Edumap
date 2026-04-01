import type { NodeProps, Handle, Position, useNodeConnections } from '@xyflow/react'

function CourseCard({id, data}: NodeProps){

    return (
        <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-2">
            <div className="text-slate-400 font-black italic text-xl uppercase">{data.label}</div>
        </div>
    )
}

export default CourseCard

/**
 * Card components for the original react flow design
 * Property: Value (CSS) vs Tailwind Equivalent
 * Background: #ffffff vs bg-white
 * Border: 1px solid #1a192b vs border border-[#1a192b]
 * Border Radius: 3px vs rounded-sm
 * Padding: 10px vs p-[10px]
 * Font Size: 12px vstext-[12px]
 * Shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) vs shadow-md
 */