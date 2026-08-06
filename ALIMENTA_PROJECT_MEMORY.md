# Memoria técnica y funcional — Demo Alimenta Casinos

## Propósito de este documento

Este archivo concentra el conocimiento necesario para entender, mantener o reutilizar la demo sin depender de la conversación en la que fue creada. La raíz real del proyecto Next.js y del repositorio Git es esta carpeta (`/app`).

Las afirmaciones sobre comportamiento están comprobadas contra el código actual. Las decisiones comerciales y de alcance que no son deducibles solo desde el código provienen de `../plandemo.md` y `IMPLEMENTATION_PLAN.md`. Cuando se describe una posible implementación de producción, se identifica expresamente como recomendación y no como funcionalidad existente.

---

# 1. Qué es este proyecto

## Objetivo

Es una demo comercial navegable para **Alimenta Casinos**, operador del casino escolar del **Colegio Curimón, Chile**. El contacto comercial indicado en el plan original es **Ignacio** y, al momento de definir la demo, aún no había comprado el desarrollo definitivo.

Su objetivo es mostrar en pocos minutos cómo reemplazar un proceso manual:

1. El apoderado revisa el menú.
2. Transfiere dinero.
3. Envía el comprobante con alumno, curso y fecha.
4. El casino revisa y transcribe la información a una lista.
5. Durante el servicio busca al alumno y marca manualmente la entrega.

La propuesta demostrada es:

> Seleccionar estudiante → seleccionar días → pagar → aparecer automáticamente en Entregas → buscar estudiante → confirmar entrega.

La demo debía ayudar al cliente a evaluar la idea y permitir una cotización posterior. No fue diseñada como producto terminado.

## Modelo de casino representado

El servicio se modela como **buffet**:

- el apoderado compra acceso al almuerzo de un día;
- ve las preparaciones disponibles, pero no elige un plato;
- cocina necesita principalmente conocer el número de personas;
- no existen recetas, inventario, cantidades por preparación ni personalización de platos.

## Qué funciona realmente dentro de la demo

- Selección encadenada de ciclo, curso y estudiante.
- Navegación entre dos semanas precargadas.
- Selección y eliminación de días.
- Cálculo de subtotal, créditos y total.
- Pago simulado con estado de carga.
- Creación local de pedidos y reservas.
- Aparición inmediata de las reservas en el panel.
- Búsqueda y filtros de entregas.
- Confirmación de entrega y registro de hora.
- Bloqueo visual de doble entrega.
- Modos abierto, cerrado y automático para el horario de entrega.
- Anulación de reservas futuras y generación de créditos.
- Aplicación automática de créditos en una compra posterior.
- Edición y publicación local de menús.
- Edición local de precios y horarios.
- Persistencia en `localStorage`.
- Restauración del estado inicial.

## Qué es únicamente mock o demostrativo

- Todos los estudiantes, apoderados, menús, pedidos y reservas.
- El colegio, fechas operativas y métricas.
- El pago y su confirmación.
- El estado “pago confirmado”; no existe una transacción bancaria.
- Las estadísticas y parte de la planificación de cocina.
- La autenticación: todas las rutas son públicas.
- El control de horario, que puede forzarse manualmente.
- Los botones de carga de menú e importación de alumnos.
- El backend, base de datos, concurrencia, auditoría e integraciones: no existen.
- Correos, WhatsApp, notificaciones, exportaciones y carga de archivos: no existen.

---

# 2. Flujo completo del apoderado

## 2.1 Entrada y elección de experiencia

**Ruta:** `/`  
**Archivo:** `src/app/page.tsx`

La portada permite elegir entre:

- **Familias y apoderados**, que navega a `/apoderado`.
- **Equipo Alimenta**, que navega a `/panel`.

También ofrece un acceso separado a `/anular`. La pantalla declara de forma visible que es una demo con datos ficticios y sin cobros reales. Si se selecciona el panel, aparece una explicación de que la solución definitiva puede ajustar módulos y reglas.

Componentes compartidos utilizados:

- `Brand` y `DemoBadge` desde `src/components/brand.tsx`.
- `useRouter` de Next.js para continuar al perfil seleccionado.

## 2.2 Selección de estudiante

**Ruta:** `/apoderado`  
**Archivo:** `src/app/apoderado/page.tsx`  
**Shell:** `src/components/portal-shell.tsx`, paso 1.

Secuencia:

1. El selector de ciclo parte habilitado.
2. Al elegir un ciclo se habilita el curso y se limpian curso/alumno anteriores.
3. Al elegir un curso se habilita el alumno y se limpia el alumno anterior.
4. Los estudiantes se filtran por curso.
5. Al elegir un alumno aparece un resumen con nombre, curso, ciclo y precio por almuerzo.
6. El botón de continuación se habilita.
7. `selectStudent(studentId)` guarda el alumno en el store, limpia fechas y última compra.
8. Se navega a `/apoderado/semana`.

El botón **“Completar con Tomás para la demo”** selecciona al alumno especial `student-31`, definido como `demoStudentId`.

## 2.3 Selección de semana y días

