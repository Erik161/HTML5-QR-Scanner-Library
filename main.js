 // Referencia a la instancia Html5Qrcode
 let html5QrCode;

 // Esperamos a que se cargue el DOM
 document.addEventListener("DOMContentLoaded", () => {
   // Instanciamos Html5Qrcode en el DIV 'qr-reader'
   html5QrCode = new Html5Qrcode("qr-reader");

   // Elementos del DOM
   const btnStart = document.getElementById("btn-start");
   const btnStop = document.getElementById("btn-stop");
   const qrReader = document.getElementById("qr-reader");

   // Modal
   const modal = document.getElementById("myModal");
   const closeModal = document.getElementsByClassName("close")[0];
   const qrLink = document.getElementById("qr-link");

   // Config
   const config = {
     fps: 10,  // frames por segundo
     qrbox: { width: 200, height: 200 }
   };

   // Callbacks de la librería
   const onScanSuccess = (decodedText, decodedResult) => {
     console.log("Código detectado: ", decodedText);

     // Asignamos el link al <a>
     qrLink.href = decodedText;
     qrLink.textContent = decodedText;

     // Mostramos el modal
     modal.style.display = "block";

     // (Opcional) Detener la cámara después de detectar:
     // stopScan();
   };

   const onScanError = (errorMessage) => {
     // Ojo: se ejecuta en cada frame que no encuentra un QR
     // console.warn("Error en el escaneo: ", errorMessage);
   };

   // Inicia la cámara y el escaneo
   const startScan = () => {
     // Mostramos el contenedor y el botón "Detener"
     qrReader.style.display = "block";
     btnStop.style.display = "inline-block";

     html5QrCode
       .start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
       .then(() => {
         console.log("Cámara iniciada correctamente");
       })
       .catch((err) => {
         console.error("No se pudo iniciar la cámara:", err);
       });
   };

   // Detiene la cámara y el escaneo
   const stopScan = () => {
     html5QrCode
       .stop()
       .then(() => {
         console.log("Escaneo detenido");
         // Ocultamos el contenedor y el botón "Detener"
         qrReader.style.display = "none";
         btnStop.style.display = "none";
       })
       .catch((err) => {
         console.error("No se pudo detener el escaneo:", err);
       });
   };

   // Eventos de botón
   btnStart.addEventListener("click", startScan);
   btnStop.addEventListener("click", stopScan);

   // Eventos de modal
   closeModal.onclick = () => {
     modal.style.display = "none";
   };
   window.onclick = (event) => {
     if (event.target == modal) {
       modal.style.display = "none";
     }
   };
 });