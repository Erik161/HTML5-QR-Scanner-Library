// Esperamos a que cargue el DOM
document.addEventListener("DOMContentLoaded", function () {
    // Función que se ejecutará cuando se reconozca correctamente un código QR
    function onScanSuccess(decodedText, decodedResult) {
      console.log(`Código detectado: ${decodedText}`, decodedResult);
      // Mostramos el texto en un  dentro de la página
      document.getElementById("qr-result").textContent = decodedText;
    }

    // Función para manejar errores (cámara bloqueada, permisos, etc.)
    function onScanError(errorMessage) {
      console.warn(`Error en el escaneo: ${errorMessage}`);
    }

    // Inicializamos la instancia de Html5Qrcode.
    // "qr-reader" es el id del contenedor donde se mostrará la cámara
    const html5QrCode = new Html5Qrcode("qr-reader");

    // Configuraciones básicas
    const config = {
      fps: 10, // fotogramas por segundo
      // Se puede ajustar el cuadro de visualización (opcional)
      qrbox: { width: 200, height: 200 },
    };

    // Iniciamos el escaneo con la cámara trasera (en dispositivos compatibles)
    html5QrCode
      .start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
      .catch((err) => {
        console.error("No se pudo iniciar la cámara:", err);
      });

    // Evento para el botón de detener
    document
      .getElementById("stop-scan-button")
      .addEventListener("click", function () {
        html5QrCode
          .stop()
          .then((ignore) => {
            console.log("Escaneo detenido.");
          })
          .catch((err) => {
            console.error("No se pudo detener el escaneo:", err);
          });
      });
  });