**Ruta:** `/apoderado/semana`  
**Archivo:** `src/app/apoderado/semana/page.tsx`  
**Shell:** `PortalShell`, paso 2.  
**Protección de flujo:** `FlowGuard` si no hay estudiante.

Comportamiento:

1. Lee del store el estudiante, semana, días, reservas, créditos, menús y configuración.
2. Permite navegar entre las dos semanas mock.
3. Cambiar de semana limpia la selección de días.
4. Cada día muestra fecha, preparaciones del buffet, acompañamientos, incluidos y precio.
5. `toggleDate` agrega o quita la fecha y mantiene las fechas ordenadas.
6. Si ya existe una reserva no anulada para el alumno y fecha, el botón queda deshabilitado como **“Reservado”**.
7. El resumen lateral calcula:
   - cantidad de almuerzos;
   - subtotal;
   - créditos aplicables;
   - descuento equivalente;
   - total.
8. Los créditos se previsualizan automáticamente; no existe selección manual de cuáles usar.
9. Con al menos un día seleccionado se habilita el enlace a `/apoderado/pago`.

La interfaz no implementa actualmente los estados “día pasado” ni “día sin servicio”, aunque `MenuDay` posee el campo `service`. Todos los días mock tienen `service: true`.

## 2.4 Revisión y pago

**Ruta:** `/apoderado/pago`  
**Archivo:** `src/app/apoderado/pago/page.tsx`  
**Shell:** `PortalShell`, paso 3.

Si falta estudiante o no hay días seleccionados, `FlowGuard` devuelve al inicio del flujo.

La página presenta:

- alumno y curso;
- fechas reservadas;
- precio unitario;
- subtotal;
- créditos aplicados;
- total;
- declaración expresa de que no se pedirán datos bancarios.

Al confirmar:

1. `processing` bloquea una segunda pulsación.
2. El botón cambia a estado de carga.
3. Un `setTimeout` espera 1.100 ms.
4. `confirmPurchase(student.id, unitPrice)` crea el pedido y sus reservas en memoria.
5. Se navega a `/apoderado/confirmacion`.

Si el total es cero, el botón dice **“Confirmar con créditos”**; de lo contrario simula pagar el total.

## 2.5 Confirmación

**Ruta:** `/apoderado/confirmacion`  
**Archivo:** `src/app/apoderado/confirmacion/page.tsx`  
**Shell:** `PortalShell`, paso 4.

La página busca `lastOrderId` en el store. Si no encuentra una compra reciente, muestra `FlowGuard`.

Con una compra válida muestra:

- confirmación visual;
- estudiante y curso;
- total pagado o total cubierto;
- créditos utilizados;
- fechas reservadas;
- enlace a `/panel/entregas`;
- enlace de regreso al inicio.

La conexión con Entregas es local pero funcional: las nuevas reservas comparten el mismo store y aparecen inmediatamente en el día correspondiente.

---

# 3. Flujo del casino y panel administrativo

## Layout y navegación

**Ruta base:** `/panel`  
**Archivos:** `src/app/panel/layout.tsx` y `src/components/panel-shell.tsx`.

El panel tiene:

- sidebar fija desde `lg`;
- drawer en móvil/tablet;
- estado activo según `usePathname`;
- navegación a Resumen, Entregas, Pedidos, Menú semanal, Alumnos, Estadísticas y Configuración;
- identidad Alimenta y texto fijo “Colegio Curimón”;
- aviso permanente de “Propuesta navegable”.

## 3.1 Resumen

**Ruta:** `/panel`  
**Archivo:** `src/app/panel/page.tsx`

Usa la fecha operacional fija `2026-08-04`.

Muestra:

- reservas del día no anuladas;
- entregadas;
- pendientes;
- ventas estimadas usando el precio actual del ciclo;
- planificación de próximos días;
- últimas tres entregas;
- compra más reciente.

Parte de la planificación es hardcodeada. Solo algunos valores reaccionan al store. La tarjeta “Ventas hoy” no suma pagos reales: multiplica cada reserva por el precio actual del ciclo.

## 3.2 Entregas

**Ruta:** `/panel/entregas`  
**Archivo:** `src/app/panel/entregas/page.tsx`

Es la pantalla operativa principal.

### Día y métricas

- Parte en `2026-08-04`.
- Los días navegables provienen de todas las fechas de `menus`.
- Solo considera reservas de la fecha que no tengan `cancelledAt`.
- Calcula reservados, entregados y pendientes en tiempo real.

### Búsqueda y filtros

- Búsqueda inmediata por nombre o curso.
- `matchesSearch` elimina tildes, ignora mayúsculas/minúsculas y compara prefijos por palabra.
- Por eso búsquedas abreviadas como `tom gon` encuentran “Tomás González”.
- Estado: Pendientes, Entregados o Todos; Pendientes es el valor inicial.
- Ciclo.
- Curso dependiente del ciclo.

### Listado

Las entregas aparecen como filas con columnas en escritorio y una versión compacta en móvil. Cada fila incluye:

- alumno;
- curso;
- menú del día;
- estado;
- hora, si fue entregado;
- acción Entregar, si sigue pendiente.

Solo aparecen alumnos que tienen una reserva local no anulada para el día.

### Confirmación de entrega

