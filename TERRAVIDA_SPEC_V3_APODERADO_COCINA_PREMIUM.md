# TERRAVIDA — SPEC DRIVEN V3
## Flujo Apoderado + Cafetería + Cocina/Entregas + Pulido UI/UX Premium

> Este documento REEMPLAZA el spec anterior de mejora del flujo de apoderado.
> Ejecutar sobre la DemoTerravida existente.
> No combinar con versiones anteriores del spec para evitar instrucciones contradictorias.

---

# 0. MISIÓN

Mejorar la demo comercial TerraVida existente para contar una historia completa y coherente:

**Apoderado reserva/comprar → pedido se calcula → pago simulado → cocina sabe qué preparar → casino sabe qué entregar.**

La demo debe demostrar de forma muy visual que una misma plataforma puede manejar:

- almuerzos por día;
- tarifa semanal automática;
- varias semanas futuras;
- cafetería por día;
- pedidos solo de cafetería;
- pedidos mixtos;
- preparación de cocina;
- entregas por alumno;
- filtros operativos;
- pedido manual;
- persistencia local.

La aplicación YA EXISTE.

Este trabajo es una evolución controlada de la demo, NO una reconstrucción.

---

# 1. REGLAS DE EJECUCIÓN

Antes de tocar código:

1. Leer este archivo completo.
2. Inspeccionar la implementación actual de DemoTerravida.
3. Identificar exactamente:
   - flujo de Curso → Alumno;
   - `/apoderado/reserva`;
   - `/apoderado/pago`;
   - `/apoderado/confirmacion`;
   - store/context;
   - tipos;
   - datos demo;
   - `localStorage`;
   - `/panel`;
   - reserva manual;
   - confirmación de entrega.
4. Reutilizar la arquitectura existente cuando sea razonable.
5. Realizar la menor intervención estructural necesaria para cumplir correctamente el spec.
6. Mantener la demo rápida, estable y sencilla de presentar.

## NO HACER

- No reconstruir la aplicación.
- No crear backend.
- No agregar autenticación.
- No integrar pasarela real.
- No crear inventario.
- No crear stock.
- No crear recetas.
- No crear módulos enterprise.
- No agregar gestión de proveedores.
- No agregar perfiles/permisos.
- No agregar notificaciones.
- No refactorizar archivos ajenos solo por limpieza.
- No instalar una librería UI nueva.
- No copiar literalmente otra aplicación.
- No convertir esta demo en un producto final.

---

# 2. CONTEXTO DE LA DEMO

Fecha operacional de referencia:

**Lunes 27 de julio de 2026.**

Para esta demostración, el servicio regular de almuerzos se presenta:

**LUNES A JUEVES.**

Viernes NO forma parte de la agenda de almuerzos.

Actualizar los fixtures/fechas actuales si todavía están anclados a octubre de 2026.

La demo debe tener como mínimo:

- semana actual: 27–30 julio 2026;
- semana siguiente: 3–6 agosto 2026;
- otra semana futura: 10–13 agosto 2026.

Puede existir una cuarta semana si simplifica la navegación/demo.

Los menús y precios son DEMO.
Los nombres de productos pueden inspirarse en la oferta publicada por TerraVida, pero no presentar el contenido como “menú vigente”.

---

# 3. PRINCIPIO DE UX

Eliminar completamente del flujo visible:

- Diario
- Semanal
- Mensual

El apoderado no debe entender modalidades comerciales.

Debe pensar simplemente:

> “¿Qué necesita mi hijo esta semana?”

La interfaz muestra una agenda.

El usuario elige días y productos.

El sistema entiende automáticamente cuándo corresponde tarifa diaria o semanal.

---

# 4. FLUJO GENERAL DEL APODERADO

Mantener:

**Curso → Alumno**

Después entrar a una única experiencia de reserva:

**Mi semana**

Dentro de esa pantalla:

1. navegar por semanas;
2. tocar un día;
3. agregar almuerzo;
4. agregar cafetería;
5. repetir en otros días/semanas;
6. revisar pedido;
7. continuar a pago;
8. confirmar.

Debe poder:

