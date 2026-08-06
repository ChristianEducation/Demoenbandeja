# MODEL RUNBOOK — recomendación de ejecución

## Modelo recomendado
Primera opción: **Claude Sonnet 5 en Claude Code**, esfuerzo medio/alto.

Razón: este trabajo combina lectura de repo existente, eliminación vertical de funcionalidades, adaptación visual y ejecución multiarchivo. El spec ya toma las decisiones de producto; el modelo debe ejecutar y autocorregir.

Segunda opción: **Gemini 3.6 Flash High en Antigravity** para una ejecución más económica/rápida, especialmente después de endurecer el spec.

## Prompt de arranque — Sonnet 5 / Claude Code

Implementa la demo Ángel / Terravida siguiendo el spec entregado.

Reglas:
1. Lee en este orden: `ALIMENTA_PROJECT_MEMORY.md y TERRAVIDA_SOURCE_OF_TRUTH.md`, `SPEC_CONSOLIDADO.md`, `specs/angel-terravida-demo/START_HERE.md`, `tasks.md`, `acceptance.md`.
2. Antes de editar, inspecciona el repo Alimenta y mapea rutas/componentes/store/datos que vas a conservar, adaptar o eliminar.
3. No amplíes alcance y no inventes datos reales del cliente.
4. Ejecuta `tasks.md` por fases. Después de cada fase relevante, verifica que el recorrido principal siga funcionando.
5. Prioriza modificaciones mínimas y coherentes sobre reescrituras generales.
6. No declares terminado hasta pasar todos los criterios de `acceptance.md`, `npm run lint`, `npx tsc --noEmit` y `npm run build`.
7. Al final entrega un resumen corto: archivos modificados, decisiones tomadas por necesidad técnica, checks ejecutados y criterios pendientes. Si queda cualquier criterio obligatorio pendiente, NO escribas `CONVERGED / LISTA PARA MOSTRAR`.

## Prompt de arranque — Gemini 3.6 Flash High / Antigravity

Actúa como ejecutor estricto del spec, no como diseñador de producto.

Lee `ALIMENTA_PROJECT_MEMORY.md` → `SPEC_CONSOLIDADO.md` → `specs/angel-terravida-demo/START_HERE.md` → `tasks.md` → `acceptance.md` y después inspecciona el código.

Implementa las fases en orden. No agregues funcionalidades, arquitectura, backend ni módulos no pedidos. No inventes datos reales de Terravida. Reutiliza Alimenta solo cuando reduzca trabajo sin arrastrar complejidad.

Verifica continuamente el flujo Apoderado → reserva → pago simulado → confirmación → Casino. Antes de finalizar ejecuta lint, TypeScript y build y comprueba todos los criterios de acceptance.

Solo escribe `CONVERGED / LISTA PARA MOSTRAR` cuando no quede ningún criterio obligatorio pendiente.
