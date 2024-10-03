async function cargarComponente(url, id) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const html = await response.text();
        const container = document.getElementById(id);
        if (container) {
            // Remover scripts y estilos existentes del documento
            const existingScripts = Array.from(document.querySelectorAll('script[data-dynamic]'));
            for (const script of existingScripts) {
                script.parentNode.removeChild(script);
            }
            const existingStyles = Array.from(document.querySelectorAll('style[data-dynamic], link[data-dynamic]'));
            for (const style of existingStyles) {
                style.parentNode.removeChild(style);
            }

            container.innerHTML = html;  // Inserta el HTML

            // Procesa los scripts
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

            // Procesa los estilos
            const styles = Array.from(container.querySelectorAll('style, link[rel="stylesheet"]'));
            for (const style of styles) {
                if (style.tagName.toLowerCase() === 'style') {
                    const newStyle = document.createElement('style');
                    newStyle.textContent = style.textContent;
                    newStyle.dataset.dynamic = 'true'; // Marcar estilo como dinámico
                    document.head.appendChild(newStyle);
                    style.parentNode.removeChild(style);
                } else if (style.tagName.toLowerCase() === 'link') {
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.href = style.href;
                    newLink.dataset.dynamic = 'true'; // Marcar link como dinámico
                    document.head.appendChild(newLink);
                    style.parentNode.removeChild(style);
                }
            }
        } else {
            console.error('No se encontró el elemento con el ID:', id);
        }
    } catch (error) {
        console.error('Error al cargar el contenido:', error);
    }
}