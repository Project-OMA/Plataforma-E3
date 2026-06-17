import styles from '../TileScale/TileScale.module.css'
import tileScaleImage from '../../assets/tile-scale.png'

export function TileScale({ style }) {
    return (
        <div className={styles.container} style={style}>
            <img
                src={tileScaleImage}
                alt="Escala do grid: cada tile representa 0,5 metro por 0,5 metro."
                className={styles.image}
                draggable={false}
            />
        </div>
    );
}