- comprar solo almuerzo;
- comprar solo cafetería;
- comprar ambos;
- comprar en varias fechas;
- comprar en varias semanas.

---

# 5. DISEÑO PREMIUM — DIRECCIÓN VISUAL

## Referencia conceptual

Tomar como referencia de calidad:

- apps modernas de pedido móvil;
- Square Online;
- Toast Online Ordering;
- Square KDS;
- Toast KDS.

NO copiar pixel a pixel.

Usar sus principios:

- jerarquía muy clara;
- interfaces táctiles;
- poca decoración innecesaria;
- estados evidentes;
- información operativa densa pero legible;
- CTA persistente;
- filtros rápidos;
- conteos visibles;
- pocas decisiones simultáneas.

## Mantener identidad TerraVida

Conservar:

- paleta actual;
- crema/papel;
- navy;
- verde/pine;
- terracota;
- Manrope;
- branding existente.

## Pulido visual

La sensación debe ser:

**producto SaaS premium, sobrio, cálido, operativo.**

Evitar:

- gradientes decorativos;
- glassmorphism exagerado;
- sombras grandes repetidas;
- tarjetas dentro de tarjetas;
- bordes excesivos;
- iconos sin función;
- bloques enormes de texto;
- colores diferentes para cada cosa.

Preferir:

- fondos limpios;
- bordes 1px;
- radios consistentes;
- sombras casi imperceptibles;
- buen whitespace;
- texto principal oscuro;
- muted solo para información secundaria;
- color fuerte reservado para selección/estado/CTA.

---

# 6. LAYOUT DEL APODERADO

## Escritorio

Usar estructura aproximada:

```text
┌─────────────────────────────────────────────┐
│ título + alumno                             │
│ navegación semana                           │
│ franja LUN MAR MIÉ JUE                      │
├─────────────────────────────┬───────────────┤
│ detalle día seleccionado    │ Tu pedido     │
│ almuerzo                    │ sticky        │
│ cafetería                   │               │
└─────────────────────────────┴───────────────┘
```

## Móvil

Orden:

```text
Alumno
Semana
Franja de días
Detalle del día
Almuerzo
Cafetería
...
Barra sticky inferior:
ítems + total + Ver/Continuar
```

No crear scroll horizontal de página completa.

---

# 7. FRANJA SEMANAL

Mostrar siempre:

**LUN | MAR | MIÉ | JUE**

Ejemplo:

```text
Semana del 27 al 30 de julio

‹        LUN 27   MAR 28   MIÉ 29   JUE 30        ›

         Cerrado     ·        ·        ·
```

## Cada celda/día debe poder expresar

- disponible;
- seleccionado;
- cerrado/cutoff;
- ya reservado;
- tiene almuerzo;
- tiene cafetería.

No llenar la celda de texto.

Usar pequeñas señales visuales.

Ejemplo conceptual:

```text
MAR
28
● Almuerzo
2 café
```

o equivalentes compactos.

## Día seleccionado

Debe quedar muy claro cuál día está activo.

El detalle debajo cambia inmediatamente al tocar otro día.

---

# 8. NAVEGACIÓN ENTRE SEMANAS

Permitir:

- semana anterior si corresponde;
- semana actual;
- semana siguiente.

No borrar lo seleccionado al cambiar de semana.

El usuario puede construir un solo pedido con varias semanas.

Mostrar etiqueta clara:

```text
27–30 jul
3–6 ago
10–13 ago
```

No hacer que navegar destruya carrito/selecciones.

---

# 9. FECHA ACTUAL Y CUTOFF

Mantener o adaptar la lógica existente.

Fecha de referencia:

**27-07-2026**

Si el cutoff del lunes ya pasó:

```text
LUN 27
Cerrado
```

No se puede añadir almuerzo a ese día.

Los días futuros siguen disponibles.

## Cafetería

Para simplificar la demo, aplicar el mismo estado general de disponibilidad del día a la preventa de cafetería, salvo que la implementación actual permita una regla separada sin complejidad.

No inventar un segundo sistema de cutoff.

---

# 10. DETALLE DEL DÍA

Al tocar un día disponible mostrar:

