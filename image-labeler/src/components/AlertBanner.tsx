import React from 'react';
import './AlertBanner.css';

type BannerVariant = 'error' | 'success' | 'info' | 'warning';

interface AlertBannerProps {
    message: string;
    variant?: BannerVariant;
    onClose?: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message, variant = 'info', onClose }) => {
    return (
        <div className={`alert-banner ${variant}`} role="status" aria-live="polite">
            <span className="alert-message">{message}</span>
            {onClose && (
                <button className="alert-close" onClick={onClose} aria-label="Dismiss">×</button>
            )}
        </div>
    );
};

export default AlertBanner;

