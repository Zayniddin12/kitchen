<script
    setup
    lang="ts"
>
import { onMounted, useTemplateRef } from "vue";
import QRCode from "qrcode";
import { QrCodePropsType } from "@/components/workplaces/qr-code/qr-code.types";

const props = withDefaults(defineProps<QrCodePropsType>(), {
  url: window.location.href,
  size: 120
});

const qrCodeCanvas = useTemplateRef<HTMLCanvasElement>("qrCodeCanvas");

const setQrCodeSize = () => {
  if (!qrCodeCanvas.value) return;
  qrCodeCanvas.value.style.width = `${props.size}px`;
  qrCodeCanvas.value.style.height = `${props.size}px`;
};

const generateQrCode = () => {
  if (!qrCodeCanvas.value) return;


  QRCode.toCanvas(qrCodeCanvas.value, props.url, { errorCorrectionLevel: "H" }).then(() => {
    setQrCodeSize();
  })
      .catch((err: any) => {
        console.error("Failed to generate QR Code:", err);
      });
};

onMounted(() => {
  generateQrCode();
});
</script>

<template>
  <canvas ref="qrCodeCanvas"></canvas>
</template>
