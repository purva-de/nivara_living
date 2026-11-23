const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Clean and prepare the transparent cutouts
async function cleanCutout(name) {
  const inPath = path.join(__dirname, 'Sofas', `${name}_no_bg.png`);
  const img = sharp(inPath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  function setTrans(x, y) {
    if (x >= 0 && x < w && y >= 0 && y < h) {
      data[(y * w + x) * 4 + 3] = 0;
    }
  }

  if (name === 'antalia') {
    // 3-seater left arm braided stitch begins at X=2860
    // Wipe everything to the left of 2860 (2-seater, floor lamp, background)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < 2860; x++) setTrans(x, y);
      for (let x = 5850; x < w; x++) setTrans(x, y);
    }
    // Clean upper left corner above armrest (y < 1860, x < 3050)
    for (let y = 0; y < 1860; y++) {
      for (let x = 2860; x < 3050; x++) setTrans(x, y);
    }
    // Clean carpet patch below left arm (x < 3050, y > 2760)
    for (let y = 2760; y < h; y++) {
      for (let x = 2860; x < 3050; x++) setTrans(x, y);
    }
    // Clean carpet under base rail between front left leg and center leg
    for (let y = 2680; y < h; y++) {
      for (let x = 2945; x < 3600; x++) {
        const railY = 2680 + Math.round((x - 2860) * 0.16);
        if (y > railY) setTrans(x, y);
      }
    }
    // Clean below the right feet
    for (let y = 3175; y < h; y++) {
      for (let x = 0; x < w; x++) setTrans(x, y);
    }
  } else if (name === 'phantom') {
    // Clean below lowest legs
    for (let y = 3532; y < h; y++) {
      for (let x = 0; x < w; x++) setTrans(x, y);
    }
    // Clean floor between legs
    for (let y = 3275; y < 3532; y++) {
      for (let x = 1100; x < 4700; x++) {
        setTrans(x, y);
      }
    }
  } else if (name === 'miranda') {
    // Miranda: solid wood base rail ends at Y=3045.
    for (let y = 3045; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const isFrontLeftLeg = (x >= 850 && x <= 1060 && y <= 3318);
        const isBackLeftLeg = (x >= 1380 && x <= 1530 && y <= 3160);
        const isRightLeg = (x >= 4880 && x <= 5090 && y <= 3318);
        if (!isFrontLeftLeg && !isBackLeftLeg && !isRightLeg) {
          setTrans(x, y);
        }
      }
    }
    for (let y = 3320; y < h; y++) {
      for (let x = 0; x < w; x++) setTrans(x, y);
    }
  } else if (name === 'berlin') {
    // Berlin: clean below bottom foot
    for (let y = 3715; y < h; y++) {
      for (let x = 0; x < w; x++) setTrans(x, y);
    }
  } else if (name === 'arturo') {
    // Arturo: only clean the tiny floor blur under the far right foot
    for (let y = 2870; y < h; y++) {
      for (let x = 5400; x < w; x++) setTrans(x, y);
    }
    for (let y = 2945; y < h; y++) {
      for (let x = 0; x < w; x++) setTrans(x, y);
    }
  } else if (name === 'sierra') {
    // Sierra:
    // Chrome ball feet:
    // Left: 1080-1320 (down to 3335)
    // Center: 2820-2980 (down to 3240)
    // Right: 4600-4850 (down to 3280)
    for (let y = 3135; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const isLeftFoot = (x >= 1050 && x <= 1340 && y <= 3340);
        const isCenterFoot = (x >= 2800 && x <= 3000 && y <= 3250);
        const isRightFoot = (x >= 4600 && x <= 4860 && y <= 3290);
        if (!isLeftFoot && !isCenterFoot && !isRightFoot) {
          setTrans(x, y);
        }
      }
    }
    // Wipe beyond right armrest
    for (let y = 0; y < h; y++) {
      for (let x = 5520; x < w; x++) setTrans(x, y);
    }
    // Wipe upper right shadow behind pillow
    for (let y = 0; y < 2000; y++) {
      for (let x = 5050; x < w; x++) setTrans(x, y);
    }
    // Clean below ball feet
    for (let y = 3340; y < h; y++) {
      for (let x = 0; x < w; x++) setTrans(x, y);
    }
  }

  // Get trimmed bounding box
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      if (data[(y * w + x) * 4 + 3] > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cleanBfp = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX, height: maxY - minY })
    .png()
    .toBuffer();

  return { buffer: cleanBfp, width: maxX - minX, height: maxY - minY };
}