1. El botón Entregar abre un modal.
2. El modal confirma alumno y curso.
3. `confirmDelivery(reservationId)` registra `new Date().toISOString()`.
4. La reserva cambia a entregada.
5. Las métricas se recalculan.
6. Con filtro Pendientes, desaparece inmediatamente.
7. Aparece un toast durante 3,2 segundos.

El modal se puede cerrar con Escape.

### Prevención de doble entrega

La UI no muestra botón para una reserva que ya tiene `deliveredAt`, por lo que el usuario normal no puede confirmarla dos veces. Sin embargo, el reducer no rechaza explícitamente una segunda acción `deliver`; la protección no es transaccional ni apta para concurrencia. Producción necesitaría validación atómica en backend.

### Horario

`scheduleOpen` depende de:

- `abierto`: siempre permite entregar;
- `cerrado`: siempre bloquea;
- `automatico`: compara la hora de Santiago con `scheduleStart` y `scheduleEnd`.

Fuera de horario se mantiene consulta, búsqueda y filtros, pero el botón se bloquea y aparece un aviso.

## 3.3 Pedidos

**Ruta:** `/panel/pedidos`  
**Archivo:** `src/app/panel/pedidos/page.tsx`

Incluye:

- búsqueda por alumno;
- fecha de compra;
- ciclo;
- curso;
- limpieza de filtros;
- listado en filas;
- drawer con detalle.

El estado se deriva de `cancelledDates`:

- sin fechas anuladas: Pagado;
- algunas anuladas: Parcial;
- todas anuladas: Anulado.

El drawer muestra fechas activas/anuladas, subtotal, créditos usados, total original y “Pago confirmado”. No permite edición, devolución ni cancelación administrativa.

## 3.4 Menú semanal

**Ruta:** `/panel/menu`  
**Archivo:** `src/app/panel/menu/page.tsx`

Permite:

- navegar entre semanas;
- editar platos principales, acompañamientos e incluidos;
- marcar automáticamente la semana como no publicada al editar;
- publicar el menú;
- ver los cambios inmediatamente en el portal;
- recibir feedback temporal.

Las líneas de cada `textarea` se convierten en arreglos al guardar en el store.

**Importante:** “Guardar borrador” solo muestra un mensaje. Los cambios ya fueron aplicados y persistidos por cada `onChange`. “Publicar” únicamente cambia `published` a `true`.

“Subir menú” abre una explicación; no procesa archivos, PDF, planillas ni IA.

## 3.5 Alumnos

**Ruta:** `/panel/alumnos`  
**Archivo:** `src/app/panel/alumnos/page.tsx`

Muestra 60 alumnos ficticios en filas, con:

- nombre;
- apoderado;
- ciclo;
- curso;
- créditos;
- estado fijo “Activo”.

Permite buscar y filtrar. No existe CRUD. “Importar alumnos” solo abre una modal informativa.

## 3.6 Estadísticas

**Ruta:** `/panel/estadisticas`  
**Archivo:** `src/app/panel/estadisticas/page.tsx`

Muestra:

- promedio diario;
- tasa de entrega;
- total semanal;
- reservas por día;
- ventas estimadas por día;
- reservas por ciclo;
- lectura comercial para planificación de cocina.

Solo el martes 4 y la tasa de entrega se conectan al store. El resto de los días y el valor unitario de ventas (`5.400`) están hardcodeados. Son visualizaciones demostrativas, no analítica real.

## 3.7 Configuración

**Ruta:** `/panel/configuracion`  
**Archivo:** `src/app/panel/configuracion/page.tsx`

Permite modificar:

- precio por ciclo;
- inicio y fin del horario de entrega;
- hora límite de anulación;
- modo de anulación: automático, abierto o cerrado;
- modo de entrega: automático, abierto o cerrado.

Los cambios de precio, horario y anulación se guardan juntos con el botón Guardar. El modo de entrega se actualiza inmediatamente al pulsar.

“Restaurar datos iniciales” elimina el estado de la presentación y reinicia pedidos, reservas, entregas, créditos, menús, precios y configuración a los valores mock originales.

---

# 4. Cancelaciones y créditos

## Entrada

**Ruta:** `/anular`  
**Archivo:** `src/app/anular/page.tsx`

Se accede desde la portada y desde el encabezado del flujo de apoderados.

## Selección y elegibilidad

La página repite el selector ciclo → curso → estudiante y posee el atajo “Usar Tomás”.

Una reserva es elegible solo si:

- pertenece al estudiante seleccionado;
- su fecha es posterior a `DEMO_TODAY`;
- no fue entregada;
- no fue anulada.

`DEMO_TODAY` está hardcodeado como `2026-08-04`; no es la fecha real.

## Disponibilidad horaria

- Modo `abierto`: habilita anulaciones en cualquier momento.
- Modo `cerrado`: las bloquea.
- Modo `automatico`: permite entre `00:00` y `cancellationCutoff`, usando hora de Santiago.

La regla de tiempo es global para la demostración; no calcula un cutoff específico para cada fecha de servicio.

## Confirmación y cambios de estado

Al confirmar:

