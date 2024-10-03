// Función principal: Cargar componente
async function cargarComponente(url, id) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const html = await response.text();
        insertarHTML(id, html);
    } catch (error) {
        console.error('Error al cargar el contenido:', error);
    }
}

// Función para insertar el HTML en el contenedor
function insertarHTML(id, html) {
    const container = document.getElementById(id);
    if (!container) {
        console.error('No se encontró el elemento con el ID:', id);
        return;
    }

    limpiarScriptsYEstilos();
    container.innerHTML = html;  // Inserta el HTML

    procesarScripts(container);
    procesarEstilos(container);
}

// Función para eliminar scripts y estilos existentes
function limpiarScriptsYEstilos() {
    const existingScripts = Array.from(document.querySelectorAll('script[data-dynamic]'));
    for (const script of existingScripts) {
        script.parentNode.removeChild(script);
    }

    const existingStyles = Array.from(document.querySelectorAll('style[data-dynamic], link[data-dynamic]'));
    for (const style of existingStyles) {
        style.parentNode.removeChild(style);
    }
}

// Función para procesar scripts del HTML cargado
function procesarScripts(container) {
    const scripts = Array.from(container.querySelectorAll('script'));
    for (const script of scripts) {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
            newScript.dataset.dynamic = 'true'; // Marcar script como dinámico
        } else {
            newScript.textContent = script.textContent;
            newScript.dataset.dynamic = 'true'; // Marcar script como dinámico
        }
        document.body.appendChild(newScript);
        script.parentNode.removeChild(script);
    }
}

// Función para procesar estilos del HTML cargado
function procesarEstilos(container) {
    const styles = Array.from(container.querySelectorAll('style, link[rel="stylesheet"]'));
    for (const style of styles) {
        if (style.tagName.toLowerCase() === 'style') {
            agregarEstilo(style.textContent);
        } else if (style.tagName.toLowerCase() === 'link') {
            agregarLinkDeEstilo(style.href);
        }
        style.parentNode.removeChild(style);
    }
}

// Función auxiliar para agregar un estilo en línea
function agregarEstilo(textContent) {
    const newStyle = document.createElement('style');
    newStyle.textContent = textContent;
    newStyle.dataset.dynamic = 'true'; // Marcar estilo como dinámico
    document.head.appendChild(newStyle);
}

// Función auxiliar para agregar un enlace a un archivo CSS
function agregarLinkDeEstilo(href) {
    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = href;
    newLink.dataset.dynamic = 'true'; // Marcar link como dinámico
    document.head.appendChild(newLink);
}
