import styles from './Header.module.css'

export default function Header({
                                   variant = 'light', // "light" for welcome, "primary" for home
                                   ...props
                               }
) {

    return (
        <header className={`${styles.header} ${styles[variant]}`}>
            <div className="logo">
                <img src="TogetherPlay/src/assets/images/logo.png" alt="Logo Together Play"/>
            </div>
            <nav className="right-nav" aria-label="Navigation principale">
                <button type="button">Créer un salon</button>
                <button type="button">Rejoindre</button>
            </nav>
        </header>
    )
}