import styles from './SpriteItem.module.css'

import { useTileMap } from "../../contexts/TileMapContext";

import { FaTrash } from 'react-icons/fa';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { IoCodeSharp, IoCodeSlash } from "react-icons/io5";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Tooltip } from '../Tooltip';

export function SpriteItem({ sprite, layerId, hintsEnabled }) {

    const { t } = useTranslation();

    const { setTilemap, setSelectedLayerSprite } = useTileMap();

    const toggleVisibleTile = () => {
        setTilemap(prev => ({
            ...prev,
            layers: prev.layers.map(layer => {
                if (layer.id !== layerId) return layer;

                return {
                    ...layer,
                    sprites: layer.sprites.map(s =>
                        s.x === sprite.x && s.y === sprite.y
                            ? { ...s, visible: !s.visible }
                            : s
                    ),
                };
            }),
        }));
    };

    const removeTile = () => {
        setTilemap(prev => ({
            ...prev,
            layers: prev.layers.map(layer => {
                if (layer.id !== layerId) return layer;
                return {
                    ...layer,
                    sprites: layer.sprites.filter(s => !(s.x === sprite.x && s.y === sprite.y)),
                };
            }),
        }));
    };

    const toggleProgrammableTile = () => {
        setTilemap(prev => ({
            ...prev,
            layers: prev.layers.map(layer => {
                if (layer.id !== layerId) return layer;

                return {
                    ...layer,
                    sprites: layer.sprites.map(s =>
                        s.x === sprite.x && s.y === sprite.y
                            ? { ...s, programmable: !s.programmable }
                            : s
                    ),
                };
            }),
        }));
    };

    const handleSpriteClick = () => {
        setSelectedLayerSprite({ ...sprite, category: layerId });
    };

    const defaultTooltip = {
        text: '',
        visible: false,
        x: 0,
        y: 0
    };

    const [tooltip, setTooltip] = useState(defaultTooltip);

    const handleMouseMove = (e, text) => {
        if (!hintsEnabled) return;

        setTooltip({
            text,
            visible: true,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseLeave = () => {
        setTooltip(defaultTooltip);
    };


    return (
        <div className={styles.subLayerTile}>
            <div onClick={handleSpriteClick} className={styles.subLayerTileName} tabIndex={0}>
                <label>{t(sprite.translate)}</label>
                <label>{sprite.x}x{sprite.y}</label>
            </div>
            <div>
                <button
                    onClick={toggleVisibleTile}
                    className={styles.subLayerTileButtons}
                    aria-label="visualizar tile"
                    onMouseMove={(e) => handleMouseMove(e, "Alterna a visibilidade do elemento")}
                    onMouseLeave={handleMouseLeave}
                >
                    {sprite.visible ? <IoMdEye /> : <IoMdEyeOff />}
                </button>
                <button
                    onClick={removeTile}
                    className={styles.subLayerTileButtons}
                    aria-label="Deletar tile"
                    onMouseMove={(e) => handleMouseMove(e, "Remove elemento do mapa")}
                    onMouseLeave={handleMouseLeave}
                >
                    <FaTrash />
                </button>
                <button
                    onClick={toggleProgrammableTile}
                    className={styles.subLayerTileButtons}
                    aria-label="Marcar como programável"
                    onMouseMove={(e) => handleMouseMove(e, "Marca este elemento como programável")}
                    onMouseLeave={handleMouseLeave}
                >
                    {sprite.programmable
                        ? <IoCodeSharp />
                        : <IoCodeSlash />
                    }
                </button>
            </div>
            {tooltip.visible && (
                <Tooltip
                    text={tooltip.text}
                    x={tooltip.x}
                    y={tooltip.y}
                />
            )}
        </div>
    )
}