interface currentBackground{
    Theme: 'light' | 'dark';
}

function BackgroundNorm({Theme}: currentBackground) {
    const currentBackground = (Theme === 'dark' ? "url('/PatternImageDarkSmall.png')" : "url('/PatternImageLightSmall.png')")

  return (
    <div 
        className={`fixed inset-0 -z-10 bg-repeat ease-in-out`}
        style={{backgroundImage: currentBackground}}
    />
  )
}

export default BackgroundNorm
