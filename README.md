# CV Online Bilingüe & Editor Local · Adrian Sotolongo Rodríguez

Sitio web profesional y portafolio bilingüe (Español / Inglés) para **GitHub Pages**, gestionado íntegramente desde un editor visual local sin necesidad de base de datos, backend ni servicios de terceros.

---

## 🏛 Arquitectura del Proyecto

```text
adriso94yo.github.io/
├── docs/                   # Única carpeta servida públicamente por GitHub Pages
│   ├── index.html          # Web pública moderna, bilingüe y responsive
│   ├── css/
│   │   └── styles.css      # Estilos web + Motor de impresión A4
│   ├── js/
│   │   └── app.js          # Renderizado dinámico, selector ES/EN y descargas
│   ├── data/
│   │   └── cv.json         # Fuente única de datos (bilingüe)
│   ├── files/
│   │   ├── cv-en.pdf       # Curriculum descargable en inglés
│   │   └── cv-es.pdf       # Curriculum descargable en español
│   └── images/             # Fotografías y capturas de proyectos
│
├── editor/                 # Aplicación local del propietario (NO publicada en la web)
│   ├── index.html          # Interfaz del panel de control
│   ├── css/
│   │   └── editor.css      # Estilos del editor (tema oscuro de productividad)
│   └── js/
│       └── editor.js       # File System Access API, formularios y validación
│
├── serve.mjs               # Servidor local ligero (Node.js sin dependencias)
└── README.md               # Esta guía
```

---

## 🚀 Cómo abrir y probar en local

El editor local utiliza la **File System Access API** del navegador (Chrome / Edge), por lo que debe abrirse bajo un servidor local (`http://localhost` o `http://127.0.0.1`):

### Opción A: Con la extensión Live Server de VS Code (Recomendada)
1. Abre esta carpeta en **VS Code**.
2. Si tienes la extensión **Live Server**, haz clic derecho en `docs/index.html` o `editor/index.html` y elige **Open with Live Server**.
3. Navega a:
   - **Web pública:** `http://127.0.0.1:5500/docs/`
   - **Editor local:** `http://127.0.0.1:5500/editor/`

### Opción B: Con Node.js
En la terminal de VS Code ejecuta:
```sh
node serve.mjs
```
Abre en tu navegador:
- **Web pública:** `http://127.0.0.1:8000/docs/`
- **Editor local:** `http://127.0.0.1:8000/editor/`

### Opción C: Con Python
```sh
python -m http.server 8000 --bind 127.0.0.1
```

---

## ✍️ Cómo usar el Editor Local

1. Abre `http://127.0.0.1:8000/editor/` (o el puerto de Live Server) en **Google Chrome** o **Microsoft Edge**.
2. Si el servidor local está activo, los datos actuales de `docs/data/cv.json` se precargarán automáticamente.
3. Si lo prefieres, pulsa **📂 Abrir cv.json** y selecciona tu archivo `docs/data/cv.json`.
4. Edita cualquiera de las secciones en las pestañas laterales:
   - **Perfil y Contacto:** Nombres, titulares bilingües, resumen bio, enlaces y rutas de PDF.
   - **Experiencia Laboral:** Añade nuevos puestos, reordénalos con ▲/▼, edita descripciones bilingües y herramientas.
   - **Colaboraciones Clave:** Fichas de infraestructuras críticas (Data Centers, Hospitales, etc.).
   - **Formación Académica:** Titulaciones y lista de certificaciones oficiales.
   - **Software y Competencias:** Lista de software BIM/CAD y competencias profesionales separadas por comas.
   - **Idiomas:** Niveles y descripciones en ambos idiomas.
   - **Visor JSON:** Vista previa en tiempo real del JSON con formateador y botón de copiar.
5. Pulsa **💾 Guardar en disco** (o presiona `Ctrl + S`). Concede permiso de escritura la primera vez que el navegador lo solicite. Los cambios se guardarán directamente en `docs/data/cv.json`.

---

## 📄 Impresión y Exportación a Formato A4

La web pública (`docs/`) incluye una hoja de estilos de impresión de alta precisión (`@media print`):
1. En la web pública, pulsa el botón **Imprimir A4** (o presiona `Ctrl + P`).
2. En el cuadro de diálogo de impresión de tu navegador:
   - **Destino:** *Guardar como PDF* (o tu impresora física).
   - **Páginas:** *Todas*.
   - **Diseño:** *Vertical*.
   - **Tamaño de papel:** *A4*.
   - **Márgenes:** *Predeterminados* o *Ninguno*.
   - **Opciones:** Activa la casilla **«Gráficos de fondo»** y desactiva **«Encabezados y pies de página»**.
3. El documento se generará con un diseño editorial limpio, sin botones ni menús web, adaptado a 2 páginas ejecutivas.

---

## 🌐 Publicación en GitHub Pages

Dado que la web no necesita backend:

1. **Configurar GitHub Pages:**
   - En tu repositorio de GitHub, entra en **Settings → Pages**.
   - En **Source**, selecciona **Deploy from a branch**.
   - En **Branch**, selecciona tu rama (`main` o `WIP`) y la carpeta **/docs**.
   - Pulsa **Save**.
   
2. **Publicar cambios:**
   Cada vez que guardes cambios con el editor local, abre la terminal o el panel de Control de Código de VS Code:
   ```sh
   git add docs/data/cv.json
   git commit -m "Actualizar datos del CV"
   git push
   ```
   En unos segundos, GitHub Pages actualizará tu sitio web en:  
   `https://adriso94yo.github.io/`

---

## 🔒 Privacidad y Seguridad
- La carpeta `editor/` **no** es servida por GitHub Pages porque la fuente de publicación está fijada estrictamente en `/docs`.
- Si el repositorio de GitHub es público, recuerda no incluir en `cv.json` datos sensibles o credenciales privadas.
