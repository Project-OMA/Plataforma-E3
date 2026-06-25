import { useEffect } from "react";
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

    function toggleTileEraser() {
        setActiveTool(prev => {
            const nextTool = prev === 'eraser' ? 'default' : 'eraser';

            if (nextTool === 'eraser') {
                setSelectedSprite({});
                setSelectedLayerSprite(null);
            }

            return nextTool;
        });
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            const target = e.target;

            const isTyping =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT' ||
                target.isContentEditable;

            if (isTyping) return;

            if (e.key.toLowerCase() === 'e') {
                e.preventDefault();
                toggleTileEraser();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className={styles.positions}>
            <Button
                info={`${t('eraser')} (E)`}
                active={activeTool === 'eraser'}
                borderTopLeftRadius={15}
                borderTopRightRadius={15}
                borderBottomLeftRadius={15}
                borderBottomRightRadius={15}
                onClick={toggleTileEraser}
            >
                <FaEraser />
            </Button>
        </div>
    );
}