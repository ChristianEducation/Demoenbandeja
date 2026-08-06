# TASKS — Ángel / Terravida demo

Ejecutar en orden. No comenzar una fase nueva si la anterior rompe build o el recorrido principal.

## Fase 0 — Baseline
- Ejecutar la demo Alimenta sin cambios.
- Confirmar `npm install`, `npm run lint`, `npx tsc --noEmit` y `npm run build`.
- Recorrer compra Alimenta → confirmación → Entregas para entender la conexión de estado.
- Identificar todos los puntos de branding y hardcodes Alimenta.

## Fase 1 — Reducir dominio y rutas
Objetivo: dejar solo las dos experiencias definidas por el spec.

Mantener/adaptar:
- `/`
- `/apoderado`
- flujo de reserva necesario bajo `/apoderado/**`
- `/panel` como entrada de Casino o redirigir a la vista operativa principal
- vista operativa del listado diario

Eliminar de navegación y retirar funcionalidad no requerida:
- Cocina (si existiera)
- estadísticas
- configuración extensa de Alimenta
- alumnos como módulo administrativo independiente
- pedidos como módulo independiente, salvo que una parte sea estrictamente necesaria para el flujo
- anulación/créditos de Alimenta
- editor de menú administrativo, salvo requerimiento explícito posterior
- multicasino

No dejar enlaces rotos ni acciones huérfanas.

## Fase 2 — Branding y sistema visual
- Sustituir Alimenta / Colegio Curimón por Casino Terravida · CRECIENDO SANO.
- Nueva `STORAGE_KEY`: `terravida-demo-state-v1`.
- Manrope en toda la interfaz; retirar Newsreader.
- Aplicar escala del spec:
  - portada 30–34 px máx.;
  - página 24–28 px;
  - sección 17–19 px;
  - body 14 px;
  - buttons 42–44 px;
  - inputs 40–42 px;
  - radius 10–12 px.
- Dirección: navy/ink + fondos cálidos/blancos + verde Terravida apagado + coral CTA; verde semántico solo éxito.
- Evitar cards gigantes y hero tipo landing.

## Fase 3 — Inicio mínimo
Implementar exactamente la intención:

- identidad: `Casino Terravida · CRECIENDO SANO`
- badge/leyenda: `Demo referencial`
- título: `Una forma más simple de gestionar los almuerzos`
- apoyo: `Reservas, pagos y listado diario reunidos en un mismo flujo.`
- acceso `APODERADOS — Reservar almuerzo`
- acceso `CASINO — Gestión diaria`
- footer/leyenda: `Reserva · Pago · Listado diario`

No agregar pricing, beneficios, testimonios, métricas, FAQ ni secciones de marketing.

## Fase 4 — Flujo Apoderado
Debe funcionar mobile-first.

Secuencia funcional:
1. Curso.
2. Alumno dependiente del curso.
3. Modalidad: Diario / Semanal / Mensual.
4. Selección de día(s) coherente con modalidad.
5. Visualización de menú por fecha, incluyendo preparación principal, alternativa vegetariana/vegetal, acompañamiento(s) y fruta/postre, inspirado en la estructura pública Terravida pero con fixtures de demostración.
6. Resumen de selección.
7. Pago online neutral simulado.
8. Confirmación.
9. La reserva confirmada debe aparecer inmediatamente en Casino usando el mismo store/localStorage.

Reglas:
- impedir confirmación sin alumno;
- impedir confirmación sin fecha(s);
- evitar duplicar reserva activa del mismo alumno para la misma fecha;
- cálculo de total derivado de cantidad de días × precio fixture/configurado;
- no pedir datos bancarios reales;
- no nombrar una pasarela específica;
- no usar links reales de Mercado Pago publicados por Terravida;
- no presentar precios o minutas públicas como vigentes;
- no conservar créditos/anulaciones de Alimenta salvo que estén exigidos explícitamente por el spec.

## Fase 5 — Casino: vista operativa principal
La pantalla principal del Casino debe ser el listado del día, no un dashboard de métricas.

Debe incluir:
- fecha operativa visible;
- resumen compacto: total/reservados y, si aplica, entregados/pendientes;
- buscador por alumno y/o curso;
- filtros útiles y compactos;
- listado consolidado del día;
- acción `+ Agregar reserva`;
- sección o acceso compacto a próximos almuerzos.

Cada fila debe priorizar densidad y lectura rápida. Evitar mosaicos de cards.

## Fase 6 — Reserva manual
Implementar `+ Agregar reserva` como excepción del Casino.

Mínimo:
- seleccionar curso;
- seleccionar alumno;
- fecha;
- modalidad o cantidad necesaria si corresponde;
- confirmar;
- prevenir duplicado alumno-fecha;
- actualizar el listado inmediatamente;
- persistir en localStorage.

No construir caja, facturación, CRM ni CRUD completo.

## Fase 7 — Hora de corte
Implementar hora de corte configurable solo en el nivel necesario para la demo.

- Centralizarla en configuración mock/store.
- La UI debe comunicar cuándo una fecha ya no admite reserva online.
- La reserva manual del Casino puede actuar como excepción, de acuerdo con el concepto del spec.
- No crear una pantalla de configuración compleja si basta con un control demo discreto o un valor centralizable.

## Fase 8 — Datos mock coherentes
- Leer `TERRAVIDA_SOURCE_OF_TRUTH.md`.
- Regenerar fixtures para Terravida; no reutilizar nombres/marca Curimón.
- Mantener el producto centrado en almuerzos; NO implementar cafetería aunque aparezca en la fuente pública.
- Respetar como patrón la lógica Terravida: principal + alternativa vegetariana/vegetal + acompañamientos + fruta/postre.
- Diario y Semanal están confirmados públicamente. Mensual pertenece al spec, pero no tiene precio público confirmado: no inventar tarifa real.
- Mantener IDs coherentes entre alumno, pedido/reserva y listado.
- Alinear fechas de reservas con fechas de menú.
- Incluir suficientes reservas seed para que Casino se vea realista sin saturar.
- Cualquier dato no confirmado debe ser claramente ficticio/neutro.

## Fase 9 — Responsive y pulido
Probar al menos:
- móvil ~390 px;
- tablet ~768–1024 px;
- notebook ~1366 px.

Verificar:
- sin overflow horizontal accidental;
- targets táctiles adecuados;
- formularios legibles;
- listado Casino usable en tablet/notebook;
- jerarquía visual compacta;
- estados hover/focus/disabled;
- modales cerrables y foco visible.

## Fase 10 — Verificación final
Ejecutar:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Después recorrer manualmente:
- Inicio → Apoderado → reserva diaria → pago → confirmación → Casino.
- Reserva semanal.
- Reserva mensual.
- Intento de duplicado.
- Hora de corte.
- `+ Agregar reserva` desde Casino.
- Recarga del navegador verificando persistencia.
- Restaurar/limpiar storage si existe mecanismo demo.

Solo después evaluar `acceptance.md` completo.
