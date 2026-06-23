import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthForm from '../components/Auth/AuthForm';

const GOOGLE_CLIENT_ID = "419228524081-427bi432q4a7oqrh60fha9b1fkjiu0n6.apps.googleusercontent.com";

const LoginView = ({ onBack }) => {
    return (
        <div className="page-content">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <AuthForm onBack={onBack} />
            </GoogleOAuthProvider>
        </div>
    );
};

export default LoginView;
