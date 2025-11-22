import { useState } from 'react'
import Button from "./component/ui/Button.jsx";
import Input from "./component/ui/Input.jsx";
import JoinForm from "./features/JoinForm.jsx";

function App() {
  return (
    <>
        <Button
            variant="ghost"
            iconName="settings"
            ariaLabel="Paramètres"
            className="iconOnly"
        />
        <Button variant="glass" size="default">Créer un salon</Button>
        <Input variant="default" placeholder="Créer un salon" />
        <Input variant="search" placeholder="Rechercher"/>
        <Input variant="chat" placeholder="envoyer un messsage"/>
        <JoinForm />
    </>
  )
}

export default App
