import styles from './SidebarHeader.module.css'

export function SidebarHeader({ title, headerAction }) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                {title}
            </h1>
            {headerAction}
        </div>
    )
}