```text
MARTES 28 DE JULIO

ALMUERZO
...

CAFETERÍA
...
```

Solo mantener expandido/activo un día a la vez.

Las selecciones de otros días permanecen guardadas.

---

# 11. ALMUERZO

Mostrar información visualmente clara:

- concepto nutricional opcional;
- menú principal;
- alternativa vegetariana;
- acompañamientos;
- verde/ensalada;
- fruta/postre.

Ejemplo:

```text
Almuerzo del martes

Principal
Carne mechada

Alternativa vegetariana
Mix de verduras salteadas

Incluye
Papas doradas · Hortalizas · Fruta

$X
[ + Agregar almuerzo ]
```

No obligar al apoderado a elegir principal vs vegetariano.

La demo comunica disponibilidad, no reserva anticipada de variante.

---

# 12. ALMUERZO — ESTADOS

Máximo un almuerzo por:

**studentId + date**

Estados:

```text
+ Agregar almuerzo
```

```text
✓ Almuerzo agregado
```

Debe poder quitarse antes de pagar.

No permitir duplicados.

Si existe una reserva histórica pagada para esa fecha:

```text
✓ Ya reservado
```

y no permitir agregar otra.

---

# 13. TARIFA DIARIA

Dentro de una misma semana:

- 1 almuerzo → dailyLunchPrice
- 2 almuerzos → dailyLunchPrice
- 3 almuerzos → dailyLunchPrice

Ejemplo:

```text
LUN ✓
MAR ✓
MIÉ ✓
JUE -

3 × dailyLunchPrice
```

---

# 14. TARIFA SEMANAL

Una semana completa TerraVida es:

**LUN + MAR + MIÉ + JUE de la MISMA semana.**

Solo cuando los cuatro estén seleccionados:

- los cuatro pasan automáticamente a `weeklyLunchUnitPrice`;
- recalcular total instantáneamente;
- mostrar “Tarifa semanal aplicada”.

## NO HACER

No usar:

```text
cada 4 almuerzos = descuento
```

Ejemplo inválido:

```text
JUE semana A
LUN semana B
MAR semana B
MIÉ semana B
```

Son cuatro almuerzos, pero NO una semana completa.

---

# 15. SEMANAS COMPLETAS MÚLTIPLES

Evaluar cada semana de forma independiente.

Ejemplo:

```text
3–6 agosto
4/4
→ semanal

10–13 agosto
4/4
→ semanal
```

Total:

8 almuerzos con precio semanal porque son dos semanas completas.

---

# 16. BOTÓN RÁPIDO — RESERVAR SEMANA COMPLETA

Cuando los cuatro días de una semana futura estén disponibles:

```text
[ Reservar semana completa ]
```

Texto de apoyo:

> Agrega los almuerzos de lunes a jueves y aplica automáticamente la tarifa semanal.

Al tocar:

- agregar LUN;
- agregar MAR;
- agregar MIÉ;
- agregar JUE;
- recalcular a tarifa semanal;
- mantener cafetería intacta.

Debe existir una forma clara de deshacer.

Si se quita uno de los cuatro:

- desaparece tarifa semanal;
- los restantes vuelven a tarifa diaria.

---

# 17. SEMANA ACTUAL INCOMPLETA

Si un día de la semana ya cerró:

```text
LUN cerrado
MAR disponible
MIÉ disponible
JUE disponible
```

No mostrar “Reservar semana completa”.

Los días restantes son compras diarias.

---

# 18. INCENTIVO DE PRECIO

Cuando haya 3/4 almuerzos y el cuarto todavía esté disponible:

> Agrega 1 almuerzo más y se aplicará la tarifa semanal.

Discreto.

Sin popup.

Cuando complete:

> ✓ Tarifa semanal aplicada

Si quita uno:

> Tarifa diaria aplicada a los días restantes.

El comportamiento debe ser inmediato y fácil de entender.

---

# 19. CAFETERÍA

La cafetería vive dentro del mismo día.

El alumno NO necesita tener almuerzo.

Ejemplo válido:

```text
MIÉ 29

Almuerzo
Ninguno

Cafetería
Fajita ×1
Jugo ×1
```

