## 1. Architecture Design
```mermaid
flowchart LR
    A[Frontend: React + Tailwind] --> B[Diff Algorithm]
    B --> C[Highlight Rendering]
```

## 2. Technology Description
- Frontend: React@18 + tailwindcss@3 + vite
- Initialization Tool: vite-init
- Backend: None (纯前端应用)
- Diff Algorithm: jsdiff 库

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | 文本比较主页 |

## 4. API Definitions
Not applicable (纯前端应用)

## 5. Server Architecture Diagram
Not applicable

## 6. Data Model
Not applicable (无持久化数据)