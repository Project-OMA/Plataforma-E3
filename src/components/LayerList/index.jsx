import styles from './LayerList.module.css';

import { useEffect } from "react";
import { useTileMap } from "../../contexts/TileMapContext";
import { LayerItem } from '../LayerItem';
import { Sidebar } from '../Sidebar';
import { LuClipboardList } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { RiInformationLine, RiInformationOffLine } from "react-icons/ri";
import { Tooltip } from '../Tooltip';

export function LayerList() {
    const { t } = useTranslation();

    const { tilemap, isElementsOpen, setIsElementsOpen, setIsMenuOpen, displacementSidebarMenu, selectedLayer, setSelectedLayer } = useTileMap();

    const toggleLayer = (layerId) => {
        setSelectedLayer(layerId);
    };

    const handleElementsOpen = () => { setIsElementsOpen(!isElementsOpen); }

    useEffect(() => {
        if (isElementsOpen) setIsMenuOpen(false);
    }, [isElementsOpen])

    const [hintsEnabled, setHintsEnabled] = useState(true);

    const handleHintsClick = () => {
        setHintsEnabled(prev => {
            const next = !prev;
            return next;
        });
    };

    const defaultTooltip = {
        text: '',
        visible: false,
        x: 0,
        y: 0
    };

    const [tooltip, setTooltip] = useState(defaultTooltip);

    const handleHintsButtonMouseMove = (e) => {
        setTooltip({
            text: "Ativa ou desativa as dicas dos botões",
            visible: true,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleHintsButtonMouseLeave = () => {
        setTooltip(defaultTooltip);
    };

    const layersWithSprites = tilemap.layers.filter(layer => layer.sprites.length > 0);


    return (
        <>
            <Sidebar
                title={t('map_elements')}
                icon={<LuClipboardList />}
                headerAction={
                    <button
                        type="button"
                        onClick={handleHintsClick}
                        onMouseMove={handleHintsButtonMouseMove}
                        onMouseLeave={handleHintsButtonMouseLeave}
                        className={styles.hintsButton}
                        aria-label="Ativar ou desativar dicas"
                    >
                        {hintsEnabled
                            ? <RiInformationLine />
                            : <RiInformationOffLine />
                        }
                    </button>
                }
                borderTopRightRadiusButton={15}
                borderBottomRightRadiusButton={15}
                borderBottomRightRadiusBody={15}
                positionTop={95}
                active={isElementsOpen}
                toggleSidebar={isElementsOpen}
                onClick={handleElementsOpen}
                positionRight={displacementSidebarMenu}
            >
                {layersWithSprites.length > 0 ? (
                    <ul className={styles.layerList}>
                        {layersWithSprites.map(layer => (
                            <LayerItem
                                key={layer.id}
                                layer={layer}
                                isOpen={selectedLayer == layer.id}
                                toggleLayer={() => toggleLayer(layer.id)}
                                hintsEnabled={hintsEnabled}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyElementsMessage}>
                        Nenhum elemento adicionado ao mapa
                    </p>
                )}
            </Sidebar>

            {tooltip.visible && (
                <Tooltip
                    text={tooltip.text}
                    x={tooltip.x}
                    y={tooltip.y}
                />
            )}
        </>
    )

}