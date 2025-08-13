import React from 'react';
import './NavigationControls.css';

interface NavigationControlsProps {
    onPrevious: () => void;
    onNext: () => void;
    currentIndex: number;
    totalImages: number;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
    onPrevious,
    onNext,
    currentIndex,
    totalImages
}) => {
    // Detect platform for keyboard hints
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? '⌘' : 'Ctrl';

    return (
        <div className="navigation-controls">
            <button
                className="nav-button previous"
                onClick={onPrevious}
                disabled={currentIndex === 0}
            >
                Previous
                <span className="keyboard-hint">{modifierKey}←</span>
            </button>
            <div className="image-counter">
                {currentIndex + 1} / {totalImages}
            </div>
            <button
                className="nav-button next"
                onClick={onNext}
                disabled={currentIndex === totalImages - 1}
            >
                Next
                <span className="keyboard-hint">{modifierKey}→</span>
            </button>
        </div>
    );
};

export default NavigationControls; 