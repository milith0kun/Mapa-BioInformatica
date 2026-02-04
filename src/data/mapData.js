// Colores de nodos por categoría
const colors = {
  fundamentales: { bg: '#e1f5ff', border: '#01579b' },
  estructurales: { bg: '#fff3e0', border: '#e65100' },
  procesos: { bg: '#f3e5f5', border: '#4a148c' },
  traduccion: { bg: '#fff9c4', border: '#f57f17' },
  tecnicas: { bg: '#e8f5e9', border: '#1b5e20' },
  genomica: { bg: '#fce4ec', border: '#880e4f' },
};

const createNode = (id, label, position, type) => ({
  id,
  data: { label },
  position,
  style: {
    background: colors[type].bg,
    border: `2px solid ${colors[type].border}`,
    borderRadius: '8px',
    padding: '12px 16px',
    fontWeight: 500,
  },
});

// Nodos organizados por categoría con mejor espaciado
export const initialNodes = [
  // Fundamentos Celulares (columna izquierda)
  createNode('Celula', '1. Célula', { x: 100, y: 100 }, 'fundamentales'),
  createNode('TeoriaCelular', '2. Teoría celular', { x: 100, y: 250 }, 'fundamentales'),
  createNode('CicloVida', '3. Ciclo de vida celular', { x: 400, y: 150 }, 'fundamentales'),
  createNode('ViaMetabolica', '4. Vía metabólica', { x: 400, y: 300 }, 'fundamentales'),
  createNode('Eucariota', '22. Célula eucariota', { x: 100, y: 400 }, 'fundamentales'),
  createNode('Procariota', '23. Célula procariota', { x: 100, y: 550 }, 'fundamentales'),
  
  // Estructura y Genética (centro)
  createNode('ADN', '5. ADN', { x: 700, y: 100 }, 'estructurales'),
  createNode('ARN', '6. ARN', { x: 700, y: 250 }, 'estructurales'),
  createNode('Nucleotido', '16. Nucleótido', { x: 1000, y: 100 }, 'estructurales'),
  createNode('Bases', '17. Bases nitrogenadas', { x: 1300, y: 100 }, 'estructurales'),
  createNode('Chargaff', '18. Regla de Chargaff', { x: 1600, y: 100 }, 'estructurales'),
  createNode('DobleHelice', '19. Doble hélice', { x: 1000, y: 250 }, 'estructurales'),
  createNode('Complementariedad', '20. Complementariedad de bases', { x: 1300, y: 250 }, 'estructurales'),
  createNode('Cromosoma', '9. Cromosoma', { x: 700, y: 400 }, 'estructurales'),
  createNode('Gen', '10. Gen', { x: 1000, y: 400 }, 'estructurales'),
  createNode('Exon', '24. Exón', { x: 1300, y: 400 }, 'estructurales'),
  createNode('Intron', '25. Intrón', { x: 1300, y: 550 }, 'estructurales'),
  createNode('HerenciaMendeliana', '11. Herencia mendeliana', { x: 700, y: 700 }, 'estructurales'),
  createNode('Mutacion', '12. Mutación', { x: 1000, y: 700 }, 'estructurales'),
  createNode('Ligamiento', '13. Ligamiento genético', { x: 700, y: 850 }, 'estructurales'),
  createNode('MapaGenetico', '14. Mapa genético', { x: 1000, y: 850 }, 'estructurales'),
  createNode('UnGenUnaProteina', '15. Un gen-una proteína', { x: 1000, y: 550 }, 'estructurales'),
  createNode('AlfabetoMolecular', '8. Alfabeto molecular', { x: 1000, y: 1000 }, 'estructurales'),
  createNode('Proteina', '7. Proteína', { x: 400, y: 1000 }, 'traduccion'),
  
  // Dogma Central y Transcripción
  createNode('DogmaCentral', '41. Dogma central', { x: 700, y: 1150 }, 'procesos'),
  createNode('Replicacion', '21. Replicación del ADN', { x: 400, y: 1300 }, 'procesos'),
  createNode('Transcripcion', '26. Transcripción', { x: 1000, y: 1300 }, 'procesos'),
  createNode('ARNPolimerasa', '27. ARN polimerasa', { x: 1300, y: 1300 }, 'procesos'),
  createNode('ARNm', '28. ARN mensajero', { x: 1000, y: 1450 }, 'procesos'),
  createNode('Splicing', '29. Splicing', { x: 1300, y: 1450 }, 'procesos'),
  
  // Traducción y Proteínas
  createNode('Traduccion', '30. Traducción', { x: 400, y: 1600 }, 'traduccion'),
  createNode('Ribosoma', '31. Ribosoma', { x: 100, y: 1750 }, 'traduccion'),
  createNode('Aminoacido', '32. Aminoácido', { x: 400, y: 1750 }, 'traduccion'),
  createNode('Polipeptido', '33. Polipéptido', { x: 100, y: 1900 }, 'traduccion'),
  createNode('Codon', '34. Codón', { x: 700, y: 1750 }, 'traduccion'),
  createNode('CodigoGenetico', '35. Código genético', { x: 1000, y: 1750 }, 'traduccion'),
  createNode('Degeneracion', '36. Degeneración del código genético', { x: 1300, y: 1750 }, 'traduccion'),
  createNode('CodonInicio', '37. Codón de inicio', { x: 1000, y: 1900 }, 'traduccion'),
  createNode('CodonTerminacion', '38. Codón de terminación', { x: 1300, y: 1900 }, 'traduccion'),
  createNode('ARNt', '39. ARN de transferencia', { x: 700, y: 2050 }, 'traduccion'),
  createNode('Anticodon', '40. Anticodón', { x: 1000, y: 2050 }, 'traduccion'),
  
  // Técnicas Moleculares (columna derecha)
  createNode('PCR', '42. PCR', { x: 1900, y: 100 }, 'tecnicas'),
  createNode('Cebador', '43. Cebador/Primer', { x: 2200, y: 100 }, 'tecnicas'),
  createNode('Desnaturalizacion', '44. Desnaturalización', { x: 1900, y: 250 }, 'tecnicas'),
  createNode('Alineamiento', '45. Alineamiento/Priming', { x: 2200, y: 250 }, 'tecnicas'),
  createNode('Extension', '46. Extensión', { x: 1900, y: 400 }, 'tecnicas'),
  createNode('ClonacionMolecular', '47. Clonación molecular', { x: 1900, y: 700 }, 'tecnicas'),
  createNode('Vector', '48. Vector de clonación', { x: 2200, y: 700 }, 'tecnicas'),
  createNode('BibliotecaClones', '49. Biblioteca de clones', { x: 2200, y: 850 }, 'tecnicas'),
  createNode('EnzimaRestriccion', '50. Enzima de restricción', { x: 1900, y: 1000 }, 'tecnicas'),
  createNode('SitioReconocimiento', '51. Sitio de reconocimiento', { x: 2200, y: 1000 }, 'tecnicas'),
  createNode('ExtremosRomos', '52. Extremos romos', { x: 1900, y: 1150 }, 'tecnicas'),
  createNode('ExtremosPegajosos', '53. Extremos pegajosos', { x: 2200, y: 1150 }, 'tecnicas'),
  createNode('Hibridacion', '54. Hibridación', { x: 1900, y: 1300 }, 'tecnicas'),
  createNode('Ligacion', '55. Ligación', { x: 2200, y: 1300 }, 'tecnicas'),
  createNode('Electroforesis', '56. Electroforesis en gel', { x: 1900, y: 1450 }, 'tecnicas'),
  createNode('Sonda', '57. Sonda', { x: 2200, y: 1450 }, 'tecnicas'),
  createNode('Microarreglo', '58. Microarreglo', { x: 2200, y: 1600 }, 'tecnicas'),
  
  // Genómica y Evolución (abajo derecha)
  createNode('VariacionGenetica', '59. Variación genética intraespecífica', { x: 1900, y: 1900 }, 'genomica'),
  createNode('GenomaReferencia', '60. Genoma de referencia', { x: 2200, y: 1900 }, 'genomica'),
  createNode('Conservacion', '61. Conservación genética', { x: 1900, y: 2050 }, 'genomica'),
  createNode('Evolucion', '62. Evolución', { x: 1600, y: 2200 }, 'genomica'),
  createNode('SeleccionNatural', '63. Selección natural', { x: 1300, y: 2200 }, 'genomica'),
  createNode('Adaptacion', '64. Adaptación', { x: 1300, y: 2350 }, 'genomica'),
  createNode('Especiacion', '65. Especiación', { x: 1600, y: 2350 }, 'genomica'),
  createNode('GenomicaComparativa', '66. Genómica comparativa', { x: 1900, y: 2200 }, 'genomica'),
  createNode('AlineamientoSecuencias', '67. Alineamiento de secuencias', { x: 2200, y: 2200 }, 'genomica'),
  createNode('BLAST', '68. BLAST', { x: 2200, y: 2350 }, 'genomica'),
  createNode('Bioinformatica', '69. Bioinformática', { x: 1900, y: 2350 }, 'genomica'),
];