Debe poder pagar ese pedido.

---

# 20. CATEGORÍAS DE CAFETERÍA

Mostrar chips/filtros horizontales:

```text
Todos
Sándwiches y wraps
Snacks
Horneados
Bebestibles
```

No crear menú lateral.

En móvil los chips pueden desplazarse horizontalmente.

Al cambiar categoría, filtrar productos sin cambiar de página.

---

# 21. PRODUCTOS DE CAFETERÍA

Usar una selección DEMO representativa.

Por ejemplo:

- Fajita TerraVida
- Sánguche TerraVida
- Vaso Energy
- Vaso de frutas
- Magdalenas
- Croissant
- Café
- Jugo

Cada producto:

- nombre;
- descripción breve;
- precio;
- acción de agregar;
- cantidad.

## Diseño

Inspirarse en experiencias premium de ordering:

```text
Fajita TerraVida
Hummus, tomate, palta, queso y choclo

$X                         [ Agregar ]
```

Después:

```text
$X                    [ − ] 1 [ + ]
```

No es obligatorio usar imágenes.

Priorizar rapidez y legibilidad.

---

# 22. CAFETERÍA — REGLAS

Cada producto queda asociado a:

- alumno;
- fecha;
- producto;
- cantidad;
- precio aplicado.

Los productos:

- no cuentan para tarifa semanal;
- no reciben descuento semanal;
- no cambian precio del almuerzo.

---

# 23. CARRITO / RESUMEN

El resumen debe ser entendible en segundos.

Agrupar:

**Semana → Día → Ítems**

Ejemplo:

```text
TU PEDIDO

27–30 julio

MAR 28
Almuerzo                           $X

JUE 30
Fajita ×1                          $X
Jugo ×1                            $X


3–6 agosto

Almuerzos LUN–JUE
✓ Tarifa semanal
4 × $X                             $X

MIÉ 5
Vaso de frutas ×1                  $X


TOTAL                              $XX.XXX
```

No listar información irrelevante.

---

# 24. CTA STICKY EN MÓVIL

Inspiración conceptual: ordering móvil de nivel premium.

Mostrar siempre abajo cuando haya items:

```text
6 ítems        $XX.XXX
[ Ver pedido / Continuar ]
```

El CTA no debe tapar contenido.

Agregar padding inferior suficiente.

Cuando carrito vacío, no mostrar barra o mostrar una acción deshabilitada discreta.

---

# 25. PRECIOS

Centralizar como mínimo:

```ts
dailyLunchPrice
weeklyLunchUnitPrice
cafeteriaProducts[]
```

No repetir precios hardcodeados por páginas.

## Cálculo

Semana parcial:

```text
lunchCount × dailyLunchPrice
```

Semana completa:

```text
4 × weeklyLunchUnitPrice
```

Cafetería:

```text
Σ unitPrice × quantity
```

Total:

```text
lunchSubtotal + cafeteriaSubtotal
```

---

# 26. MODELO DE DATOS

No es obligatorio usar exactamente estos nombres.

Sí debe existir información equivalente.

## Almuerzo

```text
studentId
date
weekId/weekStart
unitPriceApplied
pricingMode = daily | weekly
```

## Cafetería

```text
studentId
date
productId
productName
category
quantity
unitPrice
```

## Order

Debe conservar:

```text
id
studentId
purchasedAt
lunchItems[]
cafeteriaItems[]
lunchSubtotal
cafeteriaSubtotal
total
```

## Regla histórica

Una compra pagada debe conservar los precios aplicados.

Cambiar config después NO modifica órdenes antiguas.

---

# 27. PAGO

Mantener pago simulado.

Actualizar pantalla para mostrar pedido mixto.

Debe ser obvio:

- qué fechas tienen almuerzo;
- qué semanas tienen tarifa semanal;
- qué cafetería se compró;
- total.

No agregar campos de tarjeta.

Al confirmar:

- persistir pedido;
- generar estado operativo necesario;
- ir a confirmación.

---

# 28. CONFIRMACIÓN

Mostrar:

```text
✓ Pedido confirmado
```

Separar:

