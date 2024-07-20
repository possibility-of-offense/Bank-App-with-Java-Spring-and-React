import { useCallback } from 'react';
import logo from '../../logo.svg';

export default function Sidebar({
    activeItem,
    onChangeActiveItem,
    toDisableButtons,
}) {
    // Set active class based on activeItem prop
    const setActiveClass = useCallback(
        (item) => {
            if (item === activeItem) {
                return 'active-item';
            }

            return '';
        },
        [activeItem]
    );

    // Handle button click
    const handleButtonClick = (item) => {
        onChangeActiveItem(item);
    };

    return (
        <aside>
            <div className="logo__wrapper">
                <img src={logo} width="70" alt="Logo" />
            </div>
            <button
                type="button"
                className={`${setActiveClass('created-accounts')} ${
                    toDisableButtons ? 'disabled' : ''
                }`}
                onClick={handleButtonClick.bind(null, 'created-accounts')}
                disabled={toDisableButtons}
            >
                Created Accounts
            </button>
            <button
                type="button"
                className={`${setActiveClass('add-new-account')} ${
                    toDisableButtons ? 'disabled' : ''
                }`}
                onClick={handleButtonClick.bind(null, 'add-new-account')}
                disabled={toDisableButtons}
            >
                Add new account
            </button>
            <button
                type="button"
                className={`${setActiveClass('create-bank-transfer')} ${
                    toDisableButtons ? 'disabled' : ''
                }`}
                onClick={handleButtonClick.bind(null, 'create-bank-transfer')}
                disabled={toDisableButtons}
            >
                Create Bank Transfer
            </button>
        </aside>
    );
}