// Edges (conexiones entre nodos)
export const initialEdges = [
  // Fundamentos
  { id: 'e1-1', source: 'TeoriaCelular', target: 'Celula', label: 'postula que', animated: false },
  { id: 'e1-2', source: 'Celula', target: 'CicloVida', label: 'pasa por' },
  { id: 'e1-3', source: 'Celula', target: 'Eucariota', label: 'se clasifica en' },
  { id: 'e1-4', source: 'Celula', target: 'Procariota', label: 'se clasifica en' },
  { id: 'e1-5', source: 'Celula', target: 'ViaMetabolica', label: 'contiene' },
  
  // ADN - Estructura
  { id: 'e2-1', source: 'ADN', target: 'Nucleotido', label: 'está formado por' },
  { id: 'e2-2', source: 'ARN', target: 'Nucleotido', label: 'está formado por' },
  { id: 'e2-3', source: 'Nucleotido', target: 'Bases', label: 'contiene' },
  { id: 'e2-4', source: 'Bases', target: 'Chargaff', label: 'cumplen' },
  { id: 'e2-5', source: 'Bases', target: 'Complementariedad', label: 'permiten' },
  { id: 'e2-6', source: 'ADN', target: 'DobleHelice', label: 'forma' },
  { id: 'e2-7', source: 'DobleHelice', target: 'Complementariedad', label: 'se basa en' },
  { id: 'e2-8', source: 'Complementariedad', target: 'Chargaff', label: 'explica' },
  
  // Organización genómica
  { id: 'e3-1', source: 'ADN', target: 'Cromosoma', label: 'se organiza en' },
  { id: 'e3-2', source: 'Cromosoma', target: 'Gen', label: 'contiene' },
  { id: 'e3-3', source: 'Gen', target: 'Exon', label: 'tiene regiones' },
  { id: 'e3-4', source: 'Gen', target: 'Intron', label: 'tiene regiones' },
  { id: 'e3-5', source: 'Exon', target: 'Eucariota', label: 'presente en genes de' },
  { id: 'e3-6', source: 'Intron', target: 'Eucariota', label: 'presente en genes de' },
  { id: 'e3-7', source: 'Procariota', target: 'Intron', label: 'genes carecen de', style: { strokeDasharray: '5,5' } },
  
  // Genética clásica
  { id: 'e4-1', source: 'Gen', target: 'HerenciaMendeliana', label: 'se transmite por' },
  { id: 'e4-2', source: 'Cromosoma', target: 'Ligamiento', label: 'muestra' },
  { id: 'e4-3', source: 'Ligamiento', target: 'MapaGenetico', label: 'permite construir' },
  { id: 'e4-4', source: 'ADN', target: 'Mutacion', label: 'puede sufrir' },
  { id: 'e4-5', source: 'Gen', target: 'UnGenUnaProteina', label: 'según hipótesis produce' },
  { id: 'e4-6', source: 'UnGenUnaProteina', target: 'Proteina', label: 'codifica' },
  
  // Dogma Central
  { id: 'e5-1', source: 'DogmaCentral', target: 'ADN', label: 'describe flujo desde' },
  { id: 'e5-2', source: 'DogmaCentral', target: 'ARN', label: 'describe flujo hacia' },
  { id: 'e5-3', source: 'DogmaCentral', target: 'Proteina', label: 'describe flujo hasta' },
  { id: 'e5-4', source: 'ADN', target: 'Replicacion', label: 'se duplica por' },
  { id: 'e5-5', source: 'Replicacion', target: 'Complementariedad', label: 'usa' },
  { id: 'e5-6', source: 'ADN', target: 'Transcripcion', label: 'se copia a' },
  { id: 'e5-7', source: 'Transcripcion', target: 'ARN', label: 'produce' },
  { id: 'e5-8', source: 'ARN', target: 'Traduccion', label: 'se decodifica en' },
  { id: 'e5-9', source: 'Traduccion', target: 'Proteina', label: 'sintetiza' },
  
  // Transcripción
  { id: 'e6-1', source: 'Transcripcion', target: 'ARNPolimerasa', label: 'es catalizada por' },
  { id: 'e6-2', source: 'Transcripcion', target: 'ARNm', label: 'genera' },
  { id: 'e6-3', source: 'ARNPolimerasa', target: 'ARNm', label: 'sintetiza' },
  { id: 'e6-4', source: 'ARNm', target: 'Splicing', label: 'es procesado por' },
  { id: 'e6-5', source: 'Splicing', target: 'Exon', label: 'une' },
  { id: 'e6-6', source: 'Splicing', target: 'Intron', label: 'elimina' },
  { id: 'e6-7', source: 'Eucariota', target: 'Splicing', label: 'requiere' },
  
  // Traducción
  { id: 'e7-1', source: 'ARNm', target: 'Traduccion', label: 'es leído en' },
  { id: 'e7-2', source: 'Traduccion', target: 'Ribosoma', label: 'ocurre en' },
  { id: 'e7-3', source: 'Traduccion', target: 'Aminoacido', label: 'incorpora' },
  { id: 'e7-4', source: 'Ribosoma', target: 'Polipeptido', label: 'ensambla' },
  { id: 'e7-5', source: 'Aminoacido', target: 'Polipeptido', label: 'forma' },
  { id: 'e7-6', source: 'Polipeptido', target: 'Proteina', label: 'se pliega en' },
  { id: 'e7-7', source: 'ARNm', target: 'Codon', label: 'se lee en' },
  { id: 'e7-8', source: 'Codon', target: 'CodigoGenetico', label: 'está definido por' },
  { id: 'e7-9', source: 'CodigoGenetico', target: 'Aminoacido', label: 'especifica' },
  { id: 'e7-10', source: 'CodigoGenetico', target: 'Degeneracion', label: 'presenta' },
  { id: 'e7-11', source: 'CodigoGenetico', target: 'CodonInicio', label: 'incluye' },
  { id: 'e7-12', source: 'CodigoGenetico', target: 'CodonTerminacion', label: 'incluye' },
  { id: 'e7-13', source: 'Traduccion', target: 'ARNt', label: 'requiere' },
  { id: 'e7-14', source: 'ARNt', target: 'Anticodon', label: 'porta' },
  { id: 'e7-15', source: 'ARNt', target: 'Aminoacido', label: 'transporta' },
  { id: 'e7-16', source: 'Anticodon', target: 'Codon', label: 'reconoce' },
  { id: 'e7-17', source: 'Complementariedad', target: 'Anticodon', label: 'permite apareamiento' },
  
  // Alfabeto molecular
  { id: 'e8-1', source: 'ADN', target: 'AlfabetoMolecular', label: 'se representa como' },
  { id: 'e8-2', source: 'ARN', target: 'AlfabetoMolecular', label: 'se representa como' },
  { id: 'e8-3', source: 'Proteina', target: 'AlfabetoMolecular', label: 'se representa como' },
  
  // PCR
  { id: 'e9-1', source: 'PCR', target: 'ADN', label: 'amplifica' },
  { id: 'e9-2', source: 'PCR', target: 'Cebador', label: 'usa' },
  { id: 'e9-3', source: 'PCR', target: 'Desnaturalizacion', label: 'incluye fase' },
  { id: 'e9-4', source: 'PCR', target: 'Alineamiento', label: 'incluye fase' },
  { id: 'e9-5', source: 'PCR', target: 'Extension', label: 'incluye fase' },
  { id: 'e9-6', source: 'Desnaturalizacion', target: 'DobleHelice', label: 'separa' },
  { id: 'e9-7', source: 'Alineamiento', target: 'Cebador', label: 'posiciona' },
  { id: 'e9-8', source: 'Alineamiento', target: 'Complementariedad', label: 'usa' },
  { id: 'e9-9', source: 'Extension', target: 'Replicacion', label: 'replica mediante' },
  { id: 'e9-10', source: 'Cebador', target: 'Hibridacion', label: 'se une por' },
  
  // Clonación
  { id: 'e10-1', source: 'ClonacionMolecular', target: 'ADN', label: 'inserta' },
  { id: 'e10-2', source: 'ClonacionMolecular', target: 'Vector', label: 'utiliza' },
  { id: 'e10-3', source: 'Vector', target: 'BibliotecaClones', label: 'genera' },
  { id: 'e10-4', source: 'ADN', target: 'EnzimaRestriccion', label: 'se corta con' },
  { id: 'e10-5', source: 'EnzimaRestriccion', target: 'SitioReconocimiento', label: 'reconoce' },
  { id: 'e10-6', source: 'EnzimaRestriccion', target: 'ExtremosRomos', label: 'puede generar' },
  { id: 'e10-7', source: 'EnzimaRestriccion', target: 'ExtremosPegajosos', label: 'puede generar' },
  { id: 'e10-8', source: 'ExtremosPegajosos', target: 'Hibridacion', label: 'facilitan' },
  { id: 'e10-9', source: 'Hibridacion', target: 'Complementariedad', label: 'se basa en' },
  { id: 'e10-10', source: 'ClonacionMolecular', target: 'Ligacion', label: 'requiere' },
  { id: 'e10-11', source: 'Ligacion', target: 'ADN', label: 'sella' },
  
  // Técnicas análisis
  { id: 'e11-1', source: 'Electroforesis', target: 'ADN', label: 'separa fragmentos de' },
  { id: 'e11-2', source: 'Sonda', target: 'Hibridacion', label: 'detecta por' },
  { id: 'e11-3', source: 'Sonda', target: 'Complementariedad', label: 'usa' },
  { id: 'e11-4', source: 'Microarreglo', target: 'Sonda', label: 'contiene múltiples' },
  { id: 'e11-5', source: 'Microarreglo', target: 'ARNm', label: 'detecta' },
  { id: 'e11-6', source: 'Microarreglo', target: 'Hibridacion', label: 'funciona por' },
  
  // Genómica y evolución
  { id: 'e12-1', source: 'ADN', target: 'VariacionGenetica', label: 'presenta' },
  { id: 'e12-2', source: 'VariacionGenetica', target: 'GenomaReferencia', label: 'se compara con' },
  { id: 'e12-3', source: 'VariacionGenetica', target: 'Evolucion', label: 'impulsa' },
  { id: 'e12-4', source: 'Mutacion', target: 'VariacionGenetica', label: 'genera' },
  { id: 'e12-5', source: 'Gen', target: 'Conservacion', label: 'muestra' },
  { id: 'e12-6', source: 'Evolucion', target: 'Conservacion', label: 'preserva por' },
  { id: 'e12-7', source: 'Evolucion', target: 'SeleccionNatural', label: 'ocurre por' },
  { id: 'e12-8', source: 'SeleccionNatural', target: 'Adaptacion', label: 'produce' },
  { id: 'e12-9', source: 'Evolucion', target: 'Especiacion', label: 'puede llevar a' },
  
  // Bioinformática
  { id: 'e13-1', source: 'Bioinformatica', target: 'GenomicaComparativa', label: 'permite' },
  { id: 'e13-2', source: 'Bioinformatica', target: 'AlineamientoSecuencias', label: 'utiliza' },
  { id: 'e13-3', source: 'Bioinformatica', target: 'BLAST', label: 'implementa' },
  { id: 'e13-4', source: 'GenomicaComparativa', target: 'AlineamientoSecuencias', label: 'requiere' },
  { id: 'e13-5', source: 'AlineamientoSecuencias', target: 'BLAST', label: 'ejecuta' },
  { id: 'e13-6', source: 'AlineamientoSecuencias', target: 'Conservacion', label: 'identifica' },
  { id: 'e13-7', source: 'BLAST', target: 'Conservacion', label: 'detecta' },
  { id: 'e13-8', source: 'Bioinformatica', target: 'AlfabetoMolecular', label: 'procesa' },
  { id: 'e13-9', source: 'AlineamientoSecuencias', target: 'ADN', label: 'compara' },
  { id: 'e13-10', source: 'AlineamientoSecuencias', target: 'Proteina', label: 'compara' },
  
  // Relaciones adicionales
  { id: 'e14-1', source: 'ViaMetabolica', target: 'Proteina', label: 'es catalizada por' },
  { id: 'e14-2', source: 'Gen', target: 'Transcripcion', label: 'es expresado por' },
  { id: 'e14-3', source: 'Proteina', target: 'ViaMetabolica', label: 'ejecuta' },
];
