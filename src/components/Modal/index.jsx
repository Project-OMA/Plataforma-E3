import styles from './Modal.module.css';

export function Modal({
    onConfirm,
    buttons = true,
    children,
    active = false,
    setActive,
    showButtonClose = false,
    title,
    singleButton = false
}) {

    if (!active) return null;

    return (

        <div className={styles.overlay}>
            <div className={styles.modal}>

                {showButtonClose &&
                    <button
                        className={styles.closeButton}
                        onClick={() => setActive(false)}
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                }

                <div className={styles.header}>
                    <h4 className={styles.title}>
                        {title}
                    </h4>
                </div>

                <div className={styles.body}>
                    {children}
                </div>

                <div className={styles.footer}>
                    {buttons &&
                        <div className={styles.buttons}>

                            <button
                                className={styles.butonPrimary}
                                onClick={onConfirm}
                            >
                                {singleButton ? "Confirmar" : "Sim"}
                            </button>

                            {!singleButton && (
                                <button
                                    className={styles.butonSecundary}
                                    onClick={() => setActive(false)}
                                >
                                    Não
                                </button>
                            )}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}