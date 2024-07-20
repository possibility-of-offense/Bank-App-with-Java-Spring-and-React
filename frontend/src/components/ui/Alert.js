import { createPortal } from 'react-dom';
import './Alert.css';

export default function Alert({ children }) {
    return createPortal(<div className="alert">{children}</div>, document.body);
}