## Almuerzos

## Cafetería

Agrupar por fecha.

No mostrar objetos técnicos.

Incluir CTA opcional:

```text
Ver operación en Casino
```

si ya existe un acceso demo equivalente.

---

# 29. CAMBIO NECESARIO EN CASINO / COCINA

El nuevo carrito cambia la operación.

La pantalla `/panel` actual no debe continuar siendo solamente una lista de alumnos con “almuerzo”.

Debe evolucionar a:

**Operación del día**

Sin crear un sistema complejo.

---

# 30. ESTRUCTURA DEL PANEL OPERATIVO

Mantener `/panel` como única pantalla principal.

Agregar dos vistas internas:

```text
[ Preparación ] [ Entregas ]
```

No crear nuevas rutas salvo que sea claramente más simple con la arquitectura actual.

Valor inicial recomendado:

**Preparación**

porque es la vista más diferenciadora para la demo.

---

# 31. VISTA PREPARACIÓN

Objetivo:

> La cocina debe saber en pocos segundos qué tiene que preparar para el día.

Inspiración conceptual:

- “all-day counts” de Square KDS;
- agrupación de ítems;
- una sola fuente de verdad;
- alta densidad sin ruido.

## Encabezado de fecha

Usar una navegación compacta coherente con el apoderado:

```text
‹    LUN 27   MAR 28   MIÉ 29   JUE 30    ›
```

La fecha elegida controla toda la vista.

---

# 32. MÉTRICAS DE PREPARACIÓN

Mostrar una fila compacta:

```text
Almuerzos       54
Cafetería       21 ítems
Pedidos         63
Pendientes      47
```

No usar cuatro tarjetas gigantes.

Diseño compacto premium.

En móvil puede ser grid 2×2.

---

# 33. RESUMEN DE ALMUERZOS PARA COCINA

Como el apoderado NO selecciona anticipadamente principal/vegetariano, cocina NO debe inventar ese reparto.

Mostrar:

```text
ALMUERZOS

54 reservas
Menú del día:
Carne mechada
Alternativa vegetariana disponible
...
```

No mostrar:

```text
42 carne / 12 vegetariano
```

porque la demo no posee esa información.

Esto es importante.

---

# 34. RESUMEN DE CAFETERÍA PARA COCINA

Agregar una sección:

```text
CAFETERÍA — PREPARAR

Fajita TerraVida        8
Sánguche TerraVida      5
Vaso de frutas          4
Jugo                    11
...
```

Agrupar productos idénticos.

Mostrar cantidades grandes y fáciles de escanear.

Orden recomendado:

1. mayor cantidad;
2. luego resto.

También puede agruparse por categoría si mejora la lectura.

---

# 35. FILTROS DE PREPARACIÓN

Agregar chips simples:

```text
Todo
Almuerzos
Cafetería
```

Si está en Cafetería:

chips secundarios opcionales:

```text
Todo
Sándwiches
Snacks
Horneados
Bebestibles
```

No crear filtros que no aporten.

No usar dropdowns para tres opciones.

---

# 36. VISTA ENTREGAS

Objetivo:

> Encontrar rápidamente a un alumno y entregar todo lo que tiene para ese día.

Mantener la búsqueda actual.

Cada fila/ticket debe mostrar:

- alumno;
- curso;
- ítems del día;
- estado;
- acción.

Ejemplo:

```text
Martina Rojas
6° Básico

Almuerzo
Fajita ×1
Jugo ×1

Pendiente                       [ Entregar ]
```

Otro:

```text
Amanda Pérez
7° Básico

Fajita ×1
Vaso de frutas ×1

Pendiente                       [ Entregar ]
```

El segundo ejemplo demuestra cafetería sin almuerzo.

---

# 37. ESTADO DE ENTREGA

Para la demo, tratar todos los ítems del mismo alumno + fecha como un **paquete de entrega diario**.

La acción:

```text
Entregar
```

marca como entregado el conjunto correspondiente a ese alumno y fecha.

No es necesario implementar entrega parcial por producto.

Esto evita sobrearquitectura.

Debe impedir doble entrega.

Estado final:

