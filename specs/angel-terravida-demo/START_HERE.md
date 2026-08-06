# START HERE — Ángel / Terravida demo

## Objetivo
Implementar una demo comercial mock de Casino Terravida “CRECIENDO SANO” sobre la base de DemoAlimenta, sin convertirla en producto de producción.

## Orden obligatorio de lectura
1. `ALIMENTA_PROJECT_MEMORY.md`
2. `TERRAVIDA_SOURCE_OF_TRUTH.md`
3. `SPEC_CONSOLIDADO.md`
4. `specs/angel-terravida-demo/START_HERE.md`
5. `specs/angel-terravida-demo/tasks.md`
6. `specs/angel-terravida-demo/acceptance.md`
7. Inspeccionar el código real antes de editar.

## Rol del agente
Eres ejecutor del spec, no product manager.

No debes:
- ampliar alcance;
- agregar backend, Supabase, autenticación o pago real;
- crear Cocina, estadísticas, multicasino o dashboard corporativo;
- refactorizar por gusto;
- rehacer componentes útiles de Alimenta sin necesidad;
- inventar datos reales de Ángel/Terravida que no estén en el material entregado;
- copiar links reales de pago o presentar precios/minutas públicas como datos vigentes de la demo;
- sustituir decisiones del spec por otras que consideres mejores.

Sí debes:
- reutilizar la base Alimenta de forma selectiva;
- simplificar el store y navegación de manera vertical;
- mantener la demo navegable y persistente con `localStorage`;
- verificar cada fase antes de avanzar;
- ejecutar lint, TypeScript y build al final;
- corregir regresiones introducidas por tus cambios.

## Datos no especificados
Si un dato de negocio específico de Terravida no está definido o puede cambiar (precio vigente, nombres reales de alumnos, minuta vigente, horarios exactos, cutoff exacto), NO lo presentes como dato actual.

Para permitir una demo funcional, usa fixtures claramente ficticios y neutros. Centralízalos en `src/data/demo-data.ts`, marca valores/minutas como demo cuando corresponda y evita textos que impliquen vigencia real. Usa `TERRAVIDA_SOURCE_OF_TRUTH.md` solo para respetar la estructura operacional confirmada.

## Principio de implementación
La demo debe contar una historia completa en pocos minutos:

Apoderado → reserva → pago simulado → confirmación → Casino → listado diario actualizado.

La reserva manual del Casino debe ser una excepción operativa, no el flujo principal.

## Regla de convergencia
No declares terminado hasta que todos los criterios obligatorios de `acceptance.md` estén cumplidos y puedas reportar:

`CONVERGED / LISTA PARA MOSTRAR`
