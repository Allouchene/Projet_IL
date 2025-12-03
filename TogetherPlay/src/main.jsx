import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Message from "./component/ui/Message.jsx";

import './assets/style/welcome.css'
import Chat from "./features/Chat.jsx";

createRoot(document.getElementById('root')).render(
    <>
        <Chat />
    </>


)