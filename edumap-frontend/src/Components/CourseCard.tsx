import { useState, useEffect, useRef } from 'react';
import { type NodeProps, Handle, Position, useNodes, useReactFlow} from '@xyflow/react'

const possibleOutcomes = [
  {
    value: 'Passed',
    label: 'Passed',
    color: 'bg-green-100'
  },
  {
    value: 'Failed',
    label: 'Failed',
    color: 'bg-red-100'
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    color: 'bg-blue-100'
  },
  {
    value: 'not-started',
    label: 'Not Started',
    color: 'bg-zinc-100'
  }
];

function CourseCard({id, data}: NodeProps){
  const [isDropDownOpen, setDropDownOpen] = useState<boolean>(false);

  const { setNodes } = useReactFlow();
  const allNodes = useNodes();

  const missingCourses = data.prerequisites?.filter((prereqID: string) => {
    return !allNodes.some((node) => node.data?.originalId === prereqID);
  }) || [];

  const isMissingCourses = missingCourses.length > 0;

  const currentOutcomeValue = data.outcome || 'not-started';
  const currentOutcome = possibleOutcomes.find(outcome => outcome.value === currentOutcomeValue);

  const dropDownReference = useRef<HTMLDivElement>(null);

  const updateOutcome = (newOutcome: string) => {
      setNodes((nds) =>
          nds.map((node) => {
              if (node.id === id) {
                  return { ...node, data: { ...node.data, outcome: newOutcome } };
              }
              return node;
          })
      );
      setDropDownOpen(false);
  };
  
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
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow w-[280px] group">
      <Handle 
        type="target" 
        position={Position.Left} 
        className={`opacity-0`} 
      />
      
      <div className="flex flex-col gap-1 overflow-hidden">
        <div className={`flex flex-row gap-2 justify-center items-center`}>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 shrink-0">{data.label}</span>

          <div className={`flex flex-col`} ref={dropDownReference}>
            <button className={`w-24 ${currentOutcome?.color} rounded-xl focus:outline-none text-xs`}
                  onClick={() => setDropDownOpen(!isDropDownOpen)}
                  title={`${currentOutcome.label}`}
                  > {currentOutcome?.label} 
            </button>

            {isDropDownOpen && (
                <div className={`mt-6 px-3 absolute z-[100] bg-zinc-100 border border-gray-100 flex flex-col
                    max-h-60 overflow-y-auto gap-2`}>
                
                    {(possibleOutcomes.map((outcome) => (
                            <button 
                                key={outcome.value}
                                className={`w-full text-center text-xs cursor-pointer`}
                                onClick={() => {updateOutcome(outcome.value)}}
                            > {outcome.label} 
                            </button>
                        ))
                    )}
                </div>
            )}
          </div>
        </div>
        {!isMissingCourses 
        ? 
        <div className={`flex flex-col leading-tight`}>
          <span className="text-xs text-zinc-500 truncate font-medium" title={`${data.title}`}>{data.title} | {data.credits} Credits</span>
        </div>
        : (<span className="text-xs text-red-500">Missing a Prerequisite!</span>)}
      </div>

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