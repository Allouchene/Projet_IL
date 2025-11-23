import styles from './Button.module.css';
export default function Button({children,
                               variant = "glass", // 'glass', 'primary', 'ghost'
                               size = "default", // 'default' pour home, 'large' pour welcome
                               iconName,
                               ariaLabel,
                               className = "",
                               type = "button",
                                id,
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
            onMouseEnter={() => setAction({id})}
            {...props}
        >
            {iconName && <span className="material-symbols-outlined">{iconName}</span>}
            {children}
        </button>
    )
}