import './FromUsers.css';

export default function ToUsers({ users, onSetUser, toUser }) {
    let usersList;

    const handleSetUser = (id) => {
        onSetUser(id);
    };

    if (users.length > 0) {
        usersList = (
            <ul className="users-list">
                {users.map((user) => (
                    <li key={user.id} onClick={() => handleSetUser(user.id)}>
                        <button
                            className={user.id === toUser ? 'selected' : ''}
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
