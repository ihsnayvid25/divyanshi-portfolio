/* Original architectural illustration. This is a visual concept, not a live AI service. */
(() => {
  'use strict';
  const hero = document.querySelector('#home');
  const scene = document.querySelector('#construction-scene');
  const control = document.querySelector('#build-progress');
  const output = document.querySelector('#build-stage');
  const motionButton = document.querySelector('.scene-motion');
  if (!hero || !scene || !control || !output) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(pointer: fine)');
  const ns = 'http://www.w3.org/2000/svg';
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (start, end, value) => {
    const t = clamp((value - start) / (end - start));
    return t * t * (3 - 2 * t);
  };
  const point = (x, y, z = 0) => [580 + (x - y) * .82, 315 + (x + y) * .28 - z * .8];
  const coords = vertices => vertices.map(vertex => vertex.map(n => n.toFixed(2)).join(',')).join(' ');
  const polygon = (vertices, kind, extra = '') => `<polygon class="${kind}" points="${coords(vertices)}" ${extra}/>`;
  const line = (a, b, kind = 'site-line', extra = '') => `<path class="${kind}" d="M${a.join(',')}L${b.join(',')}" ${extra}/>`;
  const rect = (x, y, width, depth, z = 0) => [point(x, y, z), point(x + width, y, z), point(x + width, y + depth, z), point(x, y + depth, z)];
  const box = (x, y, z, width, depth, height, kind = 'concrete') => {
    const bottom = rect(x, y, width, depth, z);
    const top = rect(x, y, width, depth, z + height);
    return polygon([bottom[1], bottom[2], top[2], top[1]], `${kind} ${kind}-side`) +
      polygon([bottom[2], bottom[3], top[3], top[2]], `${kind} ${kind}-front`) + polygon(top, `${kind} ${kind}-top`);
  };
  const circle = (x, y, radius, kind) => `<circle class="${kind}" cx="${x}" cy="${y}" r="${radius}"/>`;
  const group = (id, content) => `<g id="${id}">${content}</g>`;
  // The tower stands behind the building; only the jib projects over the site.
  const tower = { x: -166, y: -44, height: 260 };

  function worker(x, y, scale = 1, tablet = false, id = '') {
    const [px, py] = point(x, y);
    return `<g ${id ? `id="${id}"` : ''} class="site-worker" transform="translate(${px} ${py}) scale(${scale})">
      <ellipse class="site-shadow" cx="0" cy="2" rx="9" ry="3"/>
      <path class="worker-trousers worker-leg-left" d="M-4-19L-5-2H-1L2-19Z"/>
      <path class="worker-trousers worker-leg-right" d="M1-19L4-2H8L6-19Z"/>
      <path class="worker-shirt" d="M-5-35L4-35L9-20L-7-20Z"/>
      <path class="worker-vest" d="M-3-34L1-24L4-34L7-23H-5Z"/>
      <path class="worker-reflector" d="M-4-27H6M-3-34L-1-21M4-34L3-21"/>
      <path class="worker-skin" d="M-4-30L-10-20L-9-17M7-30L12-23L${tablet ? '5-25' : '10-16'}"/>
      <g class="worker-head"><circle class="worker-face" cx="0" cy="-39" r="4"/>
      <path class="worker-helmet" d="M-6-40a6 6 0 0 1 12 0L7-38H-7Z"/></g>
      ${tablet ? '<path class="worker-tablet" d="M1-29L9-28L8-20L0-21Z"/>' : ''}
    </g>`;
  }

  function cone(x, y) {
    const [px, py] = point(x, y);
    return `<g transform="translate(${px} ${py})"><path class="safety-base" d="M-7 1L0-2L7 1L0 4Z"/><path class="safety-cone" d="M-4 1L0-12L4 1Z"/><path class="safety-stripe" d="M-2-6H2"/></g>`;
  }

  function railing(x1, y1, x2, y2, z = 0, kind = 'safety-rail') {
    let html = line(point(x1, y1, z + 17), point(x2, y2, z + 17), kind);
    html += line(point(x1, y1, z + 9), point(x2, y2, z + 9), kind);
    const segments = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 38));
    for (let i = 0; i <= segments; i++) {
      const x = x1 + (x2 - x1) * i / segments;
      const y = y1 + (y2 - y1) * i / segments;
      html += line(point(x, y, z), point(x, y, z + 19), kind);
    }
    return html;
  }

  function ground() {
    // Extend the quiet survey plane beyond the hero edges, avoiding a cut-off panel.
    let html = polygon(rect(-650, -400, 1750, 1050), 'site-ground');
    for (let x = -588; x <= 1100; x += 82) html += line(point(x, -400), point(x, 650), 'plan-line');
    for (let y = -343; y <= 650; y += 76) html += line(point(-650, y), point(1100, y), 'plan-line');
    html += polygon(rect(-305, 290, 900, 35), 'site-route');
    html += line(point(-280, 306), point(570, 306), 'route-line');
    html += polygon(rect(0, 0, 380, 175), 'foundation-outline');
    // Setting-out strings and ticks follow the actual structural bays.
    html += line(point(0, 245), point(380, 245), 'setting-out');
    for (const x of [0, 92, 184, 276, 380]) {
      html += line(point(x, 235), point(x, 254), 'setting-out');
      html += line(point(x - 4, 241), point(x + 4, 249), 'setting-out');
    }
    html += line(point(-38, 0), point(-38, 175), 'setting-out');
    for (const y of [0, 175]) html += line(point(-47, y), point(-29, y), 'setting-out');
    html += railing(-280, -115, 495, -115, 0, 'site-fence');
    html += railing(495, -115, 495, 238, 0, 'site-fence');
    html += railing(-270, 268, -64, 268, 0, 'site-fence');
    html += railing(42, 268, 495, 268, 0, 'site-fence');
    // Controlled pedestrian route, separate from the plant area.
    html += polygon(rect(422, -50, 31, 287), 'walkway');
    html += line(point(422, -50), point(422, 237), 'walkway-edge');
    html += line(point(453, -50), point(453, 237), 'walkway-edge');
    for (const y of [-42, 20, 83, 146, 230]) html += cone(415, y);
    html += box(-228, -92, 0, 72, 52, 39, 'site-cabin');
    html += polygon([point(-221, -40, 12), point(-193, -40, 12), point(-193, -40, 28), point(-221, -40, 28)], 'cabin-window');
    html += line(point(-181, -40), point(-181, -40, 32), 'cabin-door');
    // Stacked materials in the designated laydown area.
    for (let i = 0; i < 3; i++) html += box(-152 + i * 17, 165, 0, 12, 57, 12, 'material');
    html += box(-195, 180, 0, 29, 40, 22, 'material');
    return html;
  }

  function ghostModel() {
    let html = '';
    for (const z of [8, 64, 120, 176, 232]) {
      html += polygon(rect(0, 0, 380, 175, z), 'model-outline');
    }
    for (const x of [0, 95, 190, 285, 380]) {
      for (const y of [0, 175]) html += line(point(x, y, 8), point(x, y, 232), 'model-outline');
    }
    return html;
  }

  function crane() {
    const { x, y, height } = tower;
    let html = group('crane-footing', box(x - 18, y - 18, 0, 43, 43, 8, 'concrete'));
    html += box(x, y, 8, 10, 10, height, 'crane-mast');
    for (let z = 10; z < height; z += 22) {
      html += line(point(x, y + 10, z), point(x + 10, y + 10, z + 22), 'crane-lattice');
      html += line(point(x + 10, y + 10, z), point(x, y + 10, z + 22), 'crane-lattice');
      html += line(point(x + 10, y, z), point(x + 10, y + 10, z + 22), 'crane-lattice');
      html += line(point(x, y + 10, z), point(x + 10, y + 10, z), 'crane-lattice');
      html += line(point(x + 10, y, z), point(x + 10, y + 10, z), 'crane-lattice');
    }
    let jib = box(x - 95, y - 5, height + 5, 475, 20, 15, 'crane-boom');
    for (let i = -95; i < 380; i += 26) {
      jib += line(point(x + i, y + 15, height + 5), point(x + i + 26, y + 15, height + 20), 'crane-lattice');
      jib += line(point(x + i, y + 15, height + 20), point(x + i + 26, y + 15, height + 5), 'crane-lattice');
    }
    jib += line(point(x + 5, y + 5, height + 40), point(x - 95, y, height + 20), 'crane-cable');
    jib += line(point(x + 5, y + 5, height + 40), point(x + 345, y, height + 20), 'crane-cable');
    jib += line(point(x + 5, y + 5, height + 20), point(x + 5, y + 5, height + 40), 'crane-cable');
    jib += box(x - 81, y - 8, height - 15, 35, 28, 22, 'crane-weight');
    jib += box(x + 13, y - 1, height - 26, 21, 24, 21, 'crane-cab');
    const a = point(x + 19, y + 23, height - 10);
    jib += line(a, point(x + 31, y + 23, height - 10), 'crane-window');
    return { tower: group('crane-tower', html), jib: group('crane-jib', jib) };
  }

  function excavator() {
    const [x, y] = point(-244, 154);
    return `<g id="site-excavator" transform="translate(${x} ${y})">
      <ellipse class="site-shadow" cx="6" cy="4" rx="51" ry="10"/>
      <path class="equipment-track" d="M-31-4L0 5L27-5L23-16L-7-23L-35-13Z"/>
      <path class="equipment-tread" d="M-31-4L0 5L1-5L-33-15M5 3L5-7M11 1L11-9M17-1L17-11M23-3L23-13"/>
      <path class="equipment-body" d="M-29-18L-1-10L20-17L-5-25Z M-29-18V-34L-5-42L-5-25 M-5-42L20-33V-17L-5-25"/>
      <path class="equipment-cab" d="M-15-40V-63L1-68L15-59V-36L0-29Z"/>
      <path class="equipment-window" d="M-11-43V-60L0-63L0-38Z M4-62L11-57V-40L4-37Z"/>
      <g id="excavator-boom"><path class="equipment-arm" d="M13-40L38-89L56-66L69-18L61-15L48-61L38-70L23-35Z"/>
      <path class="equipment-hydraulic" d="M20-47L37-75M51-65L62-26"/>
      <g id="excavator-bucket"><path class="equipment-bucket" d="M59-21L73-25L85-9L73-1L61-7Z"/></g>
      ${circle(18, -40, 3, 'equipment-pivot')}${circle(38, -79, 3, 'equipment-pivot')}${circle(53, -64, 3, 'equipment-pivot')}
    </g></g>`;
  }

  function drone() {
    return `<g id="survey-drone"><path class="drone-arm" d="M-23-7L23 7M-23 7L23-7"/>
      <ellipse class="drone-rotor" cx="-24" cy="-8" rx="13" ry="5"/><ellipse class="drone-rotor" cx="24" cy="8" rx="13" ry="5"/>
      <ellipse class="drone-rotor" cx="-24" cy="8" rx="13" ry="5"/><ellipse class="drone-rotor" cx="24" cy="-8" rx="13" ry="5"/>
      <path class="drone-body" d="M-9-5L0-9L10-4L9 5L0 9L-9 4Z"/>
      <path class="drone-landing" d="M-7 5L-9 14M7 5L9 14M-9 14H-14M9 14H14"/>
      <rect class="drone-camera" x="-4" y="8" width="8" height="6" rx="1"/>
      ${circle(0, 11, 1.5, 'drone-lens')}
    </g>`;
  }

  // Conceptual inspection targets sit on the actual roof and façade, not in empty space.
  const inspectionTargets = [[160, 85, 232], [260, 95, 232], [150, 177, 205], [245, 177, 145]];
  function inspectionOverlay() {
    let grid = polygon(rect(16, 16, 348, 143, 232), 'inspection-grid-line');
    for (const x of [92, 184, 276]) grid += line(point(x, 16, 232), point(x, 159, 232), 'inspection-grid-line');
    for (const y of [64, 112]) grid += line(point(16, y, 232), point(364, y, 232), 'inspection-grid-line');
    grid += polygon([point(16, 177, 120), point(364, 177, 120), point(364, 177, 227), point(16, 177, 227)], 'inspection-grid-line inspection-facade-grid');
    for (const x of [92, 184, 276]) grid += line(point(x, 177, 120), point(x, 177, 227), 'inspection-grid-line inspection-facade-grid');
    grid += line(point(16, 177, 176), point(364, 177, 176), 'inspection-grid-line inspection-facade-grid');
    const markers = inspectionTargets.map((target, index) => {
      const location = point(...target);
      return `<g id="inspection-point-${index + 1}" transform="translate(${location.join(' ')})" opacity="0">${circle(0, 0, 4, 'inspection-halo')}${circle(0, 0, 2, 'inspection-core')}<path class="inspection-reticle" d="M-7-3V-7H-3M3 7H7V3"/></g>`;
    }).join('');
    return group('inspection-grid', grid) + group('inspection-markers', markers);
  }

  const towerCrane = crane();
  // Opaque building faces occlude the rear tower as each storey is assembled.
  scene.innerHTML = group('scene-ground', ground()) + group('scene-crane-tower', towerCrane.tower) +
    group('scene-building', ghostModel() + group('construction-foundation', '') + group('building-frame', '') + group('building-facade', '')) +
    group('scene-crane-jib', towerCrane.jib + group('construction-hoist', '')) +
    group('scene-survey', inspectionOverlay() + group('survey-footprint', '') + group('survey-rays', '') + drone()) +
    group('scene-foreground', excavator() + worker(445, 155, 1, true, 'site-supervisor') + worker(-73, 230, .96, false, 'site-material-worker') + worker(440, 10, .8, false, 'site-path-worker') + cone(-61, 266) + cone(41, 266));

  const foundation = scene.querySelector('#construction-foundation');
  const frame = scene.querySelector('#building-frame');
  const facade = scene.querySelector('#building-facade');
  const hoist = scene.querySelector('#construction-hoist');
  const survey = scene.querySelector('#survey-drone');
  const footprint = scene.querySelector('#survey-footprint');
  const rays = scene.querySelector('#survey-rays');
  const jib = scene.querySelector('#crane-jib');
  const excavatorBody = scene.querySelector('#site-excavator');
  const excavatorBoom = scene.querySelector('#excavator-boom');
  const excavatorBucket = scene.querySelector('#excavator-bucket');
  const supervisorHead = scene.querySelector('#site-supervisor .worker-head');
  const inspectionGrid = scene.querySelector('#inspection-grid');
  const inspectionMarkers = scene.querySelector('#inspection-markers');
  const scanPoints = inspectionTargets.map((target, index) => {
    const element = scene.querySelector('#inspection-point-' + (index + 1));
    return { element, halo: element.querySelector('.inspection-halo'), target };
  });
  // Small translations suggest depth. Crane tower and jib share one depth so they stay attached.
  const depths = [['scene-ground', .25], ['scene-crane-tower', .35], ['scene-building', .65],
    ['scene-crane-jib', .35], ['scene-survey', .65], ['scene-foreground', 1]]
    .map(([id, factor]) => ({ element: scene.querySelector('#' + id), factor }));
  const walkers = ['site-material-worker', 'site-path-worker'].map(id => {
    const element = scene.querySelector('#' + id);
    return { element, left: element.querySelector('.worker-leg-left'), right: element.querySelector('.worker-leg-right'), arms: element.querySelector('.worker-skin') };
  });
  const layers = [];
  for (let level = 0; level < 4; level++) {
    const layer = document.createElementNS(ns, 'g');
    layer.setAttribute('data-floor', String(level + 1));
    frame.appendChild(layer);
    layers.push(layer);
  }
  let value = .62, target = value, last = -1, animation = 0, visible = true;
  let paused = false, elapsed = 0, lastTimestamp = null, lastActorFrame = -Infinity;
  let depthX = 0, depthY = 0, targetDepthX = 0, targetDepthY = 0, lastHoist = '';
  const actorTime = { excavator: 0, crane: 0, drone: 0 };
  const stageName = progress => progress < .12 ? 'Foundation' : progress < .69 ? 'Structure' : progress < .999 ? 'Envelope' : 'Inspection';
  const activityAt = progress => ({
    digging: 1 - smoothstep(.1, .24, progress),
    lifting: smoothstep(.08, .2, progress) * (1 - smoothstep(.82, .94, progress)),
    inspecting: smoothstep(.97, 1, progress)
  });

  function render(progress) {
    last = progress;
    const base = clamp(progress / .1);
    foundation.innerHTML = box(-7, -7, -3, 394, 189, 11 * base, 'foundation');
    for (let i = 0; i < 4; i++) {
      const stage = clamp((progress - .1 - i * .14) / .14);
      const z = 8 + i * 56;
      let html = '';
      if (stage > .001) {
        // Columns grow from each completed slab; the next slab follows them.
        for (const y of [0, 164]) {
          for (const x of [0, 92, 184, 276, 369]) html += box(x, y, z, 11, 11, 51 * stage, 'concrete');
        }
        if (stage > .6) {
          const slabOpacity = clamp((stage - .6) / .4);
          const surface = z + 51 * stage + 5;
          let slab = box(-5, -5, surface - 5, 390, 185, 5, 'slab');
          slab += polygon(rect(8, 8, 364, 159, surface), 'slab-joint');
          for (const x of [92, 184, 276]) slab += line(point(x, 8, surface), point(x, 167, surface), 'slab-joint');
          html += `<g opacity="${slabOpacity.toFixed(3)}">${slab}</g>`;
        }
        if (stage > .88 && progress < .92) {
          html += `<g opacity="${clamp((stage - .88) / .12).toFixed(3)}">${railing(-5, 180, 385, 180, z + 56)}${railing(385, -5, 385, 180, z + 56)}</g>`;
        }
      }
      layers[i].innerHTML = html;
      layers[i].setAttribute('data-built', stage.toFixed(3));
    }
    let glass = '';
    for (let bay = 0; bay < 4; bay++) {
      const amount = clamp((progress - .68 - bay * .055) / .11);
      if (amount <= 0) continue;
      const x = bay * 92 + 11, w = 81;
      let panels = '';
      for (let level = 0; level < 4; level++) {
        const z = 8 + level * 56;
        panels += polygon([point(x, 176, z), point(x + w, 176, z), point(x + w, 176, z + 51), point(x, 176, z + 51)], 'facade-glass');
        for (let mullion = 0; mullion <= 3; mullion++) panels += line(point(x + mullion * w / 3, 176, z), point(x + mullion * w / 3, 176, z + 51), 'facade-mullion');
        panels += line(point(x, 176, z + 16), point(x + w, 176, z + 16), 'facade-detail');
      }
      glass += `<g opacity="${amount.toFixed(3)}">${panels}</g>`;
    }
    const side = clamp((progress - .87) / .13);
    if (side > 0) {
      let panels = '';
      for (let level = 0; level < 4; level++) {
        const z = 8 + level * 56;
        panels += polygon([point(381, 11, z), point(381, 164, z), point(381, 164, z + 51), point(381, 11, z + 51)], 'facade-glass facade-side');
        for (let y = 11; y <= 164; y += 30.6) panels += line(point(381, y, z), point(381, y, z + 51), 'facade-mullion');
        panels += line(point(381, 11, z + 16), point(381, 164, z + 16), 'facade-detail');
      }
      glass += `<g opacity="${side.toFixed(3)}">${panels}</g>`;
    }
    facade.innerHTML = glass;
    drawMotion(elapsed, progress);
    const label = stageName(progress);
    if (output.textContent !== label) output.textContent = label;
    hero.dataset.buildProgress = progress.toFixed(3);
  }

  function drawMotion(time, progress) {
    const activity = activityAt(progress);
    hero.dataset.siteActivity = progress < .2 ? 'groundwork' : progress < .97 ? 'construction' : 'inspection';
    // Project a gentle rotation in plan around the tower, rather than tilting the mast.
    const angle = Math.sin(actorTime.crane * .24) * .16 * activity.lifting;
    const cosine = Math.cos(angle), sine = Math.sin(angle);
    const pivotX = tower.x + 5, pivotY = tower.y + 5;
    const [cx, cy] = point(pivotX, pivotY, tower.height + 10);
    const b = .28 / .82 * sine, c = -.82 / .28 * sine;
    jib.setAttribute('transform', `matrix(${cosine} ${b} ${c} ${cosine} ${cx - cosine * cx - c * cy} ${cy - b * cx - cosine * cy})`);
    const trolley = 255 + Math.sin(actorTime.crane * .32) * 44 * activity.lifting;
    const hookX = pivotX + trolley * cosine, hookY = pivotY + trolley * sine;
    // Pick up, lift to the current working level, release, then return with an empty hook.
    const cycle = (actorTime.crane % 10) / 10;
    const roofHeight = 8 + clamp((progress - .1) / .56) * 224;
    const deliveryHeight = clamp(roofHeight + 24, 46, 244);
    const lift = smoothstep(.1, .6, cycle) * (1 - smoothstep(.82, 1, cycle));
    const workingHeight = 24 + (deliveryHeight - 24) * lift;
    const liftHeight = 244 + (workingHeight - 244) * activity.lifting;
    const start = point(hookX, hookY, tower.height + 5), end = point(hookX, hookY, liftHeight);
    const payloadOpacity = activity.lifting * (1 - smoothstep(.7, .8, cycle));
    const hoistMarkup = line(start, end, 'hoist-cable') +
      `<path class="hoist-hook" d="M${end[0]} ${end[1]}v9q0 7 7 2"/>` +
      `<g class="hoist-payload" opacity="${payloadOpacity.toFixed(3)}">${box(hookX - 14, hookY - 5, liftHeight - 16, 33, 10, 6, 'material')}</g>`;
    if (hoistMarkup !== lastHoist) { hoist.innerHTML = hoistMarkup; lastHoist = hoistMarkup; }
    jib.setAttribute('data-active', String(activity.lifting > .01));

    const excavatorLocation = point(-244 + Math.sin(actorTime.excavator * .2) * 3 * activity.digging, 154);
    excavatorBody.setAttribute('transform', `translate(${excavatorLocation.join(' ')})`);
    excavatorBoom.setAttribute('transform', `rotate(${-5 + Math.sin(actorTime.excavator * .75) * 11 * activity.digging} 18 -40)`);
    excavatorBucket.setAttribute('transform', `rotate(${14 + Math.sin(actorTime.excavator * .75 + .7) * 18 * activity.digging} 62 -20)`);
    excavatorBody.setAttribute('data-active', String(activity.digging > .01));
    supervisorHead.setAttribute('transform', `rotate(${Math.sin(time * .38) * 4} 0 -34)`);
    walkers.forEach((walker, index) => {
      const travel = time * (index ? .17 : .22);
      const moving = Math.abs(Math.cos(travel));
      const step = Math.sin(time * (index ? 3.2 : 3.8)) * 3.5 * moving;
      const location = index ? point(440, 100 + Math.sin(travel) * 98) : point(-87 + Math.sin(travel) * 26, 232);
      walker.element.setAttribute('transform', `translate(${location[0]} ${location[1] - Math.abs(step) * .16}) scale(${index ? .86 : .96})`);
      walker.left.setAttribute('d', `M-4-19L${-5 + step}-2H${-1 + step}L2-19Z`);
      walker.right.setAttribute('d', `M1-19L${4 - step}-2H${8 - step}L6-19Z`);
      walker.arms.setAttribute('d', `M-4-30L-10-20L${-9 - step}-17M7-30L12-23L${10 + step}-16`);
    });
    // The survey starts as the envelope is finished and follows a calm arc over the roof.
    const droneX = 130 + Math.sin(actorTime.drone * .24) * 62;
    const droneY = 45 + Math.cos(actorTime.drone * .24) * 20;
    const location = point(droneX, droneY, 275 + Math.sin(actorTime.drone * .85) * 3);
    survey.setAttribute('transform', `translate(${location[0]} ${location[1]})`);
    const surveyOpacity = activity.inspecting.toFixed(3);
    survey.setAttribute('opacity', surveyOpacity);
    footprint.setAttribute('opacity', surveyOpacity);
    rays.setAttribute('opacity', surveyOpacity);
    survey.setAttribute('data-active', String(activity.inspecting > .01));
    const corners = rect(droneX + 50, 50 + Math.sin(actorTime.drone * .24) * 30, 80, 60, 232);
    // A light scan window projects across the roof and the two upper façade levels.
    footprint.innerHTML = polygon(corners, 'survey-area') +
      polygon([point(droneX + 50, 177, 120), point(droneX + 130, 177, 120), point(droneX + 130, 177, 227), point(droneX + 50, 177, 227)], 'inspection-sweep');
    rays.innerHTML = line([location[0], location[1] + 15], corners[0], 'survey-ray') + line([location[0], location[1] + 15], corners[2], 'survey-ray');
    drawInspection(activity.inspecting, droneX + 90);
  }

  function drawInspection(amount, scanX) {
    const phase = (actorTime.drone % 12) / 12;
    // Reveal the first pass as the building finishes, then fade and return smoothly.
    const pass = 1 - smoothstep(.22, .55, phase) + smoothstep(.9, 1, phase);
    const visibility = motion.matches ? .65 : .12 + .63 * pass;
    inspectionGrid.setAttribute('opacity', (amount * visibility).toFixed(3));
    inspectionMarkers.setAttribute('opacity', amount.toFixed(3));
    scanPoints.forEach(({element, halo, target}, index) => {
      const proximity = 1 - smoothstep(12, 65, Math.abs(target[0] - scanX));
      const signal = motion.matches ? (index === 1 || index === 2 ? .7 : .25) : proximity * (.12 + .88 * pass);
      const ripple = motion.matches ? 0 : (actorTime.drone / 3 + index * .22) % 1;
      element.setAttribute('opacity', signal.toFixed(3));
      halo.setAttribute('r', (4 + ripple * 5).toFixed(2));
      halo.setAttribute('opacity', (.7 * (1 - ripple)).toFixed(3));
    });
  }

  function drawDepth() {
    depths.forEach(({element, factor}) => element.setAttribute('transform', `translate(${(depthX * factor).toFixed(3)} ${(depthY * factor).toFixed(3)})`));
  }
  function resetDepth() {
    depthX = depthY = targetDepthX = targetDepthY = 0;
    drawDepth();
  }
  function actorsRunning() { return !paused && !motion.matches; }
  function wake() {
    hero.dataset.sceneMotion = actorsRunning() && visible && !document.hidden ? 'running' : 'paused';
    if (!animation && visible && !document.hidden && (value !== target || actorsRunning())) animation = requestAnimationFrame(tick);
  }
  function stop() {
    if (animation) cancelAnimationFrame(animation);
    animation = 0;
    lastTimestamp = null;
    hero.dataset.sceneMotion = 'paused';
  }
  // Reuse the model while animating a few moving parts at 24 fps. Stop offscreen.
  function tick(timestamp) {
    animation = 0;
    if (!visible || document.hidden) return;
    const delta = lastTimestamp === null ? 1 / 60 : clamp((timestamp - lastTimestamp) / 1000, 0, .05);
    lastTimestamp = timestamp;
    value += (target - value) * .16;
    if (Math.abs(target - value) < .001) value = target;
    if (actorsRunning()) {
      elapsed += delta;
      const activity = activityAt(value);
      actorTime.excavator += delta * activity.digging;
      actorTime.crane += delta * activity.lifting;
      actorTime.drone += delta * activity.inspecting;
      if (depthX !== targetDepthX || depthY !== targetDepthY) {
        depthX += (targetDepthX - depthX) * .1;
        depthY += (targetDepthY - depthY) * .1;
        if (Math.abs(targetDepthX - depthX) < .005) depthX = targetDepthX;
        if (Math.abs(targetDepthY - depthY) < .005) depthY = targetDepthY;
        drawDepth();
      }
    }
    if (Math.abs(last - value) > .0001) {
      render(value);
      lastActorFrame = timestamp;
    } else if (actorsRunning() && timestamp - lastActorFrame >= 1000 / 24) {
      drawMotion(elapsed, value);
      lastActorFrame = timestamp;
    }
    wake();
  }
  function setProgress(next) {
    target = clamp(next);
    control.value = String(Math.round(target * 100));
    control.setAttribute('aria-valuetext', `${control.value} percent, ${stageName(target).toLowerCase()}`);
    if (motion.matches || paused) {
      value = target;
      render(value);
    } else wake();
  }
  control.setAttribute('aria-valuetext', '62 percent, structure');
  hero.addEventListener('pointermove', event => {
    if (!pointer.matches || motion.matches || paused || event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    targetDepthX = (clamp((event.clientX - bounds.left) / bounds.width) * 2 - 1) * 6;
    targetDepthY = (clamp((event.clientY - bounds.top) / bounds.height) * 2 - 1) * 3.5;
    if (event.target.closest('a, button, input')) { wake(); return; }
    setProgress((event.clientX - bounds.left - bounds.width * .12) / (bounds.width * .76));
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    if (paused || motion.matches) return;
    targetDepthX = targetDepthY = 0;
    wake();
  }, { passive: true });
  pointer.addEventListener('change', () => {
    if (!pointer.matches) resetDepth();
  });
  control.addEventListener('input', () => setProgress(Number(control.value) / 100));
  control.addEventListener('keydown', event => {
    // Let the native range keep its keyboard behavior without the cursor overriding it.
    event.stopPropagation();
  });
  motion.addEventListener('change', () => {
    stop();
    if (motion.matches) resetDepth();
    value = target;
    render(value);
    updateMotionButton();
    wake();
  });
  function updateMotionButton() {
    if (!motionButton) return;
    motionButton.hidden = motion.matches;
    motionButton.textContent = paused ? 'Play motion' : 'Pause motion';
    motionButton.setAttribute('aria-pressed', String(paused));
  }
  if (motionButton) motionButton.addEventListener('click', () => {
    paused = !paused;
    if (paused) {
      stop();
      value = target;
      render(value);
    }
    updateMotionButton();
    wake();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else wake();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) stop();
      else wake();
    }).observe(hero);
  }
  render(value);
  drawDepth();
  updateMotionButton();
  wake();
})();
