import { type NodeProps, Handle, Position} from '@xyflow/react'

function CourseCard({data}: NodeProps){
      return (
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-[280px] group">
          {/* Target handle (Left) */}
          <Handle 
            type="target" 
            position={Position.Left} 
            className={`opacity-0`} 
          />
          
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{data.label}</span>
            <span className="text-xs text-zinc-500">Course description or credits</span>
          </div>
    
          {/* Source handle (Right) */}
          <Handle 
            type="source" 
            position={Position.Right} 
            className={`opacity-0`} 
          />
        </div>
      );
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