import themeAnimation from './Styles/ThemeAnimation.module.css'

interface ThemeProp {
    Theme: 'light' | 'dark';
    setTheme: (newTheme: 'light' | 'dark') => void
}

function ThemeToggle({Theme, setTheme}: ThemeProp) {
    const isDark = (Theme === 'dark'); 

    return (
        <div className={`flex flex-row m-8`}>
            <label className={`${themeAnimation.togglePill}`}>
            <input 
                type='checkbox'
                className='sr-only peer'
                checked={isDark}
                onChange={() => setTheme(isDark ? 'light' : 'dark')}
            />
            <div className={`${themeAnimation.toggleSlider}`}></div>
            </label>
        </div>
    )
}

export default ThemeToggle
