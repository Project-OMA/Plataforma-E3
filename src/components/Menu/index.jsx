import styles from './Menu.module.css'

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTileMap } from '../../contexts/TileMapContext';

import { FaPlus } from "react-icons/fa6";
import { IoMdSave } from "react-icons/io";
import { FaFolderOpen } from "react-icons/fa";
import { IoMenu } from 'react-icons/io5';

import { Modal } from '../Modal';
import { Sidebar } from '../Sidebar';

import { adaptarAppJsonParaE3Map } from '../../utils/adaptador';
import { converterJsonParaXml } from '../../utils/converterJsonParaXml';
import { converterXmlParaJson } from '../../utils/converterXmlParaJson';
import { converterJsonParaJson } from '../../utils/converterJsonParaJson';
import { convertMap } from '../../utils/converter';

export function Menu() {
    const { t } = useTranslation();

    const download = (fileFormat, fileString) => {

        const type = fileFormat === 'json' ? 'application/json' : 'application/xml'

        const blob = new Blob([fileString], { type: type });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `map.${fileFormat}`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    const [isModal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [fileFormat, setFileFormat] = useState('json');
    const [option, setOption] = useState('save');

    const hasPersonOnMap = () => {
        const personsLayer = tilemap.layers.find(layer => layer.id === 'persons');

        return personsLayer?.sprites?.some(sprite => sprite);
    };

    const openModal = (opt) => {
        if (opt === 'save' && !hasPersonOnMap()) {
            setOption('save-warning');
            setModalTitle("Salvar Mapa");
            setModal(true);
            return;
        }

        setModal(true);

        setOption(opt);
        const title = opt === 'save' ? "Salvar Mapa" : "Novo Mapa";

        setModalTitle(title);
    }

    const save = () => {
        let fileString = ''
        if (fileFormat == 'json') {

            const e3Map = adaptarAppJsonParaE3Map(tilemap);
            const map = convertMap(e3Map);
            fileString = JSON.stringify(map)
        }
        else {
            fileString = converterJsonParaXml(tilemap);
        }
        setModal(false)
        download(fileFormat, fileString);
    }

    const target = () => {
        setModal(false)
        window.open(window.location.href, '_blank');
    }

    const handleKey = (e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    const {
        tilemap, setTilemap,
        setSelectedSprite,
        setSelectedLayerSprite,
        setHistory, history,
        isMenuOpen, setIsMenuOpen, setDisplacementSidebarMenu,
        setIsElementsOpen
    } = useTileMap();

    const handleMenuOpen = () => { setIsMenuOpen(prev => !prev); }

    useEffect(() => {
        if (isMenuOpen) setIsElementsOpen(false);
    }, [isMenuOpen])

    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;

                switch (fileExtension) {
                    case "json":
                        try {
                            const jsonContent = JSON.parse(content);
                            const retorno = converterJsonParaJson(jsonContent);
                            setTilemap(retorno)
                        }
                        catch (err) {
                            console.error("Erro ao parsear JSON:", err);
                        }
                        break;

                    case "xml":
                        const retorno = converterXmlParaJson(content)
                        setTilemap(retorno)
                        break;

                    default:
                        console.warn("Extensão não suportada");
                        break;
                }
            };

            reader.readAsText(file);
        }
        event.target.value = null;
    };

    return (
        <Sidebar
            title="Menu"
            icon={<IoMenu />}
            borderTopRightRadiusButton={15}
            borderBottomRightRadiusButton={15}
            borderBottomRightRadiusBody={15}
            positionTop={25}
            active={isMenuOpen}
            toggleSidebar={isMenuOpen}
            onClick={handleMenuOpen}
            setDisplacementSidebar={setDisplacementSidebarMenu}
        >
            <Modal
                active={isModal}
                setActive={setModal}
                title={modalTitle}
                showButtonClose={false}
                onConfirm={option === 'save-warning' ? () => setModal(false) : (option === 'save' ? save : target)}
                singleButton={option === 'save-warning'}
            >
                <div className={styles.contentModal}>
                    {option === 'save' ? (
                        <div>
                            <h2 className={styles.titleModal}> Qual formato deseja salvar o projeto em andamento? </h2>
                            <select onChange={(e) => setFileFormat(e.target.value)} className={styles.selectTile}>

                                <option value="json" selected>JSON</option>

                                <option value="xml">XML</option>

                            </select>

                        </div>

                    ) : option === 'save-warning' ? (

                        <h2 className={styles.titleModal}>
                            É necessário adicionar ao menos um personagem no mapa para salvar
                        </h2>

                    ) : (

                        <h2 className={styles.titleModal}>Deseja iniciar um novo mapa?</h2>

                    )}
                </div>
            </Modal>

            <div aria-label={"menu"} className={styles.menuContainer} role="menubar">
                <div className={styles.divider} style={{ marginTop: '-10px' }}></div>

                <div
                    className={styles.menuItem}
                    onClick={() => openModal("new")}
                    onKeyDown={(e) => handleKey(e, openModal("new"))}
                    role="menuitem"
                    tabIndex={0}
                    aria-label={"novo"}
                >
                    <FaPlus className={styles.menuIcone} />
                    <h3>{t('new')}</h3>
                </div>

                <div className={styles.divider}></div>

                <div
                    className={styles.menuItem}
                    onClick={() => openModal("save")}
                    onKeyDown={(e) => handleKey(e, openModal("save"))}
                    role="menuitem"
                    tabIndex={0}
                    aria-label={"salvar"}
                >
                    <IoMdSave className={styles.menuIcone} />
                    <h3>{t('save')}</h3>
                </div>

                <div className={styles.divider}></div>

                <div
                    className={styles.menuItem}
                    tabIndex={0}
                    aria-label={"abrir"}
                >
                    <label htmlFor="tile" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <FaFolderOpen className={styles.menuIcone} />
                        <h3>{t('open')}</h3>
                    </label>

                    <input
                        type="file"
                        accept=".json, .xml"
                        id="tile"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        aria-hidden="true"
                        tabIndex={-1}
                    />
                </div>
            </div>
        </Sidebar>
    )
}