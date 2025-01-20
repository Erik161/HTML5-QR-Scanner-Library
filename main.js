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
        const closeModal = document.querySelector(".qr_galeria_close");
        const btnCloseModal = document.getElementById("btn-close-modal");
        const qrLink = document.getElementById("qr-link");

        // Config de la librería
        const config = {
          fps: 10,
          qrbox: { width: 200, height: 200 },
        };

        // Success callback
        const onScanSuccess = (decodedText, decodedResult) => {
          //  Detiene el escaneo
          stopScan();

           // Opcional: 
          // Asigna la URL al modal y lo muestra.
          //qrLink.href = decodedText;
          //qrLink.textContent = decodedText;
          // Mostrar el modal tipo bottom sheet
          //modal.style.display = "block";


        // Redirigir automáticamente a la URL escaneada 
        window.location.href = decodedText;

        };

        // Error callback (cuando no detecta QR en un frame)
        const onScanError = (errorMessage) => {
          // console.log(errorMessage);
        };

        // Iniciar la cámara y el escaneo
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

        // Detener la cámara y el escaneo
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

        // Al hacer clic en la X:
        closeModal.addEventListener("click", () => {
          modal.style.display = "none";
          resumeScan();
        });

        // Al hacer clic en "Close and scan another":
        btnCloseModal.addEventListener("click", () => {
          modal.style.display = "none";
          resumeScan();
        });

        // Cerrar modal si se hace clic en el fondo semitransparente
        window.addEventListener("click", (e) => {
          if (e.target === modal) {
            modal.style.display = "none";
            resumeScan();
          }
        });
      });