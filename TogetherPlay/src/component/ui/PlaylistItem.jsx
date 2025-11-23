import styles from './PlaylistItem.module.css'
import Button from "./Button.jsx";

export default function PlaylistItem() {
    return (
        <li className={`${styles.item}`} role="listitem">
            <Button type="button" variant={"ghost"} size={"default"} iconName={"more_vert"}  ariaLabel="Options" />
            <img src="../public/images/youtube.jpg" alt="100 Enfants vs l'Homme le plus..."
                 className={`${styles.thumbnail}`}/>
            <p className={`${styles.title}`}>
                100 Enfants vs l'Homme le plus...
            </p>
            <Button type="button" variant={"ghost"} size={"default"} iconName={"close"}  ariaLabel="Retirer de la playlist" />
        </li>
    )
}