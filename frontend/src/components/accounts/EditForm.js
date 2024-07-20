import { useContext, useRef, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import Loader from '../ui/Loader';
import { RevalidateCacheContext } from '../../App';

export default function EditForm({
    accountId,
    name,
    iban,
    status,
    availableAmount,
    onCloseModal,
}) {
    const {
        fetcher,
        data,
        status: ajaxStatus,
    } = useFetch({
        url: process.env.REACT_APP_UPDATE_ACCOUNT,
        method: 'PUT',
    });

    // State to hold the formData
    const [formState, setFormState] = useState({
        name,
        iban,
        status,
        availableAmount,
    });

    let nameRef = useRef(null);

    // Get onRevalidate from the context
    const { onRevalidateCache } = useContext(RevalidateCacheContext);

    // Update the formState data based on the key : name | iban | status | availableAmount
    const handleUpdateState = (key, e) =>
        setFormState((prev) => ({ ...prev, [key]: e.target.value }));

    // Handle update account
    const handleUpdateAccount = async (e) => {
        e.preventDefault();

        await fetcher({
            id: accountId,
            name: formState.name,
            iban: formState.iban,
            status: formState.status,
            availableAmount: formState.availableAmount,
        });

        onRevalidateCache();
        onCloseModal();
    };

    return (
        <form className="edit-form" onSubmit={handleUpdateAccount}>
            <h4>Update account</h4>
            <br />
            <div className="input">
                <input
                    ref={nameRef}
                    autoFocus
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={handleUpdateState.bind(null, 'name')}
                />
                <label
                    htmlFor="name"
                    className={formState.name !== '' ? 'focused' : ''}
                >
                    Name
                </label>
            </div>
            <div className="input">
                <input
                    type="text"
                    id="iban"
                    value={formState.iban}
                    onChange={handleUpdateState.bind(null, 'iban')}
                />
                <label
                    htmlFor="iban"
                    className={formState.iban !== '' ? 'focused' : ''}
                >
                    IBAN
                </label>
            </div>
            <div className="input">
                <input
                    type="text"
                    id="status"
                    value={formState.status}
                    onChange={handleUpdateState.bind(null, 'status')}
                />
                <label
                    htmlFor="status"
                    className={formState.status !== '' ? 'focused' : ''}
                >
                    Status
                </label>
            </div>
            <div className="input">
                <input
                    type="text"
                    id="availableAmount"
                    value={formState.availableAmount}
                    onChange={handleUpdateState.bind(null, 'availableAmount')}
                />
                <label
                    htmlFor="availableAmount"
                    className={
                        formState.availableAmount !== '' ? 'focused' : ''
                    }
                >
                    Available amount
                </label>
            </div>

            <button
                type="submit"
                disabled={ajaxStatus === 'loading'}
                className="edit-account__button"
            >
                {ajaxStatus === 'loading' ? <Loader /> : 'Update account'}
            </button>
        </form>
    );
}
