import './FromUsers.css';

export default function FromUsers({
    users,
    onSetUser,
    onFilterUsers,
    fromUser,
}) {
    let usersList;

    const handleSetUser = (id) => {
        onSetUser(id);
        if (onFilterUsers) {
            onFilterUsers(id);
        }
    };

    if (users.length > 0) {
        usersList = (
            <ul className="users-list">
                {users.map((user) => (
                    <li key={user.id} onClick={() => handleSetUser(user.id)}>
                        <button
                            className={user.id === fromUser ? 'selected' : ''}
                        >
                            {user.name}
                        </button>
                    </li>
                ))}
            </ul>
        );
    }

    return usersList;
}
