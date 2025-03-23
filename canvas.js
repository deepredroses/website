document.addEventListener('DOMContentLoaded', function() {
  /* ----- Y-Generator Code (Overlay) ----- */
  const yCanvas = document.getElementById("yCanvas");
  if (yCanvas) {
    const yCtx = yCanvas.getContext("2d");
    const center = { x: yCanvas.width / 2, y: yCanvas.height / 2 };
    const lineLength = 150;
    // Calculate randomized gaps ensuring a minimum 90° gap per section
    let extra1 = Math.random() * 90;
    let extra2 = Math.random() * 90;
    let sumExtra = extra1 + extra2;
    if (sumExtra > 90) {
      const scale = 90 / sumExtra;
      extra1 *= scale;
      extra2 *= scale;
      sumExtra = extra1 + extra2;
    }
    const extra3 = 90 - sumExtra;
    const gap1 = 90 + extra1;
    const gap2 = 90 + extra2;
    const gap3 = 90 + extra3; // Total gap equals 360°
    // Choose a random starting angle and compute subsequent angles
    const startAngle = Math.random() * 360;
    const angles = [
      startAngle,
      startAngle + gap1,
      startAngle + gap1 + gap2
    ].map(a => a % 360);
    yCtx.lineWidth = 4;
    yCtx.strokeStyle = "#333";
    angles.forEach(angle => {
      const rad = angle * Math.PI / 180;
      yCtx.beginPath();
      yCtx.moveTo(center.x, center.y);
      yCtx.lineTo(center.x + Math.cos(rad) * lineLength,
                  center.y + Math.sin(rad) * lineLength);
      yCtx.stroke();
    });
    // Draw center point
    yCtx.fillStyle = "red";
    yCtx.beginPath();
    yCtx.arc(center.x, center.y, 4, 0, Math.PI * 2);
    yCtx.fill();
    console.log("Y-Generator gaps:", gap1.toFixed(2), gap2.toFixed(2), gap3.toFixed(2));
  }

  /* ----- Free Drawing Canvas Code ----- */
  const canvas = document.getElementById("drawingCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    let paths = [];       // Stores completed paths for undo functionality
    let currentPath = []; // Stores the current drawing path

    canvas.addEventListener("mousedown", () => {
      isDrawing = true;
      currentPath = [];
    });
    canvas.addEventListener("mouseup", () => {
      isDrawing = false;
      if (currentPath.length > 0) {
        paths.push(currentPath);
      }
    });
    canvas.addEventListener("mousemove", draw);
    // Undo last path on Ctrl+Z
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "z") {
        undo();
      }
    });

    function draw(event) {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      currentPath.push({ x, y });
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      // Clear and redraw all paths
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawPaths();
      // Draw the current path
      if (currentPath.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentPath[0].x, currentPath[0].y);
        currentPath.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      }
    }

    function redrawPaths() {
      paths.forEach(path => {
        if (path.length > 0) {
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          path.forEach(point => ctx.lineTo(point.x, point.y));
          ctx.stroke();
        }
      });
    }

    function undo() {
      if (paths.length > 0) {
        paths.pop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redrawPaths();
      }
    }
  }
});