```text
✓ Entregado · 13:06
```

---

# 38. FILTROS DE ENTREGAS

Mantener:

```text
Pendientes
Entregados
Todos
```

Agregar filtro de contenido:

```text
Todos
Con almuerzo
Con cafetería
```

Interpretación:

- Todos → cualquier pedido del día;
- Con almuerzo → paquetes que contienen almuerzo;
- Con cafetería → paquetes que contienen al menos un producto cafetería.

Una compra mixta puede aparecer en ambos filtros.

Mantener:

- búsqueda alumno/curso;
- filtro curso.

No agregar más filtros.

---

# 39. BÚSQUEDA

Mantener búsqueda instantánea.

Debe encontrar:

- nombre;
- apellido;
- curso.

Si es fácil con la implementación existente, también producto de cafetería.

No sacrificar estabilidad por esto último.

---

# 40. RESERVA MANUAL

Mantener “Agregar reserva”, pero adaptarla a la nueva semántica.

Para no ampliar demasiado:

la reserva manual continúa creando **un almuerzo manual** para alumno + fecha.

No agregar un formulario administrativo completo de cafetería.

Cambiar etiqueta si ayuda:

```text
+ Agregar almuerzo manual
```

Debe seguir evitando duplicados.

---

# 41. PEDIDOS DE CAFETERÍA EN ADMINISTRACIÓN

Como `/panel/pedidos` actualmente redirige, no construir un módulo completo nuevo.

La prioridad es que:

- cafetería aparezca en Preparación;
- cafetería aparezca en Entregas;
- el pedido quede persistido.

Si la arquitectura permite un detalle sencillo del pedido sin crear otro módulo, se puede incorporar.

No es requisito crear una gestión CRUD de pedidos.

---

# 42. PATRÓN PREMIUM DE COCINA

No copiar el tablero oscuro/colorido de un KDS de restaurante.

Adaptar sus PRINCIPIOS al colegio.

La pantalla TerraVida debe verse:

- clara;
- luminosa;
- profesional;
- legible a distancia;
- usable en tablet/notebook.

## Usar

- cifras grandes para producción;
- badges claros de Pendiente/Entregado;
- listados densos;
- chips de filtro;
- estados persistentes;
- separación por jerarquía.

## Evitar

- 10 colores de tickets;
- cronómetros si no aportan;
- drag & drop;
- prioridades;
- estaciones múltiples;
- alertas sonoras;
- conceptos propios de restaurante que TerraVida no necesita.

---

# 43. COMPONENTES VISUALES — CONSISTENCIA

Definir y reutilizar patrones locales existentes.

No añadir framework.

Mantener:

- `.surface`;
- botones existentes;
- fields;
- tokens actuales.

Puede ajustar componentes para lograr más calidad:

- date tile;
- filter chip;
- quantity stepper;
- product row;
- order summary;
- daily delivery row;
- production count row.

No crear docenas de componentes abstractos.

---

# 44. DETALLES DE UI/UX PREMIUM

## Estados

Todo elemento interactivo debe tener:

- default;
- hover cuando aplique;
- pressed;
- selected;
- disabled;
- focus-visible.

## Movimiento

Solo microtransiciones:

- color;
- borde;
- opacidad;
- pequeño desplazamiento.

No animaciones decorativas largas.

## Texto

Usar verbos directos:

- Agregar almuerzo
- Quitar
- Reservar semana completa
- Continuar al pago
- Entregar

Evitar lenguaje técnico:

- pricingMode;
- item;
- fulfillment;
- ticket.

Eso solo existe internamente.

---

# 45. ACCESIBILIDAD

Mantener:

- botones reales;
- labels;
- aria-pressed cuando corresponda;
- aria-live para cambios de precio/confirmación;
- focus visible;
- targets táctiles mínimos razonables;
- contraste suficiente.

No introducir controles personalizados inaccesibles.

---

# 46. PERSISTENCIA

Mantener `localStorage`.

Como la estructura de estado cambiará bastante, preferir una nueva versión de key:

```text
terravida-demo-state-v2
```

si esto evita inconsistencias con el estado anterior.

No gastar tiempo haciendo una migración compleja del estado v1.

