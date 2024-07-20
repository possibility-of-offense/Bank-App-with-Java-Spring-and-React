import { useEffect } from 'react';
import './Modal.css';

export default function Modal({
    children,
    onCloseModal,
    onPreventClosingModal,
}) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => (document.body.style.overflow = 'auto');
    });

    // Close modal
    const handleClickOnOverlay = (e) => {
        if (!onPreventClosingModal) {
            onCloseModal();
        }
    };

    // Stop event propagation
    const handleStopPropagation = (e) => e.stopPropagation();

    return (
        <div className="modal" onClick={handleClickOnOverlay}>
            <div className="modal__inner" onClick={handleStopPropagation}>
                <div className="close-icon" onClick={handleClickOnOverlay}>
                    &times;
                </div>
                {children}
            </div>
        </div>
    );
}