// Generate realistic contact shadows as an SVG overlay (no text, no borders)
function generateShadowSvg(canvasW, canvasH, sofaX, sofaY, sofaW, sofaH, feetPoints = [], ambientList = [], rotatedAmbient = null) {
  let feetSvg = '';
  
  if (feetPoints && feetPoints.length > 0) {
    for (const pt of feetPoints) {
      const fx = sofaX + sofaW * pt.xRatio;
      const fy = sofaY + sofaH + (pt.yOffset || 0);
      const rx = pt.rx || 36;
      const ry = pt.ry || 9;
      feetSvg += `
        <!-- Direct tight contact shadow -->
        <ellipse cx="${fx}" cy="${fy}" rx="${rx}" ry="${ry}" fill="#0a0a0a" opacity="0.68" filter="url(#contactBlur)" />
        <!-- Ambient foot shadow -->
        <ellipse cx="${fx}" cy="${fy + 2}" rx="${rx * 1.5}" ry="${ry * 1.6}" fill="#222222" opacity="0.25" filter="url(#ambientBlur)" />
      `;
    }
  }

  let ambientSvg = '';
  for (const amb of ambientList) {
    const cx = sofaX + sofaW * (amb.xRatio || 0.5);
    const cy = sofaY + sofaH + (amb.yOffset || -6);
    const chassisRx = sofaW * (amb.rxRatio || 0.44);
    const chassisRy = amb.ry || 13;
    ambientSvg += `
      <ellipse cx="${cx}" cy="${cy + 8}" rx="${chassisRx * 1.08}" ry="${chassisRy * 2.2}" fill="#111111" opacity="0.07" filter="url(#softFloorBlur)" />
      <ellipse cx="${cx}" cy="${cy}" rx="${chassisRx}" ry="${chassisRy}" fill="#181818" opacity="0.20" filter="url(#ambientBlur)" />
    `;
  }

  let rotatedSvg = '';
  if (rotatedAmbient) {
    const rcx = sofaX + sofaW * rotatedAmbient.xRatio;
    const rcy = sofaY + sofaH + rotatedAmbient.yOffset;
    const deg = rotatedAmbient.angleDeg || -20;
    const rrx = sofaW * (rotatedAmbient.rxRatio || 0.36);
    const rry = rotatedAmbient.ry || 13;
    rotatedSvg = `
      <g transform="rotate(${deg} ${rcx} ${rcy})">
        <ellipse cx="${rcx}" cy="${rcy + 8}" rx="${rrx * 1.08}" ry="${rry * 2.2}" fill="#111111" opacity="0.07" filter="url(#softFloorBlur)" />
        <ellipse cx="${rcx}" cy="${rcy}" rx="${rrx}" ry="${rry}" fill="#181818" opacity="0.20" filter="url(#ambientBlur)" />
      </g>
    `;
  }

  const svg = `
  <svg width="${canvasW}" height="${canvasH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="contactBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
      <filter id="ambientBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <filter id="softFloorBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="22" />
      </filter>
    </defs>
    <!-- Diffuse ambient chassis shadows -->
    ${ambientSvg}
    ${rotatedSvg}
    <!-- Foot contact points -->
    ${feetSvg}
  </svg>
  `;
  return Buffer.from(svg);
}

