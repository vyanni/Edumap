import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../Authentication/AuthLogic';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            try {
                await handleOAuthCallback();
                // Redirect to planning page or wherever users should go after auth
                navigate('/planning');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Authentication failed');
                setIsProcessing(false);
            }
        };

        processCallback();
    }, [navigate]);

    if (isProcessing) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                }}>
                    <h2>Completing your sign-in...</h2>
                    <p style={{ color: '#666', marginTop: '10px' }}>Please wait while we verify your account.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                }}>
                    <h2 style={{ color: '#c33' }}>Authentication Error</h2>
                    <p style={{ color: '#666', marginTop: '10px' }}>{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
