// Variable para la instancia de Html5Qrcode
let html5QrCode;

// Estado para saber si estamos escaneando
let isScanning = false;

document.addEventListener("DOMContentLoaded", () => {
  // Instanciamos Html5Qrcode en 'qr-reader'
  html5QrCode = new Html5Qrcode("qr-reader");

  // Referencias a elementos
  const qrReader = document.getElementById("qr-reader");
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  const modal = document.getElementById("myModal");
  const closeModal = document.getElementsByClassName("close")[0];
  const qrLink = document.getElementById("qr-link");

  // Configuración de la librería
  const config = {
    fps: 10,
    qrbox: { width: 200, height: 200 }
  };

  // Función de éxito al detectar un QR
  const onScanSuccess = (decodedText, decodedResult) => {
    console.log("Código detectado:", decodedText);

    // Detenemos el escaneo automáticamente
    stopScan();

    // Asignamos el link al <a>
    qrLink.href = decodedText;
    qrLink.textContent = decodedText;

    // Mostramos el modal
    modal.style.display = "block";
  };

  // Ocurre en cada fotograma que NO se detecta un QR (podemos silenciarlo)
  const onScanError = (errorMessage) => {
    // console.warn("No se detecta QR:", errorMessage);
  };

  // Iniciar escaneo
  const startScan = () => {
    if (isScanning) return; // Si ya estamos escaneando, no hacemos nada

    isScanning = true;

    // Mostramos el contenedor y el botón "Detener"
    qrReader.style.display = "block";
    btnStop.style.display = "inline-block";

    // Ocultamos el botón "Iniciar"
    btnStart.style.display = "none";

    // Llamamos a la librería para iniciar la cámara
    html5QrCode
      .start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
      .then(() => {
        console.log("Cámara iniciada");
      })
      .catch((err) => {
        console.error("No se pudo iniciar la cámara:", err);
        isScanning = false;
      });
  };

  // Detener escaneo
  const stopScan = () => {
    if (!isScanning) return; // Si ya está detenido, no hacemos nada

    html5QrCode
      .stop()
      .then(() => {
        console.log("Escaneo detenido");
        isScanning = false;

        // Ocultamos el contenedor y el botón "Detener"
        qrReader.style.display = "none";
        btnStop.style.display = "none";

        // Mostramos el botón "Iniciar" nuevamente
        btnStart.style.display = "inline-block";
      })
      .catch((err) => {
        console.error("No se pudo detener el escaneo:", err);
      });
  };

  // Reanudar escaneo (cuando cierren el modal)
  const resumeScan = () => {
    if (isScanning) return; // Si ya está escaneando, no lo iniciamos otra vez
    isScanning = true;

    // Mostramos la cámara y el botón "Detener"
    qrReader.style.display = "block";
    btnStop.style.display = "inline-block";

    // Ocultamos el botón "Iniciar"
    btnStart.style.display = "none";

    html5QrCode
      .start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
      .then(() => {
        console.log("Cámara reanudada tras cerrar el modal");
      })
      .catch((err) => {
        console.error("No se pudo reanudar la cámara:", err);
        isScanning = false;
      });
  };

  // Eventos de los botones
  btnStart.addEventListener("click", startScan);
  btnStop.addEventListener("click", stopScan);

  // Eventos del modal
  closeModal.onclick = () => {
    modal.style.display = "none";
    // Al cerrar el modal, reanudamos el escaneo
    resumeScan();
  };

  window.onclick = (event) => {
    // Si el usuario hace clic fuera del modal, también lo cerramos
    if (event.target == modal) {
      modal.style.display = "none";
      resumeScan();
    }
  };
});