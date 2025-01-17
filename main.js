let html5QrCode;
let isScanning = false;

document.addEventListener("DOMContentLoaded", () => {
  // Instanciamos Html5Qrcode
  html5QrCode = new Html5Qrcode("qr-reader");

  // Referencias a elementos
  const qrReader = document.getElementById("qr-reader");
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");

  // Modal
  const modal = document.getElementById("myModal");
  const closeModal = document.querySelector(".close");
  const qrLink = document.getElementById("qr-input");
  const textContentsP = document.querySelector(".text-contents");

  // Config de la librería
  const config = {
    fps: 10,
    qrbox: { width: 200, height: 200 }
  };

  // Success callback
  const onScanSuccess = (decodedText, decodedResult) => {
    // Detenemos el escaneo
    stopScan();

    // Asignamos la URL al link
    qrInput.value = decodedText;
    
    textContentsP.textContent = decodedText;

     // Mostrar el modal
    modal.style.display = "block";
  };

  // Error callback
  const onScanError = (errorMessage) => {
    // No detection en cada frame
    // console.log(errorMessage);
  };

  // Función para iniciar la cámara
  const startScan = () => {
    if (isScanning) return;
    isScanning = true;

    qrReader.style.display = "block";
    btnStop.style.display = "inline-block";
    btnStart.style.display = "none";

    html5QrCode
      .start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
      .catch((err) => {
        console.error("No se pudo iniciar la cámara:", err);
        isScanning = false;
      });
  };

  // Función para detener la cámara
  const stopScan = () => {
    if (!isScanning) return;

    html5QrCode
      .stop()
      .then(() => {
        isScanning = false;
        qrReader.style.display = "none";
        btnStop.style.display = "none";
        btnStart.style.display = "inline-block";
      })
      .catch((err) => {
        console.error("No se pudo detener el escaneo:", err);
      });
  };

  // Reanudar escaneo después de cerrar el modal
  const resumeScan = () => {
    if (isScanning) return; 
    isScanning = true;

    qrReader.style.display = "block";
    btnStop.style.display = "inline-block";
    btnStart.style.display = "none";

    html5QrCode
      .start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
      .then(() => {
        console.log("Cámara reanudada");
      })
      .catch((err) => {
        console.error("No se pudo reanudar la cámara:", err);
        isScanning = false;
      });
  };

  // Eventos de botones
  btnStart.addEventListener("click", startScan);
  btnStop.addEventListener("click", stopScan);

  // Evento de cierre del modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    // Reanudamos el escaneo al cerrar el modal
    resumeScan();
  });

  // Cerrar modal al hacer click en el fondo oscuro
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      resumeScan();
    }
  });
});