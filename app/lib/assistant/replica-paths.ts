export const coreNoteId = 'core-perfil-tldr'

export const pageNoteIds: Record<string, readonly string[]> = {
  '/marketfully': ['caso-marketfully-ai', 'exp-marketfully'],
  '/experience/marketfully': ['caso-marketfully-ai', 'exp-marketfully'],
  '/getgloby': ['caso-getgloby-saas', 'exp-getgloby'],
  '/jaga': ['caso-jaga-identidad', 'exp-getgloby'],
  '/golf-boost': ['exp-golf-boost-rehab-boost'],
  '/kove-800x-rally': ['caso-kove-800x-rally'],
  '/experience/dickeys-barbecue': ['exp-dickeys'],
  '/experience/centric-digital': ['exp-centric-digital', 'caso-dummies-rebranding'],
  '/experience/vspt-wine-group': ['exp-vspt-wine-group', 'exp-vina-errazuriz'],
  '/notes/my-2026-tool-stack': ['skills-stack-2026', 'skills-articulos-pensamiento'],
  '/notes/liquid-glass': ['skills-articulos-pensamiento'],
  '/about': ['id-propuesta-valor-bio', 'id-filosofia-liderazgo', 'skills-capacidades-producto'],
  '/craft': ['proy-catalogo-completo'],
}

export const noteIdsForPath = (path: string) => pageNoteIds[path] ?? []
