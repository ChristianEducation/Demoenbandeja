# HANDOFF — Demo Casino Enbandeja

Documento de referencia técnica de esta demo. Describe qué es el proyecto, cómo está
construido, qué reglas de negocio implementa y qué límites tiene a propósito.

No es un spec ejecutable: no contiene tareas pendientes ni instrucciones para un agente.

---

## 1. Qué es este proyecto

Una demo comercial navegable de un sistema de pedidos para un casino escolar. Sirve para
mostrar, en pocos minutos y sin instalar nada, cómo se vería digitalizada la operación:

> El apoderado elige alumno y días → arma su pedido (almuerzo y/o cafetería) → paga de
> forma simulada → el casino ve inmediatamente qué preparar y qué entregar.

El casino representado se llama **Casino Enbandeja** ("De la cocina a la mesa"). Es un
casino **ficticio**, creado únicamente para la demo. No corresponde a ningún cliente.

### Origen

La demo desciende de dos demos anteriores construidas para clientes distintos. De la
primera vienen la arquitectura (Next.js + Context/reducer + `localStorage`), el shell del
portal familiar y el patrón de listado operativo. De la segunda vienen el flujo unificado
"Mi semana", la tarifa semanal automática, la cafetería y el panel de operación del día.
Esta versión eliminó toda referencia a esos clientes y quedó como base genérica y
reutilizable para mostrar a cualquier prospecto.

---

## 2. Arquitectura

### Stack

- Next.js 15 con App Router.
- React 19.
- TypeScript estricto.
- Tailwind CSS 4 (`@import "tailwindcss"`), con tokens OKLCH propios en `globals.css`.
- React Context + `useReducer` para el estado.
- `lucide-react` para iconografía.
- Fuente local `@fontsource-variable/manrope`.
- npm con `package-lock.json`.

No hay backend, base de datos, autenticación, ORM, cliente HTTP, SDK de pago ni framework
de pruebas. Tampoco variables de entorno ni servicios externos.

### Estructura de carpetas

```text
src/app          rutas y páginas (App Router)
src/components   shell, navegación y componentes visuales compartidos
src/data         datos y configuración iniciales de la demo
src/lib          precios, disponibilidad, agregación operativa y formato
src/store        estado global, reducer y persistencia
src/types        tipos de dominio
```

### Rutas

| Ruta | Propósito |
|---|---|
| `/` | Entrada: elección entre Apoderados y Casino |
| `/apoderado` | Selección de curso y alumno |
| `/apoderado/reserva` | "Mi semana": agenda, almuerzo y cafetería por día |
| `/apoderado/pago` | Revisión del pedido y pago simulado |
| `/apoderado/confirmacion` | Confirmación y acceso al panel |
| `/panel` | Operación del día: pestañas Preparación y Entregas |

### Dónde vive el estado

Todo el estado compartido está en `src/store/demo-store.tsx`: un `useReducer` dentro de un
Context, expuesto por el hook `useDemo()`. El estado contiene alumno seleccionado, semana
visible, carrito, última orden, órdenes, entregas, menús y configuración.

Acciones principales del reducer: `select-student`, `select-week`, `toggle-lunch`,
`add-lunch-dates`, `set-cafeteria-quantity`, `purchase`, `add-manual-lunch`, `deliver`,
`update-cutoff-mode`, `reset`.

No existe capa de servicios: la lógica de cálculo vive en `src/lib` y las mutaciones en el
store.

### Cómo persiste

`DemoProvider` guarda el estado completo en `localStorage` bajo una única clave
(`enbandeja-demo-state-v1`). Al montar intenta leer y parsear el JSON; si falla, borra la
clave. Después de hidratar, cada cambio de estado reescribe el objeto completo.

El modal introductorio usa `sessionStorage` con su propia clave
(`enbandeja-intro-seen`) para mostrarse una sola vez por sesión de navegador.

Cambiar el nombre de la clave de `localStorage` equivale a resetear la demo: el estado
guardado deja de hidratarse y se vuelve al seed inicial.

---

## 3. Modelo de dominio

### Alumnos y cursos

Los cursos son una lista plana de strings (`courses`). Los alumnos se generan a partir de
esa lista, cinco por curso, con nombre ficticio y apoderado ficticio. Un alumno está
marcado como `demoStudentId` para acelerar la presentación.

