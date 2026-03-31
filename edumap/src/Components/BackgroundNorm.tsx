interface currentBackground{
    Theme: 'light' | 'dark';
}

function BackgroundNorm({Theme}: currentBackground) {
    const currentBackground = Theme === 'dark' 
    ? "bg-[#141C1E]" 
    : "bg-white";

  return (
    <div className={`fixed inset-0 -z-10 bg-repeat transition-out duration-1000 ease-in-out ${currentBackground}`}/>
  )
}

export default BackgroundNorm
