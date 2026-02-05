import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import '@xyflow/react/dist/style.css';
import { Search, BookOpen, Download, X, ChevronRight, FileImage, FileType, Dna } from 'lucide-react';
import { initialNodes, initialEdges } from './data/mapData';
import { conceptosInfo } from './data/conceptsData';
import './App.css';

const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: '#64748b' },
  type: 'smoothstep',
  animated: true,
  labelStyle: { fill: '#f1f5f9', fontWeight: 600, fontSize: 13 },
  labelBgStyle: { fill: '#1e2a3a', rx: 6, ry: 6 },
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const reactFlowRef = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Cargar posiciones guardadas
  useEffect(() => {
    const savedPositions = localStorage.getItem('nodePositions');
    if (savedPositions) {
      const positions = JSON.parse(savedPositions);
      setNodes((nds) =>
        nds.map((node) => {
          const savedPos = positions[node.id];
          return savedPos ? { ...node, position: savedPos } : node;
        })
      );
    }
  }, [setNodes]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar menú de exportación al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuOpen && !e.target.closest('.export-dropdown')) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [exportMenuOpen]);

  const onNodeClick = useCallback((event, node) => {
    const conceptInfo = conceptosInfo[node.id];
    if (conceptInfo) {
      setSelectedNode(conceptInfo);
    }
  }, []);

  const filteredConceptos = Object.entries(conceptosInfo).filter(([_key, value]) =>
    value.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchSelect = (conceptId) => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: {
          ...node.style,
          opacity: node.id === conceptId ? 1 : 0.3,
        },
      }))
    );
    const node = nodes.find((n) => n.id === conceptId);
    if (node) {
      setSelectedNode(conceptosInfo[conceptId]);
    }
  };

  const resetHighlight = () => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: {
          ...node.style,
          opacity: 1,
        },
      }))
    );
  };

  // Exportar mapa completo con alta calidad
  const downloadImage = (dataUrl, format) => {
    const link = document.createElement('a');
    link.download = `mapa-biologia-molecular-${Date.now()}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  // Helpers para exportación (implementación manual para evitar errores de import)
  const getNodesBounds = (nodes) => {
    if (nodes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

    // Encontrar límites extremos
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach((node) => {
      const x = node.position.x;
      const y = node.position.y;
      // Usar medidas reales si existen, o un fallback estimado
      const w = node.measured?.width ?? node.width ?? 180;
      const h = node.measured?.height ?? node.height ?? 50;

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x + w > maxX) maxX = x + w;
      if (y + h > maxY) maxY = y + h;
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };

  const getViewportForBounds = (bounds, width, height, minZoom, maxZoom, padding) => {
    const xZoom = width / (bounds.width * (1 + padding));
    const yZoom = height / (bounds.height * (1 + padding));
    const zoom = Math.min(xZoom, yZoom);
    const clampedZoom = Math.max(minZoom, Math.min(zoom, maxZoom));

    // Centrar
    const x = width / 2 - (bounds.x + bounds.width / 2) * clampedZoom;
    const y = height / 2 - (bounds.y + bounds.height / 2) * clampedZoom;

    return [x, y, clampedZoom];
  };

  const exportMap = async (format = 'png', scale = 2) => {
    // 1. Obtener bounds de todos los nodos
    const nodesBounds = getNodesBounds(nodes);

    // 2. Definir tamaño de la imagen de salida (+ padding)
    const padding = 0.1; // 10% de padding
    const width = nodesBounds.width * (1 + padding * 2);
    const height = nodesBounds.height * (1 + padding * 2);

    // 3. Calcular transformación para que encaje perfecto
    const transform = getViewportForBounds(
      nodesBounds,
      width,
      height,
      0.1, // minZoom (permitir alejarse mucho si es necesario)
      2,   // maxZoom
      padding
    );

    const flowElement = document.querySelector('.react-flow__viewport');

    if (!flowElement) return;

    try {
      const options = {
        backgroundColor: '#0a0f1a',
        width: width,
        height: height,
        style: {
          width: width,
          height: height,
          transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
        },
        pixelRatio: scale,
      };

      let dataUrl;
      if (format === 'svg') {
        dataUrl = await toSvg(flowElement, options);
      } else {
        dataUrl = await toPng(flowElement, options);
      }

      downloadImage(dataUrl, format);
      setExportMenuOpen(false);
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error al exportar. Intenta de nuevo.');
    }
  };

  // Exportar como JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `mapa-biologia-molecular-${Date.now()}.json`);
    linkElement.click();
    setExportMenuOpen(false);
  };

  // Guardar posiciones cuando se mueven nodos
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);

    // Si es un cambio de posición, guardar
    const positionChange = changes.find(c => c.type === 'position' && c.dragging === false);
    if (positionChange && editMode) {
      setNodes((nds) => {
        const positions = {};
        nds.forEach(node => {
          positions[node.id] = node.position;
        });
        localStorage.setItem('nodePositions', JSON.stringify(positions));
        return nds;
      });
    }
  }, [onNodesChange, editMode, setNodes]);

  // Resetear posiciones
  const handleResetPositions = () => {
    localStorage.removeItem('nodePositions');
    setNodes(initialNodes);
  };

  return (
    <div className={`app ${editMode ? 'edit-mode' : ''}`}>
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <Dna className="logo-icon" size={32} />
            <div className="logo-text">
              <h1>Mapa Conceptual</h1>
              <p>Biología Molecular</p>
            </div>
          </div>
        </div>
        <div className="header-center">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar conceptos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSidebarOpen(true)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => {
                setSearchTerm('');
                resetHighlight();
              }}>
                ×
              </button>
            )}
          </div>
        </div>
        <div className="header-right">
          {!isMobile && (
            <>
              <button
                className={`mode-btn ${editMode ? 'active' : ''}`}
                onClick={() => setEditMode(!editMode)}
                title={editMode ? 'Desactivar modo edición' : 'Activar modo edición para mover nodos'}
              >
                {editMode ? '👁 Ver' : '✏️ Editar'}
              </button>

              <div className="export-dropdown">
                <button
                  className="export-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExportMenuOpen(!exportMenuOpen);
                  }}
                  title="Exportar mapa en alta resolución"
                >
                  <Download size={16} />
                  Exportar
                </button>
                {exportMenuOpen && (
                  <div className="export-menu">
                    <div className="export-menu-header">
                      <span>Exportar para ploteo</span>
                    </div>
                    <button onClick={() => exportMap('png', 4)}>
                      <FileImage size={18} />
                      <div>
                        <span className="export-option-title">PNG Alta Resolución</span>
                        <span className="export-option-desc">4x escala, ideal para impresión A1/A0</span>
                      </div>
                    </button>
                    <button onClick={() => exportMap('png', 6)}>
                      <FileImage size={18} />
                      <div>
                        <span className="export-option-title">PNG Ultra HD</span>
                        <span className="export-option-desc">6x escala, máxima calidad</span>
                      </div>
                    </button>
                    <button onClick={() => exportMap('svg', 2)}>
                      <FileType size={18} />
                      <div>
                        <span className="export-option-title">SVG Vectorial</span>
                        <span className="export-option-desc">Escalable, perfecto para cualquier tamaño</span>
                      </div>
                    </button>
                    <div className="export-menu-divider"></div>
                    <button onClick={handleExportJSON}>
                      <FileType size={18} />
                      <div>
                        <span className="export-option-title">JSON Datos</span>
                        <span className="export-option-desc">Estructura del mapa</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {editMode && (
                <button
                  className="reset-btn"
                  onClick={handleResetPositions}
                  title="Restaurar posiciones originales"
                >
                  ↺ Resetear
                </button>
              )}
            </>
          )}
          <span className="concept-count">
            <Dna size={14} />
            69 conceptos
          </span>
        </div>
      </header>

      <div className="main-layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '«' : '»'}
          </button>

          {sidebarOpen && (
            <div className="sidebar-content">
              {searchTerm ? (
                <div className="search-results">
                  <h3>Resultados ({filteredConceptos.length})</h3>
                  {filteredConceptos.map(([key, value]) => (
                    <div
                      key={key}
                      className="result-item"
                      onClick={() => handleSearchSelect(key)}
                    >
                      <span className="result-number">{value.numero}</span>
                      <div className="result-info">
                        <div className="result-name">{value.nombre}</div>
                        <div className="result-category">{value.categoria}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="categories-list">
                  <h3>Categorías</h3>
                  <div className="category-item fundamentales">
                    <BookOpen size={16} />
                    <div>
                      <div className="category-name">Fundamentos Celulares</div>
                      <div className="category-count">6 conceptos</div>
                    </div>
                  </div>
                  <div className="category-item estructurales">
                    <BookOpen size={16} />
                    <div>
                      <div className="category-name">Estructura y Genética</div>
                      <div className="category-count">17 conceptos</div>
                    </div>
                  </div>
                  <div className="category-item procesos">
                    <BookOpen size={16} />
                    <div>
                      <div className="category-name">Dogma Central</div>
                      <div className="category-count">6 conceptos</div>
                    </div>
                  </div>
                  <div className="category-item traduccion">
                    <BookOpen size={16} />
                    <div>
                      <div className="category-name">Traducción y Proteínas</div>
                      <div className="category-count">11 conceptos</div>
                    </div>
                  </div>
                  <div className="category-item tecnicas">
                    <BookOpen size={16} />
                    <div>
                      <div className="category-name">Técnicas Moleculares</div>
                      <div className="category-count">17 conceptos</div>
                    </div>
                  </div>
                  <div className="category-item genomica">
                    <BookOpen size={16} />
                    <div>
                      <div className="category-name">Genómica y Evolución</div>
                      <div className="category-count">11 conceptos</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        <div className="canvas-container" ref={reactFlowRef}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onInit={setReactFlowInstance}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            fitViewOptions={{
              padding: 0.2,
              includeHiddenNodes: false,
              minZoom: 0.1,
              maxZoom: 1.5
            }}
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: isMobile ? 0.3 : 0.5 }}
            attributionPosition="bottom-left"
            panOnScroll={true}
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={false}
            nodesDraggable={editMode}
            nodesConnectable={false}
            elementsSelectable={true}
            selectNodesOnDrag={editMode}
          >
            <Background
              color="#1e3a5f"
              gap={20}
              size={1}
            />
            <Controls
              showZoom={true}
              showFitView={true}
              showInteractive={false}
              position="bottom-right"
            />
            <MiniMap
              nodeColor={(node) => {
                return node.style?.background || '#e2e8f0';
              }}
              style={{
                background: '#0d1520',
                border: '2px solid #1e3a5f',
              }}
              maskColor="rgba(0, 0, 0, 0.3)"
              position="bottom-left"
            />
            {editMode && (
              <Panel position="top-center" className="edit-mode-banner">
                MODO EDICIÓN - Arrastra los nodos para reorganizar
              </Panel>
            )}
            <Panel position="top-right" className="legend-panel">
              <div className="legend">
                <h4>Leyenda de Categorías</h4>
                <div className="legend-item">
                  <span className="legend-color fundamentales"></span>
                  Fundamentos
                </div>
                <div className="legend-item">
                  <span className="legend-color estructurales"></span>
                  Estructura
                </div>
                <div className="legend-item">
                  <span className="legend-color procesos"></span>
                  Procesos
                </div>
                <div className="legend-item">
                  <span className="legend-color traduccion"></span>
                  Traducción
                </div>
                <div className="legend-item">
                  <span className="legend-color tecnicas"></span>
                  Técnicas
                </div>
                <div className="legend-item">
                  <span className="legend-color genomica"></span>
                  Genómica
                </div>
              </div>
            </Panel>
            {!isMobile && (
              <Panel position="top-left" className="help-panel">
                <div className="help-content">
                  <h4>Cómo usar</h4>
                  <ul>
                    <li><strong>Arrastra</strong> para navegar</li>
                    <li><strong>Rueda del mouse</strong> para zoom</li>
                    <li><strong>Click en nodos</strong> para detalles</li>
                    <li><strong>Busca</strong> conceptos arriba</li>
                  </ul>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Panel lateral derecho para detalles del concepto */}
        <aside className={`detail-panel ${selectedNode ? 'open' : ''}`}>
          {selectedNode && (
            <>
              <button className="close-panel" onClick={() => setSelectedNode(null)}>
                <X size={20} />
              </button>
              <div className="detail-header">
                <span className="detail-number">{selectedNode.numero}</span>
                <h2>{selectedNode.nombre}</h2>
              </div>
              <div className="detail-body">
                <p className="detail-description">{selectedNode.descripcion}</p>
                <div className="detail-meta">
                  <div className="detail-category">
                    <strong>Categoría:</strong>
                    <span>{selectedNode.categoria}</span>
                  </div>
                </div>
              </div>
              <div className="detail-footer">
                <ChevronRight size={16} />
                <span>Click en otro nodo para ver sus detalles</span>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Mobile bottom sheet for node details */}
      {isMobile && selectedNode && (
        <div className="mobile-detail-sheet">
          <div className="mobile-sheet-header">
            <button className="close-sheet" onClick={() => setSelectedNode(null)}>
              <X size={20} />
            </button>
            <span className="mobile-number">{selectedNode.numero}</span>
            <h3>{selectedNode.nombre}</h3>
          </div>
          <div className="mobile-sheet-body">
            <p>{selectedNode.descripcion}</p>
            <span className="mobile-category">{selectedNode.categoria}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
