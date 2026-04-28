import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const token = params.get('token');
    const provider = params.get('provider');
    const message = params.get('message');

    if (status === 'success' && token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('genzyc_auth_token', token);
      if (provider) {
        localStorage.setItem('genzyc_auth_provider', provider);
      }
      navigate('/quiz', { replace: true });
      return;
    }

    const errorMessage = message || 'Social login failed. Please try again.';
    navigate(`/auth?oauth=error&message=${encodeURIComponent(errorMessage)}`, { replace: true });
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#fff', background: '#05050A' }}>
      Completing sign-in...
    </div>
  );
};

export default OAuthCallback;
