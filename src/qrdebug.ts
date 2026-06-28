chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "position") {
    if (!sender.tab) {
      return;
    }
    getQrDebug(
      sender.tab,
      message.info.left,
      message.info.top,
      message.info.width,
      message.info.height,
      message.info.windowWidth
    );
  }

  // https://stackoverflow.com/a/56483156
  return true;
});

function getQrDebug(
  tab: chrome.tabs.Tab,
  left: number,
  top: number,
  width: number,
  height: number,
  windowWidth: number
) {
  chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
    const qr = new Image();
    qr.src = dataUrl;
    qr.onload = () => {
      const devicePixelRatio = qr.width / windowWidth;
      const captureCanvas = document.createElement("canvas");
      captureCanvas.width = width * devicePixelRatio;
      captureCanvas.height = height * devicePixelRatio;
      const ctx = captureCanvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(
        qr,
        left * devicePixelRatio,
        top * devicePixelRatio,
        width * devicePixelRatio,
        height * devicePixelRatio,
        0,
        0,
        width * devicePixelRatio,
        height * devicePixelRatio
      );
      const url = captureCanvas.toDataURL();
      const infoDom = document.getElementById("info");
      if (infoDom) {
        infoDom.textContent = "";
        const lines = [
          ["b", "Scan Data:"],
          ["text", ""],
          ["text", `Window Inner Width: ${windowWidth}`],
          ["text", `Width: ${width}`],
          ["text", `Height: ${height}`],
          ["text", `Left: ${left}`],
          ["text", `Top: ${top}`],
          ["text", `Screen Width: ${window.screen.width}`],
          ["text", `Screen Height: ${window.screen.height}`],
          ["text", `Capture Width: ${qr.width}`],
          ["text", `Capture Height: ${qr.height}`],
          ["text", `Device Pixel Ratio: ${devicePixelRatio} / ${window.devicePixelRatio}`],
          ["text", `Tab ID: ${tab.id}`],
          ["text", ""],
          ["b", "Captured Screenshot:"],
        ];
        for (const [tag, content] of lines) {
          const el = document.createElement(tag === "b" ? "b" : "span");
          el.textContent = content;
          infoDom.appendChild(el);
          infoDom.appendChild(document.createElement("br"));
        }
      }

      const qrDom = document.getElementById("qr") as HTMLImageElement;
      if (qrDom) {
        qrDom.src = url;
      }
    };
  });
}