```ts
Student { id, name, course, guardianName }
```

No hay ciclos, sedes ni multi-establecimiento.

### Semanas de menú

El servicio de almuerzos se presenta de **lunes a jueves**. El viernes no forma parte de la
agenda. Cada semana es un `MenuWeek` con cuatro `MenuDay`:

```ts
MenuWeek { id, label, shortLabel, startDate, endDate, days[] }
MenuDay  { date, dayName, main, vegetarian, sides[], dessert }
```

El apoderado ve el menú del día (principal + alternativa vegetariana + acompañamientos +
postre) pero **no elige variante**: compra el almuerzo del día. Por eso la cocina no puede
—ni debe— mostrar un reparto entre principal y vegetariano.

### Cafetería

Catálogo plano de productos con categoría (`sandwiches`, `snacks`, `horneados`,
`bebestibles`), descripción y precio. Se compra por día y cantidad, y es independiente del
almuerzo: un alumno puede comprar solo cafetería.

```ts
CafeteriaProduct { id, name, description, category, price }
```

### Órdenes

Una orden agrupa todo lo comprado en una misma operación, para uno o varios días y una o
varias semanas:

```ts
Order { id, studentId, purchasedAt, lunchItems[], cafeteriaItems[],
        lunchSubtotal, cafeteriaSubtotal, total }

LunchItem     { studentId, date, weekId, unitPriceApplied, pricingMode, source }
CafeteriaItem { studentId, date, productId, productName, category, quantity, unitPrice }
```

`source` distingue la compra online del almuerzo agregado manualmente desde el panel.

Cada ítem conserva el precio aplicado en el momento de la compra: cambiar la configuración
después no altera órdenes anteriores.

### Entregas por paquete alumno + fecha

La entrega no se registra por producto. Todos los ítems de un mismo alumno para una misma
fecha se tratan como un **paquete de entrega diario** (`packagesForDate` en
`src/lib/operations.ts`). Marcar "Entregar" registra un timestamp bajo la clave
`studentId__fecha` en el mapa `deliveries`. Es lo que evita entrega parcial por producto y
mantiene la operación simple.

---

## 4. Regla de precios

La configuración expone dos tarifas de almuerzo y un corte:

```ts
DemoConfig { dailyLunchPrice, weeklyLunchUnitPrice, bookingCutoff, cutoffMode }
```

El cálculo vive en `computeLunchGroups` (`src/lib/pricing.ts`):

1. Las fechas de almuerzo del carrito se agrupan **por semana calendario real**.
2. Si en una semana están seleccionados **los cuatro días** (lunes a jueves de esa misma
   semana), esos cuatro almuerzos pasan automáticamente a `weeklyLunchUnitPrice`.
3. Si la semana está incompleta, todos sus almuerzos usan `dailyLunchPrice`.
4. Cada semana se evalúa de forma independiente: dos semanas completas dan dos tarifas
   semanales; cuatro almuerzos repartidos entre dos semanas no dan ninguna.
5. Quitar un día de una semana completa devuelve los restantes a tarifa diaria, en el acto.

**La cafetería nunca entra en este cálculo.** No suma para completar la semana, no recibe
descuento y no altera el precio del almuerzo. Su subtotal se calcula aparte como
`Σ unitPrice × quantity`.

Total del pedido = subtotal de almuerzos + subtotal de cafetería.

### Corte de reservas

`bookingBlockReason` (`src/lib/booking.ts`) decide si una fecha admite reserva online:
fechas pasadas quedan bloqueadas, y la fecha de "hoy" depende de `cutoffMode`
(`abierto` siempre permite, `cerrado` siempre bloquea, `automatico` compara la hora de
Santiago con `bookingCutoff`). El modo es conmutable desde el panel para poder demostrar
ambos estados en vivo. El almuerzo manual del panel es la excepción operativa que permite
saltarse el corte.

---

## 5. Qué es real y qué es simulado

**Funciona de verdad dentro de la demo:**