Al restaurar datos iniciales debe volver toda la demo al seed correcto.

---

# 47. FIXTURES / DATOS DEMO

Actualizar datos iniciales para demostrar bien la nueva experiencia.

Necesitamos al menos:

## Día actual o siguiente

Una mezcla realista de:

- alumnos con almuerzo;
- alumnos con cafetería;
- alumnos mixtos;
- pendientes;
- entregados.

## Cafetería

Seed con varios productos para que Preparación muestre cantidades distintas.

Ejemplo conceptual:

```text
Fajita       8
Sánguche     5
Jugo         11
Fruta        4
```

No todos deben tener la misma cantidad.

---

# 48. NO INTRODUCIR INCONSISTENCIAS

Asegurar que:

- pedido;
- alumno;
- fecha;
- almuerzo;
- cafetería;
- entrega;

apunten al mismo conjunto de datos.

No crear seeds donde un pedido pertenece a un alumno y su entrega a otro.

---

# 49. CRITERIOS DE ACEPTACIÓN — APODERADO

## A1 — Almuerzo diario

```text
Alumno
→ MAR
→ Agregar almuerzo
→ tarifa diaria
→ pago
→ confirmación
```

---

## A2 — Cafetería sin almuerzo

```text
Alumno
→ MIÉ
→ no almuerzo
→ Fajita ×1
→ Jugo ×1
→ pago
→ confirmación
```

---

## A3 — Pedido mixto

```text
Alumno
→ MAR almuerzo
→ MAR Jugo
→ JUE Fajita
→ pago conjunto
```

---

## A4 — Semana rápida

```text
Semana futura
→ Reservar semana completa
→ LUN–JUE agregados
→ tarifa semanal
```

---

## A5 — Semana manual

```text
LUN + MAR + MIÉ
→ diaria

agregar JUE
→ semanal automática
```

---

## A6 — Romper semana

```text
LUN–JUE
→ semanal

quitar JUE
→ LUN–MIÉ vuelven a diaria
```

---

## A7 — Dos semanas

Dos semanas completas dentro del mismo carrito.

Cada una calcula semanal independientemente.

---

## A8 — No mezclar descuento

```text
JUE semana A
LUN+MAR+MIÉ semana B
```

No existe tarifa semanal.

---

## A9 — Semana actual cerrada

Lunes cerrado:

- no botón semana completa;
- MAR–JUE comprables;
- precio diario.

---

## A10 — Cafetería no altera descuento

3 almuerzos + cafetería:

los almuerzos siguen diarios.

---

## A11 — Persistencia

Crear carrito en varias semanas, recargar y conservar estado correctamente.

---

# 50. CRITERIOS DE ACEPTACIÓN — COCINA

## C1 — Pedido de almuerzo

Una compra nueva de almuerzo aparece en:

- conteo de Preparación;
- Entregas del día.

---

## C2 — Cafetería sin almuerzo

Compra:

```text
Fajita ×1
Jugo ×1
```

sin almuerzo.

Debe:

- incrementar agregados de Preparación;
- aparecer en Entregas del alumno;
- poder marcarse entregada.

---

## C3 — Pedido mixto

Alumno con:

- almuerzo;
- Fajita;
- Jugo.

Debe verse como un solo paquete diario en Entregas.

---

## C4 — Agregación

Si tres alumnos compran:

```text
Fajita 1
Fajita 2
Fajita 1
```

Preparación muestra:

```text
Fajita 4
```

No tres tickets separados en el resumen de producción.

---

## C5 — Filtros

Verificar:

Preparación:

- Todo
- Almuerzos
- Cafetería

Entregas:

- Pendientes
- Entregados
- Todos

y:

- Todos
- Con almuerzo
- Con cafetería

---

## C6 — Entrega

Marcar paquete diario:

```text
Pendiente → Entregado
```

Debe:

- registrar hora;
- impedir segunda entrega;
- actualizar métricas.

---

## C7 — Búsqueda

Buscar alumno por nombre/curso y encontrarlo inmediatamente.

---

## C8 — Reserva manual

Agregar almuerzo manual:

