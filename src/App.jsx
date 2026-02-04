import { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Search, Info, BookOpen } from 'lucide-react';
import { initialNodes, initialEdges } from './data/mapData';
import { conceptosInfo } from './data/conceptsData';
import './App.css';

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTooltip, setShowTooltip] = useState(null);

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

  const onNodeClick = useCallback((event, node) => {
    const conceptInfo = conceptosInfo[node.id];
    if (conceptInfo) {
      setSelectedNode(conceptInfo);
    }
  }, []);

  const filteredConceptos = Object.entries(conceptosInfo).filter(([key, value]) =>
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

  const handleExport = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'mapa-biologia.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handlePrint = () => {
    window.print();
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
            <span className="logo-icon">🧬</span>
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
                {editMode ? '🔒 Ver' : '✏️ Editar'}
              </button>
              <button className="export-btn" onClick={handleExport} title="Exportar mapa como JSON">
                💾 Exportar
              </button>
              <button className="print-btn" onClick={handlePrint} title="Imprimir mapa">
                🖨️ Imprimir
              </button>
              {editMode && (
                <button 
                  className="export-btn" 
                  onClick={handleResetPositions}
                  title="Restaurar posiciones originales"
                  style={{ background: 'rgba(255,100,100,0.3)' }}
                >
                  ↺ Resetear
                </button>
              )}
            </>
          )}
          <span className="concept-count">69 conceptos</span>
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

        <div className="canvas-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: isMobile ? 0.3 : 0.5 }}
            attributionPosition="bottom-left"
            panOnScroll={true}
            panOnDrag={!editMode}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={false}
            nodesDraggable={editMode}
            nodesConnectable={false}
            elementsSelectable={true}
          >
            <Background 
              color="#aaa"
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
                background: '#ffffff',
                border: '2px solid #e2e8f0',
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
              position="bottom-left"
            />
            {editMode && (
              <Panel position="top-center" style={{
                background: 'rgba(255, 215, 0, 0.9)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                color: '#000',
                border: '2px solid #ffa500',
                boxShadow: '0 4px 12px rgba(255, 165, 0, 0.3)'
              }}>
                ✏️ Modo Edición Activado - Arrastra los nodos para reorganizar
              </Panel>
            )}
            <Panel position="top-right" className="legend-panel">
              <div className="legend">
                <h4>📚 Leyenda de Categorías</h4>
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
            <Panel position="top-left" className="help-panel">
              <div className="help-content">
                <h4>💡 Cómo usar</h4>
                <ul>
                  <li><strong>Arrastra</strong> para navegar</li>
                  <li><strong>Rueda del mouse</strong> para zoom</li>
                  <li><strong>Click en nodos</strong> para detalles</li>
                  <li><strong>Busca</strong> conceptos arriba</li>
                </ul>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {selectedNode && (
        <div className="modal-overlay" onClick={() => setSelectedNode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedNode(null)}>
              ×
            </button>
            <div className="modal-header">
              <span className="modal-number">{selectedNode.numero}</span>
              <h2>{selectedNode.nombre}</h2>
            </div>
            <div className="modal-body">
              <p className="modal-description">{selectedNode.descripcion}</p>
              <div className="modal-meta">
                <div className="modal-category">
                  <strong>Categoría:</strong> {selectedNode.categoria}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
