import './CreatedAccount.css';

export default function CreatedAccount({ account, onSetModal }) {
    return (
        <>
            <tr className="created-account">
                <td>
                    <a
                        href=""
                        onClick={(e) => onSetModal('show-account', account, e)}
                    >
                        {account.name}
                    </a>
                </td>
                <td>{account.iban}</td>
                <td>
                    <button
                        type="button"
                        onClick={() => onSetModal('edit-form', account)}
                    >
                        Status
                    </button>
                    <button
                        type="button"
                        onClick={() => onSetModal('show-transfers', account)}
                    >
                        See all transfers
                    </button>
                </td>
            </tr>
        </>
    );
}
