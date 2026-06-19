import { FaEraser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { Button } from "../Button";
import { useTileMap } from "../../contexts/TileMapContext";

import styles from './TileEraser.module.css';

export function TileEraser() {
    const { t } = useTranslation();

    const {
        activeTool,
        setActiveTool,
        setSelectedLayerSprite,
        setSelectedSprite
    } = useTileMap();

    function handleTileEraserClick() {
        setActiveTool(prev => {
            const nextTool = prev === 'eraser' ? 'default' : 'eraser';

            if (nextTool === 'eraser') {
                setSelectedSprite({});
                setSelectedLayerSprite(null);
            }

            return nextTool;
        });
    }

    return (
        <div className={styles.positions}>
            <Button
                info={t('eraser')}
                active={activeTool === 'eraser'}
                borderTopLeftRadius={15}
                borderTopRightRadius={15}
                borderBottomLeftRadius={15}
                borderBottomRightRadius={15}
                onClick={handleTileEraserClick}
            >
                <FaEraser />
            </Button>
        </div>
    );
}