1. El reducer vuelve a validar que la reserva exista y no esté entregada/anulada.
2. Agrega `cancelledAt`.
3. Agrega la fecha a `order.cancelledDates`, sin duplicarla.
4. Incrementa en 1 el contador de créditos del estudiante.
5. La reserva deja de aparecer en Entregas.
6. Pedidos muestra la fecha como anulada y deriva estado Parcial o Anulado.
7. La pantalla presenta un mensaje de éxito y el nuevo saldo de créditos.

La reserva no se elimina físicamente: se conserva con `cancelledAt`.

## Uso posterior de créditos

En la siguiente compra del mismo estudiante:

- `creditsUsed = min(créditos disponibles, días seleccionados)`;
- cada crédito cubre un almuerzo al precio **actual** del ciclo;
- el descuento se muestra en Semana, Pago y Confirmación;
- `confirmPurchase` descuenta los créditos utilizados;
- si cubren todos los días, el total es cero.

No existe:

- elección de usar o reservar créditos;
- vencimiento;
- historial contable del crédito;
- valor monetario almacenado;
- devolución bancaria;
- transferencia de créditos entre estudiantes;
- aprobación administrativa.

El total original de un pedido no cambia al anular. La compensación se representa solo como un nuevo crédito.

---

# 5. Arquitectura técnica

## Stack

- Next.js `15.5.9` con App Router.
- React `19.2.8`.
- TypeScript estricto.
- Tailwind CSS 4 mediante `@import "tailwindcss"`.
- React Context + `useReducer`.
- Lucide React para iconos.
- Fuentes locales `@fontsource-variable/manrope` y `@fontsource-variable/newsreader`.
- npm con `package-lock.json`.

No hay biblioteca de componentes externa, ORM, cliente HTTP, SDK de pago ni framework de pruebas.

## Estructura principal

- `src/app`: rutas y páginas.
- `src/components`: shell, navegación y componentes visuales compartidos.
- `src/data/demo-data.ts`: datos y configuración inicial.
- `src/store/demo-store.tsx`: estado, reducer, acciones y persistencia.
- `src/lib/format.ts`: moneda, fechas, búsqueda y horarios.
- `src/types/index.ts`: tipos de dominio.

## Rutas

| Ruta | Propósito |
|---|---|
| `/` | Entrada y elección entre familias/panel |
| `/apoderado` | Selección de estudiante |
| `/apoderado/semana` | Semana, menú y selección de días |
| `/apoderado/pago` | Revisión y pago simulado |
| `/apoderado/confirmacion` | Confirmación y acceso a Entregas |
| `/anular` | Anulación y generación de crédito |
| `/panel` | Resumen operativo |
| `/panel/entregas` | Lista diaria y confirmación de entrega |
| `/panel/pedidos` | Pedidos, filtros y detalle |
| `/panel/menu` | Editor semanal |
| `/panel/alumnos` | Nómina y créditos |
| `/panel/estadisticas` | Métricas demostrativas |
| `/panel/configuracion` | Precios, horarios y controles demo |

## Componentes importantes

- `Brand` / `DemoBadge`: identidad y declaración de demo.
- `PortalShell`: encabezado y stepper del flujo familiar.
- `FlowGuard`: evita entrar a pasos sin estado previo.
- `PanelShell`: sidebar, drawer y contexto de demo.
- `PanelHeader`: encabezado estándar de secciones.
- `MetricCard`: métrica reutilizable.

## Hooks y estado

- `useDemo`: hook propio que exige estar dentro de `DemoProvider`.
- `useReducer`: lógica central de dominio demo.
- `useEffect`: hidratación/persistencia, timers, bloqueo de scroll y Escape.
- `useMemo`: filtros y valor del contexto.
- `useCallback`: creación de compra.
- `useRouter` / `usePathname`: navegación.

## Servicios

No existe capa de servicios. Todas las operaciones ocurren en componentes o en `demo-store.tsx`. En una solución real deberían separarse las operaciones de pedidos, pagos, reservas, entregas, créditos y menús hacia API/servicios de dominio.

---

# 6. Datos y persistencia

## Datos mock

Todo se define en `src/data/demo-data.ts`:

- 3 ciclos.
- 12 cursos.
- 5 estudiantes por curso: 60 en total.
- apoderados ficticios.
- alumno especial Tomás (`student-31`).
- 2 semanas de menús, del 3 al 14 de agosto de 2026.
- precios iniciales.
- horario de entrega y cutoff de anulación.
- pedidos iniciales.
- reservas iniciales.
- créditos iniciales.

La fecha principal de operación es el 4 de agosto de 2026. Hay 48 reservas iniciales ese día, 31 entregadas y 17 pendientes.

## Hardcodes fuera de `demo-data.ts`

- `2026-08-04` en Resumen, Entregas, Estadísticas y Cancelaciones.
- Planificación futura y varios valores estadísticos.
- Precio promedio `5.400` en Estadísticas.
- Colegio Curimón en portada y sidebar.
- Marca y textos Alimenta.
- Duración del pago simulado.
- Clave de almacenamiento.

## Persistencia

`DemoProvider` usa:

```text
localStorage["alimenta-demo-state-v2"]
```

Al montar:

1. intenta leer y parsear el JSON;
2. si falla, elimina la clave;
3. marca el estado como hidratado.