async function renderCard(config) {
  const { name, cutoutData, outFile, feet, ambientList, rotatedAmbient, maxW = 1200, maxH = 750, zoomFocus = null } = config;
  const canvasW = 1400;
  const canvasH = 1400;

  let sofaBuffer = cutoutData.buffer;
  let sofaW = cutoutData.width;
  let sofaH = cutoutData.height;

  let drawW, drawH, drawX, drawY;

  if (zoomFocus) {
    // Hover detail: zoomed macro view of craftsmanship (pure image, no text)
    const cropSize = Math.floor(Math.min(sofaW, sofaH) * 0.58);
    const cropX = Math.floor((sofaW - cropSize) * zoomFocus.x);
    const cropY = Math.floor((sofaH - cropSize) * zoomFocus.y);

    const cropped = await sharp(sofaBuffer)
      .extract({ left: cropX, top: cropY, width: cropSize, height: cropSize })
      .resize(1080, 1080, { fit: 'cover' })
      .png()
      .toBuffer();

    drawW = 1080;
    drawH = 1080;
    drawX = Math.floor((canvasW - drawW) / 2);
    drawY = Math.floor((canvasH - drawH) / 2);

    await sharp({
      create: {
        width: canvasW,
        height: canvasH,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    })
      .composite([
        { input: cropped, left: drawX, top: drawY }
      ])
      .jpeg({ quality: 94 })
      .toFile(outFile);

    console.log(`Saved pure detail card: ${outFile}`);
    return;
  }

  // Normal Card: Perfectly centered sofa with grounded realistic shadows
  const scale = Math.min(maxW / sofaW, maxH / sofaH);
  drawW = Math.round(sofaW * scale);
  drawH = Math.round(sofaH * scale);
  drawX = Math.round((canvasW - drawW) / 2);
  drawY = Math.round((canvasH - drawH) / 2) + 20;

  const resizedSofa = await sharp(sofaBuffer)
    .resize(drawW, drawH, { fit: 'inside' })
    .png()
    .toBuffer();

  const shadowSvg = generateShadowSvg(canvasW, canvasH, drawX, drawY, drawW, drawH, feet, ambientList, rotatedAmbient);

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
    .composite([
      { input: shadowSvg, left: 0, top: 0 },
      { input: resizedSofa, left: drawX, top: drawY }
    ])
    .jpeg({ quality: 94 })
    .toFile(outFile);

  console.log(`Saved pure main card: ${outFile}`);
}

async function buildAll() {
  const configs = [
    {
      name: 'antalia',
      feet: [
        { xRatio: 0.015, rx: 28, ry: 8, yOffset: -58 }, // front left leg under arm
        { xRatio: 0.38, rx: 26, ry: 8, yOffset: -85 },  // center support leg
        { xRatio: 0.88, rx: 32, ry: 9, yOffset: -10 }   // right corner foot
      ],
      ambientList: [
        { xRatio: 0.52, yOffset: -15, rxRatio: 0.44, ry: 13 }
      ],
      zoomFocus: { x: 0.88, y: 0.45 }
    },
    {
      name: 'phantom',
      feet: [
        { xRatio: 0.045, rx: 28, ry: 8, yOffset: -3 },
        { xRatio: 0.965, rx: 28, ry: 8, yOffset: -3 }
      ],
      ambientList: [
        { xRatio: 0.50, yOffset: -5, rxRatio: 0.44, ry: 13 }
      ],
      zoomFocus: { x: 0.78, y: 0.28 }
    },
    {
      name: 'miranda',
      feet: [
        { xRatio: 0.05, rx: 28, ry: 8, yOffset: -2 },  // front left leg
        { xRatio: 0.17, rx: 22, ry: 6, yOffset: -38 }, // back left leg
        { xRatio: 0.95, rx: 28, ry: 8, yOffset: -2 }   // right leg
      ],
      ambientList: [
        { xRatio: 0.50, yOffset: -6, rxRatio: 0.43, ry: 12 }
      ],
      zoomFocus: { x: 0.18, y: 0.65 }
    },
    {
      name: 'berlin',
      feet: [
        { xRatio: 0.20, rx: 34, ry: 10, yOffset: -15 } // lowest front left foot
      ],
      ambientList: [],
      rotatedAmbient: {
        xRatio: 0.51,
        yOffset: -125,
        angleDeg: -20.2,
        rxRatio: 0.36,
        ry: 13
      },
      zoomFocus: { x: 0.18, y: 0.38 }
    },
    {
      name: 'arturo',
      feet: [
        { xRatio: 0.22, rx: 32, ry: 9, yOffset: -2 },  // chaise foot
        { xRatio: 0.63, rx: 26, ry: 8, yOffset: -45 }, // center leg
        { xRatio: 0.91, rx: 28, ry: 8, yOffset: -18 }  // right leg
      ],
      ambientList: [
        { xRatio: 0.35, yOffset: -10, rxRatio: 0.24, ry: 12 },
        { xRatio: 0.75, yOffset: -28, rxRatio: 0.25, ry: 12 }
      ],
      zoomFocus: { x: 0.85, y: 0.40 }
    },
    {
      name: 'sierra',
      feet: [
        { xRatio: 0.17, rx: 30, ry: 8, yOffset: -2 },  // left sphere foot
        { xRatio: 0.50, rx: 26, ry: 7, yOffset: -22 }, // center sphere foot
        { xRatio: 0.82, rx: 28, ry: 8, yOffset: -12 }  // right sphere foot
      ],
      ambientList: [
        { xRatio: 0.50, yOffset: -15, rxRatio: 0.42, ry: 13 }
      ],
      zoomFocus: { x: 0.15, y: 0.75 }
    }
  ];

  const outDir = path.join(__dirname, 'catalog_images');

  for (const cfg of configs) {
    console.log(`Processing clean product card: ${cfg.name}...`);
    const cutoutData = await cleanCutout(cfg.name);
    
    // Pure Main card (no burned-in text)
    await renderCard({
      name: cfg.name,
      cutoutData,
      outFile: path.join(outDir, `${cfg.name}_sofa.jpg`),
      feet: cfg.feet,
      ambientList: cfg.ambientList,
      rotatedAmbient: cfg.rotatedAmbient
    });

    // Pure Detail hover card (no burned-in text)
    await renderCard({
      name: cfg.name,
      cutoutData,
      outFile: path.join(outDir, `${cfg.name}_sofa_detail.jpg`),
      zoomFocus: cfg.zoomFocus
    });
  }

  console.log('All 6 pure sofa product cards successfully rendered without any text or borders!');
}

buildAll().catch(console.error);
