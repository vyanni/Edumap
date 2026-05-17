import { useState } from 'react';
import { handleSignIn, handleSignUp, handleOAuthSignIn } from '../Authentication/AuthLogic';
import styles from './AuthComponent.module.css';

export default function AuthComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                await handleSignUp(email, password);
                setSuccessMessage('Sign up successful! Please check your email for confirmation.');
            } else {
                await handleSignIn(email, password);
                setSuccessMessage('Signed in successfully!');
            }
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthClick = async (provider: 'google') => {
        setError('');
        setIsLoading(true);
        try {
            await handleOAuthSignIn(provider);
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to sign in with ${provider}`);
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
                
                {error && <div className={styles.error}>{error}</div>}
                {successMessage && <div className={styles.success}>{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className={styles.divider}>OR</div>

                <div className={styles.oauthButtons}>
                    <button
                        onClick={() => handleOAuthClick('google')}
                        disabled={isLoading}
                        className={`${styles.oauthButton} ${styles.google}`}
                    >
                        <span></span> Sign in with Google
                    </button>
                </div>

                <button
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                        setSuccessMessage('');
                    }}
                    className={styles.toggleButton}
                    disabled={isLoading}
                >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
}