Después de hidratar, cada cambio guarda el estado completo.

La persistencia:

- solo existe en ese navegador y perfil;
- no sincroniza dispositivos;
- no tiene validación de esquema ni migraciones;
- no es segura para datos reales.

## Dónde modificar datos

- Ciclos y cursos: `src/data/demo-data.ts`, constante `cycles`.
- Alumnos/apoderados: generación de `students` en el mismo archivo.
- Alumno guiado: `demoStudentId`.
- Menús: `initialMenus`.
- Precios/horarios: `initialConfig`.
- Pedidos: `initialOrders` y generadores relacionados.
- Reservas/entregas: `initialReservations`.
- Créditos: `initialCredits`.
- Formas de los objetos: `src/types/index.ts`.
- Reglas y transiciones: `src/store/demo-store.tsx`.

## Backend

No existe backend, API, base de datos, autenticación ni almacenamiento remoto. Cualquier pantalla que parece leer información compartida lo hace desde el mismo Context/localStorage.

---

# 7. Sistema de pago

## Implementación actual

El pago está concentrado en:

- `src/app/apoderado/pago/page.tsx`;
- `confirmPurchase` en `src/store/demo-store.tsx`;
- confirmación en `src/app/apoderado/confirmacion/page.tsx`.

El cálculo es:

```text
subtotal = cantidad de días × precio del ciclo
créditos usados = mínimo entre saldo y cantidad de días
descuento = créditos usados × precio actual
total = subtotal − descuento
```

El botón espera 1,1 segundos, crea inmediatamente un pedido considerado pagado, genera reservas y navega a confirmación. No solicita tarjeta ni llama servicios externos.

## Qué debe cambiar para una pasarela real

Recomendación para producción:

1. Crear el pedido en backend con estado pendiente.
2. Validar en servidor estudiante, fechas, duplicados, precio y créditos.
3. Reservar o bloquear temporalmente créditos.
4. Crear una sesión de pago con la pasarela.
5. Redirigir o abrir el flujo oficial del proveedor.
6. Confirmar exclusivamente mediante respuesta verificada/webhook.
7. Aplicar idempotencia para evitar pedidos duplicados.
8. Crear las reservas solo después de pago confirmado, o mantenerlas con expiración.
9. Registrar transacción, monto, proveedor, estado y referencias no sensibles.
10. Manejar rechazo, abandono, reintento, expiración y devolución.
11. Mostrar confirmación desde el estado persistido del servidor, no desde `lastOrderId` local.

No hay variables de entorno ni secretos en el proyecto actual. Una integración real debe mantener claves únicamente en servidor y nunca en este documento o código cliente.

---

# 8. Diseño y UI

## Identidad

Dirección visual: hospitalidad operativa cálida, profesional y contemporánea.

- Fondo marfil/crema.
- Verde bosque como color principal.
- Terracota para acentos, créditos y advertencias.
- Dorado para métricas secundarias.
- Manrope para interfaz.
- Newsreader para titulares editoriales.
- Iconografía Lucide.

Los tokens están en `src/app/globals.css` como variables CSS OKLCH.

## Layout

- Portada dividida en dos columnas grandes en escritorio.
- Portal sin sidebar y con stepper de cuatro pasos.
- Panel con sidebar fijo y contenido amplio.
- Drawer para navegación móvil.
- Entregas, Pedidos y Alumnos usan filas/columnas en escritorio, no tarjetas repetitivas.
- Modales, drawer de detalle, empty states y toasts propios.

## Componentes visuales reutilizables

- `.surface`
- `.btn-primary`
- `.btn-secondary`
- `.btn-quiet`
- `.btn-danger`
- `.field`
- `.eyebrow`
- `.demo-badge`
- `.display-font`
- `PanelHeader`
- `MetricCard`

## Responsive

- Portal familiar prioriza móvil.
- Entregas prioriza tablet/notebook.
- Sidebar aparece desde `lg`.
- Tablas se convierten en filas compactas móviles.
- Usa `100dvh`, safe areas y tamaños táctiles cercanos o superiores a 44 px.
- Desde 48 rem, la raíz tipográfica baja a 92%; desde 64 rem, a 85%. Esta decisión reproduce una sensación de “zoom 85%” solicitada durante el pulido.

## Accesibilidad aplicada

- Labels o textos `sr-only`.
- Estados `aria-pressed`, `aria-current`, `aria-live`.
- Modales con `role="dialog"` y `aria-modal`.
- Enlace para saltar al contenido.
- Foco visible global.
- Soporte de `prefers-reduced-motion`.

La accesibilidad es básica: no existe auditoría completa ni focus trap robusto en todos los overlays.

---

# 9. Funcionalidades específicas de Alimenta

Estas partes deben eliminarse o adaptarse para otro cliente:

- Nombre “Alimenta Casinos”.
- Icono de brote y textos de marca.
- Metadata “Alimenta Casinos · Demo”.
- “Colegio Curimón”.
- Referencias al “Equipo Alimenta”.
- Nombre y recorrido guiado de Tomás González Pérez.
- Nombre del apoderado Camila Pérez Soto.
- Textos comerciales de portada.
- Clave `alimenta-demo-state-v2`.
- Menús y fechas de agosto de 2026.
- Ciclos y cursos definidos para esta institución.
- Precios 4.800 / 5.500 / 5.500.
- Modelo de buffet sin selección de plato.
- Horario 12:30–15:00.
- Cutoff de anulación 09:00.
- Regla “anulación = 1 crédito de almuerzo”.
- Fechas operacionales fijas.
- Datos seed de pedidos/entregas.
- Métricas y proyecciones hardcodeadas.
- Navegación y nombres de módulos del panel.
- Textos “Propuesta navegable”, “Vista demo” y explicaciones comerciales.
- Formato CLP y zona horaria de Santiago, si el nuevo cliente no está en Chile.

---

# 10. Funcionalidades reutilizables

## Reutilizar prácticamente sin cambios

- Patrón de selector dependiente ciclo → curso → alumno.
- Helpers de formato/búsqueda, si el nuevo cliente sigue en Chile.
- Estructura de `PortalShell` y `FlowGuard`.
- Patrón de sidebar/drawer de `PanelShell`.
- `PanelHeader`, `MetricCard`, botones, campos y superficies.
- Búsqueda normalizada por prefijos.
- Patrones responsive de filas.
- Modales de confirmación, drawer de detalle, empty states y toasts.
- Estructura del flujo selección → resumen → confirmación.

## Reutilizar modificando datos o configuración

- Generación de estudiantes.
- Ciclos y cursos.
- Menús y semanas.
- Precios.
- Horarios.
- Datos seed.
- Textos, marca y paleta.
- Navegación del panel.
- Métricas.
- Alumno de demostración.
- `STORAGE_KEY`.

## Revisar antes de reutilizar

- Lógica de créditos y su valoración al precio actual.
- Elegibilidad y cutoff de anulaciones.
- Prevención de duplicados.
- Bloqueo horario.
- Relación pedido/reserva.
- Confirmación de entrega.
- Persistencia de estado completo.
- Cálculo de ventas.
- Estado publicado/borrador del menú.
- Uso de fechas fijas.
- Modelo buffet versus selección de platos.
- Acceso sin autenticación.

## No reutilizar como solución de producción

- Pago con `setTimeout`.
- `localStorage` como fuente de verdad.
- Controles manuales de horario.
- Métricas hardcodeadas.
- IDs con `Date.now()`.
- Autorización basada solo en ocultar botones.
- Rutas administrativas públicas.
- Datos personales ficticios como si fueran reales.
- Carga/importación simulada.
- Reglas financieras sin ledger.
- Protección de doble entrega solo en cliente.

---

# 11. Decisiones importantes tomadas durante el desarrollo

- Se construyó una **demo comercial**, no infraestructura productiva.
- El recorrido principal debía poder explicarse en 3–5 minutos.
- Se priorizó el flujo Apoderado → Pago → Entregas sobre módulos secundarios.
- Se descartaron backend, autenticación, base de datos y pasarela para no invertir antes de una compra del cliente.
- La operación es buffet; por eso no hay elección de platos ni estadísticas de preferencias.
- La lista de Entregas solo muestra reservas consideradas pagadas. No repite comprobantes ni estados bancarios.
- Se eligió Context + reducer para conectar pantallas sin arquitectura enterprise.
- Se agregó `localStorage` para que la historia sobreviva a recargas durante una presentación.
- Se agregó un alumno guiado para ejecutar la demostración con rapidez.
- Las entregas y alumnos terminaron presentándose como filas con columnas para aumentar densidad y profesionalismo.
- Se añadió un sistema de anulaciones/créditos para representar una necesidad comercial observada en sistemas de referencia.
- Los proyectos en `/referencias` se usaron solo para entender lógica; no hay dependencia runtime ni copia visual.
- La estética se mantuvo nueva, cálida, minimalista y más espaciada.
- Se redujo la escala tipográfica en escritorio para obtener una vista equivalente a zoom 85%.
- Se reforzó en portada y panel que la experiencia es una propuesta demo y que la solución final se decide con el cliente.
- “Subir menú” e “Importar alumnos” se dejaron como conversaciones de futuro, no como funciones falsas.
- No se creó selector de colegios ni multi-tenant porque el alcance era Colegio Curimón.
- La siguiente etapa prevista era recoger retroalimentación, especificar y cotizar el producto real.

---

# 12. Problemas conocidos y deuda técnica

## Limitaciones funcionales

- Fechas operativas hardcodeadas; la demo envejece.
- No se deshabilitan días pasados ni días con `service: false`.
- No hay selección mensual.
- No hay historial de apoderado ni cuenta familiar.
- No hay pagos reales, rechazos ni reintentos.
- No hay devolución monetaria.
- No hay CRUD de alumnos.
- No hay carga de archivos.
- No hay edición/cancelación desde administración.
- No hay inventario, recetas, producción por preparación ni mermas.
- No hay multiestablecimiento.

## Consistencia de datos