- crea reserva;
- aparece en conteos;
- aparece en Entregas;
- no permite duplicado.

---

# 51. CRITERIOS VISUALES

## Apoderado

Debe sentirse diseñado primero para teléfono.

Al abrirlo en móvil:

- semana visible sin esfuerzo;
- total siempre accesible;
- CTA claro;
- no hay secciones gigantes;
- productos legibles;
- cantidades fáciles de modificar.

## Cocina

En tablet/notebook:

- fecha clara;
- métricas visibles;
- resumen de producción escaneable;
- filtros evidentes;
- entrega rápida;
- no parece una tabla administrativa genérica.

## General

No debe parecer “generado por IA” por exceso de:

- cards;
- gradientes;
- badges;
- emojis;
- textos promocionales.

Debe parecer software operativo real.

---

# 52. VERIFICACIÓN TÉCNICA

Antes de terminar:

1. probar selección alumno;
2. probar navegación semanas;
3. probar cutoff;
4. probar almuerzo diario;
5. probar 3/4;
6. probar 4/4;
7. probar 4/4 → 3/4;
8. probar semana rápida;
9. probar varias semanas;
10. probar cafetería sin almuerzo;
11. probar carrito mixto;
12. probar cantidades cafetería;
13. probar pago;
14. probar confirmación;
15. probar persistencia;
16. probar Preparación;
17. probar agregación cafetería;
18. probar filtros Cocina;
19. probar Entregas;
20. probar entrega y doble entrega;
21. probar búsqueda;
22. probar reserva manual;
23. probar móvil;
24. probar tablet;
25. probar escritorio.

Luego ejecutar:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Corregir errores introducidos por este cambio.

---

# 53. PRIORIDAD SI HAY CONFLICTOS

Si aparece una decisión no especificada, priorizar en este orden:

1. coherencia funcional;
2. recorrido de demo;
3. simplicidad;
4. experiencia móvil del apoderado;
5. velocidad operativa de Cocina;
6. diseño;
7. elegancia técnica.

Nunca sacrificar funcionamiento por refactor o decoración.

---

# 54. DEFINICIÓN DE TERMINADO

Está terminado cuando:

- el nuevo flujo del apoderado funciona;
- tarifa semanal funciona por semana real;
- cafetería funciona sin almuerzo;
- pedido mixto funciona;
- pago/confirmación funciona;
- Cocina refleja cafetería y almuerzos;
- Preparación agrega cantidades;
- Entregas muestra paquetes diarios;
- filtros funcionan;
- doble entrega está bloqueada;
- persistencia funciona;
- responsive funciona;
- lint pasa;
- TypeScript pasa;
- build pasa;
- no se amplió el alcance.

Cuando se cumpla esto:

**DETENERSE.**

No continuar puliendo otras partes de la aplicación.

---

# PROMPT DE EJECUCIÓN — CLAUDE CODE / SONNET 5

Lee este archivo completo antes de modificar código.

Trabaja sobre la DemoTerravida existente.

Primero inspecciona la implementación actual y crea mentalmente un mapa mínimo de los archivos que realmente deben cambiar. Luego implementa todo este spec de forma autónoma.

El objetivo es una intervención controlada, no una reconstrucción.

Respeta especialmente:

- la lógica semanal LUN–JUE;
- cafetería comprable sin almuerzo;
- carrito mixto;
- precios históricos;
- Preparación agregada para cocina;
- Entregas por alumno + fecha;
- filtros;
- persistencia;
- diseño premium sobrio;
- alcance congelado.

No agregues funcionalidades no solicitadas.
No hagas refactors generales.
No introduzcas nuevas dependencias sin necesidad real.
No copies literalmente interfaces de terceros.

Trabaja hasta cumplir todos los criterios de aceptación.

Al finalizar ejecuta:

npm run lint
npx tsc --noEmit
npm run build

Corrige cualquier error causado por los cambios.

Cuando todo esté cumplido, detente y entrega un resumen breve de:
- archivos modificados;
- decisiones técnicas relevantes;
- verificaciones ejecutadas;
- cualquier limitación que siga siendo deliberadamente parte de la demo.
