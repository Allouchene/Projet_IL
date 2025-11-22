import styles from './Button.module.css';
export default function Button({children,
                               variant = "glass", // 'glass', 'primary', 'icon', 'ghost'
                               size = "default", // 'default' pour home, 'large' pour welcome
                               iconName,
                               ariaLabel,
                               className = "",
                               type = "button",
                               ...props}){


    const buttonClasses = `${styles.btn}
                                      ${styles[variant]} 
                                      ${styles[size]}
                                      ${className}`.trim()

    return (

        <button
            type= {type}
            className={buttonClasses}
            aria-label={ariaLabel}
        >
            {iconName && <span className="material-symbols-outlined">{iconName}</span>}
            {children}
        </button>
    )
}