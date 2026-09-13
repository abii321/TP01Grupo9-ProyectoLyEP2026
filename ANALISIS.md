# Día 4 - Análisis Final

## 1. Resumen Ejecutivo
El prototipo actual del sistema presenta una arquitectura basada en React (SPA) para la capa de interfaz de usuario, respaldada por una capa de servicios desacoplada que simula la lógica de negocio mediante persistencia en localStorage y consumo de servicios simulados (mock APIs). El sistema cuenta con las funcionalidades principales de gestión de clientes, aunque se identificaron oportunidades de mejora relacionadas con la organización del código, validaciones, manejo de errores y experiencia de usuario. Los hallazgos fueron clasificados según su dimensión e impacto para determinar cuáles requieren atención prioritaria.

---

## 2. Tabla de Hallazgos

| ID | Problema detectado / Hallazgo | Dimensión | Impacto | Solución propuesta |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Dashboard: El botón permanece visible a pesar de que el usuario no ha iniciado sesión (solo está protegido por ruta). | Oportunidad de mejora (UX / Seguridad Frontend) | Medio | Implementar un renderizado condicional en el componente del Navbar o Dashboard que consulte el estado de autenticación actual. Se debe condicionar la visibilidad del botón, asegurando que el elemento solo se dibuje en el DOM cuando el usuario haya iniciado sesión exitosamente. |
| **2** | Formulario de inicio de sesión: Uso de `alert()` nativo ante fallo de autenticación en el servicio. Falta de verificaciones de campos en tiempo real. | Oportunidad de mejora (UX) | Medio | - Eliminar el uso de `alert()` nativo y mostrar mensajes explicativos dentro de la vista.<br>- Implementar validación en tiempo real para los campos.<br>- Controlar el estado del botón de envío cuando los campos estén vacíos o no cumplan las validaciones. |
| **3** | Formulario de inicio de sesión: Ausencia de un botón o ícono para alternar la visibilidad (ver/ocultar) de la contraseña ingresada. | Oportunidad de mejora (UX) | Alto | - Implementar un estado local que controle de forma dinámica el atributo `type` del input, alternando entre `"password"` y `"text"`.<br>- Añadir un botón con un ícono representativo dentro del contenedor del campo de contraseña para permitir al usuario alternar la visibilidad. |
| **4** | Formulario nuevo cliente: No existen validaciones de formato para el campo de número de teléfono. | Oportunidad de mejora (Validación de datos) | Bajo | - Implementar validaciones utilizando una expresión regular (RegEx) orientada a validar patrones de telefonía, mostrando un mensaje de error si el formato ingresado es incorrecto. |
| **5** | Formulario nuevo cliente: Al hacer clic en enviar faltan mensajes específicos de validación sobre qué campos obligatorios no se completaron. | Oportunidad de mejora (UX) | Medio | Añadir validaciones en tiempo real. Incorporar estados de error locales para mostrar mensajes de advertencia personalizados e inline debajo de cada input faltante. |
| **6** | Lista de usuarios: Al crear o eliminar un nuevo usuario, la interfaz no se actualiza de forma reactiva. | Problema (Bug Crítico de Estado) | Alto | Implementar persistencia de estado con `localStorage` y utilizar elevación de estado (pasando una función `onCrear` como prop) para sincronizar la lista reactivamente sin recargar la página. |
| **7** | Búsqueda: No hay mensaje que indique que no se encontró ningún cliente para guiar mejor al usuario. | Oportunidad de mejora (UX) | Bajo | Agregar renderizado condicional en el componente, si el arreglo filtrado resulta vacío tras escribir en el buscador, la tabla se oculta y en su lugar se renderiza un mensaje claro indicando que no se encontraron coincidencias. |
| **8** | Edición de clientes: Falta implementar la funcionalidad completa para editar los datos de un cliente existente. | Deuda técnica | Medio | Agregar un método para actualizar los datos mediante un arreglo base en `localStorage`, en la interfaz, implementar un modo de edición al recibir un ID de usuario y agregar `useEffect` para precargar los datos actuales del cliente en los estados locales. |
| **9** | Diseño de interfaz: Ausencia de un sistema de alternancia entre Modo Oscuro y Modo Claro. | Deuda técnica | Baja | Implementar un `ThemeContext` para manejar el estado global del tema visual (Claro/Oscuro) y persistir la preferencia en `localStorage`. Proveer este contexto a nivel superior de la aplicación y enlazarlo con el soporte nativo de Bootstrap (inyectando dinámicamente el atributo `data-bs-theme="dark"` en la raíz del documento), alternándolo mediante un botón en la barra de navegación. |
| **10** | Código CSS: Existen errores de sintaxis presentes en archivos `.css` del proyecto. | Oportunidad de mejora (UX) | Baja | Analizar los bloques de definición de `.css`, una vez encontradas las inconsistencias, reemplazar por código funcional. |
| **11** | Mantenimiento General del Código: Múltiples archivos del código poseen errores de sintaxis no fatales que comprometen la integridad del sistema. | Oportunidad de mejora | Baja | Realizar un refactoring del código para eliminar imports no utilizados, variables sin referenciar y bloques de código muerto o inalcanzable, asegurando un bundle de producción más limpio y mantenible. |
| **12** | Privacidad de la Interfaz: La ficha de cliente muestra la contraseña del usuario directamente en la pantalla. Práctica profesional inválida por exposición de datos. | UI / Seguridad | Alto | Eliminar la línea de código que expone la contraseña. Si por diseño visual se requiere indicar que el usuario tiene una clave asignada, el componente debe mostrar caracteres ofuscados (por ejemplo: `********`) para proteger la confidencialidad de la información. |
| **13** | Manejo de Estado (React): Los componentes leen directamente del almacenamiento local ignorando el estado global. Esto rompe la actualización automática de la página. | Calidad de Código | Medio | Eliminar la lectura manual del almacenamiento en los componentes de la interfaz. Los componentes visuales deben utilizar el estado global (Contexto de React). De esta forma, el sistema se encarga de actualizar la pantalla automáticamente si hay cambios, garantizando un código más limpio y fácil de mantener. |
| **14** | Dashboard: Contiene código para validar el inicio de sesión que nunca se va a utilizar, ya que la página entera ya está protegida previamente. | Mantenimiento | Medio | Limpiar el archivo `Dashboard.jsx` eliminando toda esa validación condicional que sobra. Eliminar código muerto es una buena práctica profesional que reduce la deuda técnica, facilita la lectura del proyecto a futuros programadores y evita confusiones en el equipo. |
| **15** | Dashboard: Las métricas de cantidad de clientes y personal muestran números fijos y estáticos, no computan la información real del sistema. | Oportunidad de mejora (Lógica de Interfaz) | Alta | Agregar métodos para obtener las métricas reales del sistema, importarlos al dashboard, implementar lógica de llamadas asíncronas y estados locales para métricas, reemplazar los valores estáticos por contadores dinámicos. |
| **16** | Formulario nuevo cliente: Ausencia de campos detallados para la dirección física. | UI / Experiencia de Usuario | Bajo | Ampliar el componente `FormCliente.jsx` incorporando inputs adicionales para los detalles de la dirección, y estructurar el objeto `address` correctamente antes de enviarlo a la API. Se delega al Backlog priorizado para futuras iteraciones, ya que no rompe el flujo principal actual del prototipo. |