- Varias reservas seed reutilizan IDs de solo 14 pedidos; para índices posteriores, el alumno de la reserva puede no coincidir con el alumno del pedido referenciado. No afecta el recorrido visible del día 4, pero no debe copiarse a producción.
- `confirmPurchase` cobra y registra todas las fechas de `selectedDates`, pero al crear reservas filtra fechas ya reservadas. La UI normal impide seleccionar duplicados, pero el store no garantiza consistencia ante estado manipulado.
- Las ventas del dashboard se calculan con precios actuales, no con el total histórico del pedido ni descuentos.
- Las estadísticas semanales son parcialmente fijas.
- Cambiar precios altera el valor con el que se consumen créditos futuros.
- Los pedidos mantienen su total original después de una anulación.

## Estado y seguridad

- El JSON de `localStorage` no se valida contra un esquema.
- No hay migración entre versiones del estado.
- No existe control de concurrencia.
- La acción `deliver` no rechaza por sí misma una segunda entrega.
- Las rutas administrativas no están protegidas.
- El reloj del navegador decide horarios y timestamps.
- No hay auditoría real.
- No hay segregación de datos.
- No se deben cargar datos reales de menores en esta versión.

## UI y accesibilidad

- Algunos modales no implementan focus trap/restauración de foco completa.
- No existe suite automatizada de accesibilidad o E2E.
- “Guardar borrador” no es una operación distinta: editar ya persiste.
- El estado `published` no controla visibilidad en el portal; el portal muestra los menús aunque estén en borrador.

## Calidad técnica

- No hay pruebas unitarias, integración ni E2E en el repositorio.
- No hay capa de servicios ni validaciones de dominio independientes.
- No hay manejo centralizado de errores.
- `Date.now()` no es un generador robusto de IDs.
- El código concentra páginas extensas y JSX denso; es aceptable para demo, no ideal para crecimiento.
- No existe `engines` en `package.json`.

---

# 13. Cómo ejecutar el proyecto

## Requisitos

- Node.js compatible con Next.js 15.
- npm.
- No requiere variables de entorno.
- No requiere servicios externos.

## Instalación

Desde esta carpeta:

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Verificaciones

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Producción local

```bash
npm run build
npm run start
```

## Deploy

La aplicación es compatible con detección automática de Next.js en Vercel. El contenido de esta carpeta debe ser la raíz del repositorio/deploy; no se debe configurar una raíz adicional `app`.

Remoto Git inspeccionado:

```text
https://github.com/ChristianEducation/DemoAlimenta.git
```

No hay variables de entorno necesarias para la demo actual. `.gitignore` excluye `node_modules`, `.next`, `.vercel`, `.env*`, logs y artefactos TypeScript.

---

# 14. Guía para crear una nueva demo desde esta base

## 1. Qué conservar

- Estructura Next.js.
- Store central y conexión entre compra/entrega como prototipo.
- Shell del portal.
- Shell del panel.
- Sistema visual y componentes base.
- Filtros, búsqueda, filas, modales, toasts y guards.
- Recorrido comercial corto.

Copiar el contenido de esta carpeta sin `.git`, `node_modules`, `.next` ni `tsconfig.tsbuildinfo`.

## 2. Qué cambiar primero

1. Crear una nueva clave de `localStorage` para no hidratar datos Alimenta.
2. Sustituir marca, cliente y metadata.
3. Sustituir ciclos, cursos y alumnos.
4. Sustituir fechas, menús y precios.
5. Decidir si el servicio es buffet o con elección.
6. Definir las reglas de reserva, anulación, pago y entrega.
7. Regenerar pedidos/reservas mock coherentes.
8. Ajustar navegación/módulos.
9. Recalcular todas las métricas con los nuevos datos.

## 3. Dónde está el branding

- Logo textual e icono: `src/components/brand.tsx`.
- Marca del sidebar: `src/components/panel-shell.tsx`.
- Portada y textos comerciales: `src/app/page.tsx`.
- Metadata: `src/app/layout.tsx`.
- Colores, tipografías y escala: `src/app/globals.css`.
- Colegio/establecimiento: portada y `PanelShell`.

Buscar globalmente:

```text
Alimenta
Casinos
Colegio Curimón
Tomás
Propuesta navegable
```

## 4. Dónde están alumnos, cursos y ciclos

- `src/data/demo-data.ts`: `cycles`, nombres, apellidos, generación de `students`, `demoStudentId`.
- `src/types/index.ts`: `CycleId`, `Cycle`, `Student`.

Si cambia la cantidad de ciclos, actualizar también `CycleId` y cualquier `Record<CycleId, number>`.

## 5. Dónde están menús y precios

- Menús: `initialMenus` en `src/data/demo-data.ts`.
- Precios/horarios: `initialConfig`.
- Forma del menú: `MenuDay` / `MenuWeek`.
- Editor: `src/app/panel/menu/page.tsx`.
- Representación familiar: `src/app/apoderado/semana/page.tsx`.

## 6. Dónde están las reglas de reserva

- Selección de fechas: reducer `toggle-date`.
- Cambio de alumno/semana: reducer.
- Prevención visual de fecha ya reservada: página Semana.
- Creación de pedido/reservas: `confirmPurchase`.
- Tipos: `Order` y `Reservation`.

Revisar siempre duplicados, disponibilidad, días sin servicio, cutoff y zona horaria.

## 7. Dónde está el panel administrativo

