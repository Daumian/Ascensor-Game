const modos = { HABLAR: 'hablar', MOVER: 'mover', INTERACTUAR: 'interactuar' };
let modoActual = modos.MOVER;
const botonesModo = {
  hablar: document.getElementById('btnHablar'),
  mover: document.getElementById('btnMover'),
  interactuar: document.getElementById('btnInteractuar')
};
Object.entries(botonesModo).forEach(([modo, btn]) => {
  btn.onclick = () => {
    modoActual = modo;
    Object.values(botonesModo).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };
});
botonesModo.mover.classList.add('active');

const pisos = {
  1: { descripcion: "Piso 1 - Bosque tranquilo", objetos: [ {id: "coco", nombre: "Coco", tipo: "objeto"}, {id: "megaBlaster", nombre: "Mega Blaster", tipo: "objeto"} ], personas: [ {id: "cientifica", nombre: "Científica", tipo: "persona", png: "https://i.imgur.com/ZlKk6Ej.png"} ] }
};
let personasAscensor = [];
let pisoActual = 1;
const LIMITE_ASCENSOR = 5;
const personasAscensorDiv = document.getElementById("personasAscensor");
const descripcionPisoDiv = document.getElementById("descripcionPiso");
const objetosPisoDiv = document.getElementById("objetosPiso");
const historialDiv = document.getElementById("historial");
const inputPiso = document.getElementById("inputPiso");
const btnIrPiso = document.getElementById("btnIrPiso");

btnIrPiso.onclick = () => {
  const np = parseInt(inputPiso.value);
  if (isNaN(np) || np < 1) return alert("Ingresa un piso válido.");
  pisoActual = np;
  if (!pisos[pisoActual]) pisos[pisoActual] = { descripcion: `Piso ${pisoActual} (vacío)`, objetos: [], personas: [] };
  actualizarPiso();
};

function actualizarAscensor() {
  personasAscensorDiv.innerHTML = "";
  personasAscensor.forEach(item => {
    const div = document.createElement("div");
    div.className = "persona";
    div.style.backgroundImage = item.png ? `url(${item.png})` : "none";
    div.textContent = item.png ? "" : item.nombre;
    div.title = item.nombre;
    div.onclick = () => manejarClick(item, 'ascensor');
    personasAscensorDiv.appendChild(div);
  });
}

function actualizarPiso() {
  const piso = pisos[pisoActual];
  descripcionPisoDiv.textContent = piso.descripcion;
  objetosPisoDiv.innerHTML = "";
  [...piso.objetos, ...piso.personas].forEach(elem => {
    const div = document.createElement("div");
    div.className = "persona";
    div.style.backgroundImage = elem.png ? `url(${elem.png})` : "none";
    div.textContent = elem.png ? "" : elem.nombre;
    div.title = elem.nombre;
    div.onclick = () => manejarClick(elem, 'piso');
    objetosPisoDiv.appendChild(div);
  });
}

function manejarClick(elem, origen) {
  switch (modoActual) {
    case modos.HABLAR:
      agregarMensaje(`🗣️ Hablaste con ${elem.nombre}.`);
      break;
    case modos.MOVER:
      if (origen === 'piso') subirElemento(elem.id, elem.tipo);
      else bajarElemento(elem.id);
      break;
    case modos.INTERACTUAR:
      agregarMensaje(`✨ Interactuaste con ${elem.nombre}.`);
      break;
  }
}

function subirElemento(id, tipo) {
  if (personasAscensor.length >= LIMITE_ASCENSOR) return alert("Capacidad máxima alcanzada: 5 elementos.");
  const col = tipo === 'persona' ? pisos[pisoActual].personas : pisos[pisoActual].objetos;
  const idx = col.findIndex(e => e.id === id);
  if (idx === -1) return;
  const elem = col.splice(idx,1)[0];
  personasAscensor.push(elem);
  actualizarAscensor(); actualizarPiso();
  agregarMensaje(`⬆️ ${elem.nombre} subió al ascensor.`);
}

function bajarElemento(id) {
  const idx = personasAscensor.findIndex(e => e.id === id);
  if (idx === -1) return;
  const elem = personasAscensor.splice(idx,1)[0];
  if (elem.tipo === 'persona') pisos[pisoActual].personas.push(elem);
  else pisos[pisoActual].objetos.unshift(elem);
  actualizarAscensor(); actualizarPiso();
  agregarMensaje(`⬇️ ${elem.nombre} salió del ascensor.`);
}

function agregarMensaje(texto) {
  const msg = document.createElement("div"); msg.className = "mensaje";
  const p = document.createElement("p"); p.textContent = texto; msg.appendChild(p);
  const hora = document.createElement("span"); hora.className = "hora";
  const now = new Date(); hora.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  msg.appendChild(hora);
  historialDiv.appendChild(msg);
  // Siempre mover scroll al último mensaje
  historialDiv.scrollTop = historialDiv.scrollHeight;
}

actualizarAscensor(); actualizarPiso();