---

## 3. Mejoras Seleccionadas por Participante

### **Participante 1 - Orellana Ariana**
* **Mejora seleccionada:** ID 15 - Métricas del dashboard
* **Justificación Técnica:** El Dashboard representa el centro de comando de la aplicación y la principal herramienta de monitoreo para el administrador. Mantener valores numéricos estáticos o escritos en duro en el HTML anula por completo la utilidad de un panel de control, ya que no refleja el volumen real de información del sistema. Al implementar llamadas asíncronas a la capa de servicios y enlazar estos totales utilizando los hooks de estado (`useState`) y ciclo de vida (`useEffect`) de React, los contadores de clientes y personal se computan y renderizan dinámicamente. Esto garantiza que la interfaz reaccione a los datos verídicos provenientes del backend, brindando una radiografía actualizada que restaura la confiabilidad y el valor funcional del sistema.

### **Participante 2 - Cansino Celeste Lujan**
* **Mejora seleccionada:** ID 4, ID 5, ID 6 - Formulario nuevo cliente: validación, alta y baja.
* **Justificación Técnica:** El formulario y la lista de clientes conforman el núcleo interactivo del sistema. Si los campos no cuentan con validaciones de formato (RegEx) ni mensajes de error específicos bajo cada input, se permite el envío de datos corruptos a la base de datos, arruinando la experiencia del usuario al no indicarle qué completó mal. Por otro lado, es indispensable corregir la ruptura de reactividad en la lista: si el estado de React no se sincroniza mediante la memoria local (`localStorage`) de forma automática tras crear o eliminar un cliente, el usuario asume que el sistema falló o no guardó sus cambios, lo que rompe por completo la ilusión de funcionalidad del prototipo.

### **Participante 3 - Terán Luciana Abigail**
* **Mejora seleccionada:** ID 2 — Formulario de Inicio de sesión
* **Justificación Técnica:** El formulario de inicio de sesión constituye el punto de entrada a la aplicación y, por lo tanto, es fundamental para garantizar una interacción clara y fluida desde el primer momento. La utilización de `alert()` para informar errores de autenticación genera una interrupción en la interacción, bloquea momentáneamente la navegación y proporciona una retroalimentación poco integrada con la interfaz. La validación de los campos únicamente al momento del envío dificulta que el usuario identifique y corrija los errores mientras completa el formulario. Por estos motivos, la mejora seleccionada busca optimizar tanto la experiencia de usuario como el comportamiento del formulario, mediante mensajes de error inline, validación en tiempo real y control del estado del botón de envío.

---

## 4. Backlog Priorizado

1. **ID 16:** Formulario nuevo cliente: campos faltantes
2. **ID 12:** Privacidad de la Interfaz: ficha cliente
3. **ID 8:** Edición de Clientes
4. **ID 13:** Manejo de Estado
5. **ID 3:** Formulario inicio sesión: botón mostrar/ocultar contraseña
6. **ID 1:** Botón del dashboard
7. **ID 7:** Búsqueda
8. **ID 14:** Dashboard: código innecesario
9. **ID 11:** Mantenimiento general del código
10. **ID 10:** Código CSS: limpieza
11. **ID 9:** Diseño de interfaz: modo oscuro / claro