- Navegación/layout: `src/components/panel-shell.tsx`.
- Rutas: `src/app/panel/**`.
- Componentes comunes: `src/components/panel-ui.tsx`.

Para retirar un módulo, eliminar su ítem de `navItems` y su ruta, y luego retirar estado/acciones solo si ya no son usados.

## 8. Dónde está el flujo de pago

- UI: `src/app/apoderado/pago/page.tsx`.
- Creación local: `confirmPurchase`.
- Confirmación: `src/app/apoderado/confirmacion/page.tsx`.

Para otra demo basta cambiar textos/reglas. Para producción se debe reemplazar completamente la simulación por un flujo servidor/pasarela/webhook.

## 9. Cómo retirar funcionalidades específicas de Alimenta

- Anulación/créditos: retirar `/anular`, enlaces en portada/PortalShell, campos `credits`/`cancelledAt`/`cancelledDates`, acciones del reducer y UI relacionada.
- Buffet: cambiar estructura de `MenuDay`, selección semanal, reportes y producción.
- Controles demo: retirar modos manuales y `FlaskConical` en Configuración.
- Colegio único: reemplazar o agregar modelo de establecimientos.
- Alumno guiado: retirar `demoStudentId` y botones de autocompletado.
- Textos demo: retirar `DemoBadge` y avisos solo cuando el nuevo objetivo deje de ser demostrativo.

Eliminar de manera vertical: UI, estado, tipos y datos. No dejar campos huérfanos.

## 10. Cómo adaptar sin romper el flujo

1. Ejecutar el flujo original antes de cambiar nada.
2. Cambiar un dominio a la vez: branding, datos, reglas, UI.
3. Mantener consistentes IDs de alumno, pedido y reserva.
4. Mantener fechas de menús alineadas con reservas.
5. Mantener precios cubriendo todos los `CycleId`.
6. Cambiar la clave de almacenamiento.
7. Restaurar datos tras modificar la forma del estado.
8. Verificar guards entrando directamente a rutas intermedias.
9. Probar compra → confirmación → Entregas.
10. Probar entrega y doble entrega.
11. Probar anulación → crédito → compra con total cero, si se conserva.
12. Probar menú editado en el portal.
13. Probar abierto/cerrado/automático.
14. Probar móvil, tablet y escritorio.
15. Ejecutar lint, TypeScript y build.

---

# 15. Mapa rápido del proyecto

- **Necesito cambiar branding** → `src/components/brand.tsx`, `src/components/panel-shell.tsx`, `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`.
- **Necesito cambiar el colegio** → `src/app/page.tsx` y `src/components/panel-shell.tsx`.
- **Necesito cambiar ciclos/cursos** → `src/data/demo-data.ts` (`cycles`) y `src/types/index.ts` (`CycleId`).
- **Necesito cambiar alumnos/apoderados** → `src/data/demo-data.ts` (`students`, nombres y `demoStudentId`).
- **Necesito cambiar menús/semanas** → `src/data/demo-data.ts` (`initialMenus`).
- **Necesito cambiar precios** → `src/data/demo-data.ts` (`initialConfig.pricing`) y panel Configuración.
- **Necesito cambiar horarios** → `initialConfig`, `src/lib/format.ts`, Entregas y Configuración.
- **Necesito cambiar cutoff de anulación** → `initialConfig`, `/anular` y Configuración.
- **Necesito cambiar la fecha de la demo** → buscar `2026-08-04` y revisar todas las fechas de `initialMenus`, pedidos y reservas.
- **Necesito cambiar reglas de reserva** → `src/store/demo-store.tsx` y `/apoderado/semana`.
- **Necesito cambiar créditos** → reducer, `confirmPurchase`, `/anular`, Semana, Pago, Confirmación, Pedidos y Alumnos.
- **Necesito cambiar pago** → `/apoderado/pago`, `confirmPurchase` y `/apoderado/confirmacion`.
- **Necesito cambiar el portal familiar** → `src/app/apoderado/**` y `src/components/portal-shell.tsx`.
- **Necesito cambiar panel casino** → `src/app/panel/**` y `src/components/panel-shell.tsx`.
- **Necesito cambiar entregas** → `src/app/panel/entregas/page.tsx`, acciones `deliver` y tipos `Reservation`.
- **Necesito cambiar pedidos** → `src/app/panel/pedidos/page.tsx`, `Order` y datos iniciales.
- **Necesito cambiar alumnos** → `src/app/panel/alumnos/page.tsx` y `demo-data.ts`.
- **Necesito cambiar estadísticas** → `src/app/panel/estadisticas/page.tsx` y resumen del panel.
- **Necesito cambiar menú administrativo** → `src/app/panel/menu/page.tsx` y acciones `update-menu` / `publish-menu`.
- **Necesito cambiar persistencia** → `src/store/demo-store.tsx`, especialmente `STORAGE_KEY` e hidratación.
- **Necesito retirar módulos** → `navItems`, ruta correspondiente, store, tipos y datos asociados.
- **Necesito preparar producción** → reemplazar localStorage, pago simulado, fechas fijas, auth ausente y mutaciones locales por backend, base de datos, permisos, validaciones e idempotencia.