- Selección dependiente curso → alumno.
- Navegación entre semanas sin perder el carrito.
- Agregar/quitar almuerzo, cantidades de cafetería, botón de semana completa.
- Cálculo de tarifa diaria/semanal en tiempo real.
- Creación de la orden y su aparición inmediata en el panel.
- Preparación: conteos de almuerzos y agregación de cafetería por producto.
- Entregas: búsqueda normalizada, filtros, confirmación de entrega con hora.
- Almuerzo manual desde el panel, con bloqueo de duplicados.
- Persistencia entre recargas y reseteo del estado.

**Es simulado o meramente demostrativo:**

- El pago: no hay pasarela, tarjeta, transacción ni proveedor. Un temporizador breve y la
  orden queda creada como pagada.
- Todos los datos: alumnos, apoderados, cursos, menús, productos, precios y seeds.
- Las fechas: la demo opera sobre una fecha "hoy" fija (`DEMO_TODAY`) y semanas fijas.
- La autenticación: no existe. Todas las rutas son públicas, incluido el panel.
- El horario: el modo de corte se puede forzar manualmente desde la interfaz.

---

## 6. Limitaciones conocidas que se mantienen a propósito

Son decisiones, no defectos pendientes:

- **Fechas fijas de demo.** `DEMO_TODAY` y las semanas de menú están escritas en los datos.
  La demo envejece; se actualizan a mano cuando conviene.
- **Protección de doble entrega solo en cliente.** La UI oculta el botón de un paquete ya
  entregado, pero el reducer no rechaza una segunda acción `deliver`. No hay atomicidad ni
  control de concurrencia; producción necesitaría validación en servidor.
- **Sin validación de esquema en `localStorage`.** El JSON se parsea y se acepta tal cual;
  no hay migraciones entre versiones del estado. Un estado corrupto se descarta entero.
- **IDs generados con `Date.now()`**, suficiente para una sesión de demo.
- **Sin backend, auth ni permisos**: cualquiera que llegue a `/panel` lo ve.
- **Sin pruebas automatizadas** de ningún tipo.
- **Accesibilidad básica**: labels, `aria-pressed`, `aria-live`, `role="dialog"`, foco
  visible y cierre con Escape, pero sin focus trap completo ni auditoría formal.
- **Sin inventario, stock, recetas, mermas, devoluciones ni facturación.**
- **Formato CLP y zona horaria de Santiago** están asumidos en `src/lib/format.ts`.

---

## 7. Cómo ejecutar y verificar

Requiere Node.js compatible con Next.js 15 y npm. No requiere variables de entorno.

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

Verificaciones:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Producción local:

```bash
npm run build
npm run start
```

El proyecto es compatible con la detección automática de Next.js en Vercel; la raíz del
repositorio debe ser la raíz del proyecto.

### Recorrido de verificación manual

1. Inicio: mensaje, marca y modal introductorio.
2. Apoderado: alumno → días de una semana → cafetería → pago → confirmación.
3. Tarifa: 3 días (diaria) → agregar el cuarto (semanal) → quitar uno (vuelve a diaria).
4. Panel, Preparación: conteo de almuerzos y agregación de cafetería del día.
5. Panel, Entregas: buscar un alumno, marcar la entrega, verificar hora y métricas.
6. Recargar el navegador y confirmar que el estado se conserva.
7. Repetir en móvil (~390 px), sin overflow horizontal.

---

## 8. Historial resumido

1. **Base original.** Demo para un primer cliente: portal de apoderados, panel
   administrativo amplio (pedidos, alumnos, menú, estadísticas, configuración) y un sistema
   de anulaciones con créditos. Modelo de almuerzo tipo buffet.
2. **Segunda demo, alcance reducido.** Copia adaptada a otro cliente: se eliminaron los
   módulos administrativos secundarios y las anulaciones/créditos, se simplificó el panel a
   una sola pantalla operativa y se rehizo la identidad visual en una escala más compacta.
3. **Evolución del flujo.** Se unificó la reserva en una sola pantalla "Mi semana", se
   incorporó la cafetería como línea comprable de forma independiente, se reemplazaron las
   modalidades comerciales visibles (diario/semanal/mensual) por la tarifa semanal
   automática, y el panel pasó a dos vistas: Preparación y Entregas.
4. **Genericización.** Se retiró toda la identidad del cliente anterior, se adoptó el casino
   ficticio Casino Enbandeja, se eliminaron las rutas heredadas que solo redirigían y se
   consolidó la documentación previa en este archivo.
