// Activamos la memoria interna de n8n para este flujo
const memory = $getWorkflowStaticData('global');
if (!memory.documentos) {
  memory.documentos = [];
}

const data = $input.first().json;

// CASO 1: Viene del nodo "Extract From File" (Tiene el texto del PDF)
if (data.text && data.message && data.message.document) {
  const fileName = data.message.document.file_name;
  const fileContent = data.text;

  // Guardamos el contenido del PDF en la memoria
  memory.documentos.push(`--- ARCHIVO: ${fileName} ---\n${fileContent}\n`);

  // Return status
  return [{ json: { status: "document_stored", fileName: fileName } }];
}

// CASO 2: Es un mensaje de texto normal (La instrucción a Jules)
const instruccion = data.message?.text;

if (instruccion && instruccion !== '/start') {
  // Juntamos el texto de todos los PDFs que guardamos antes
  const contexto = memory.documentos.join('\n');

  // Armamos el "Súper Prompt"
  let promptFinal = instruccion;
  if (contexto !== '') {
    promptFinal = `BASE TEÓRICA Y REQUERIMIENTOS:\n${contexto}\n\nINSTRUCCIÓN A EJECUTAR:\n${instruccion}`;
  }

  // IMPORTANTE: Limpiamos la memoria para que el próximo trabajo empiece de cero
  memory.documentos = [];

  return [{ json: { prompt: promptFinal } }];
}

// Ignorar cualquier otra cosa (comandos, etc)
return [{ json: { ruta: "ignorar" } }];
