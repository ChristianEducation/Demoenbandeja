# SPEC CONSOLIDADO — Ángel / Terravida v5 HARDENED

## Misión

Construir una demo 100% mock para Ángel / Casino Terravida “CRECIENDO SANO”.

Debe ser **mucho más pequeña que Palmares**, pero igual de profesional visualmente.

## Historia

```text
Apoderado
→ Curso
→ Alumno
→ Diario / Semanal / Mensual
→ Día(s)
→ Menú
→ Pago online simulado
→ Confirmación
```

```text
Casino
→ Almuerzos de hoy
→ Listado consolidado
→ Filtros
→ + Agregar reserva
→ Próximos almuerzos
```

## Problema que resuelve

Hoy existen pasos separados:

`link/transferencia + aviso + nombre/curso + archivo diario`

La demo los reúne en una sola operación.

## Decisiones cerradas

1. Solo dos vistas: Apoderado + Casino.
2. No Cocina.
3. No multicasino.
4. No dashboard corporativo.
5. No Supabase.
6. No backend.
7. No pasarela real.
8. Pago neutral simulado.
9. Hora de corte configurable.
10. Reserva manual como excepción.
11. Diario + Semanal + Mensual.
12. Menú del día + opción vegetariana/vegetal, siguiendo la estructura pública de Terravida sin copiar datos vigentes.
13. Nueva STORAGE_KEY: `terravida-demo-state-v1`.
14. Todo mock/localStorage.
15. Reutilizar Alimenta, pero simplificar agresivamente.
16. Manrope en todo.
17. Títulos compactos.
18. No cards gigantes.
19. Inicio como entrada a producto, no landing.
20. Casino centrado en el listado diario.

## Visual

La interfaz debe transmitir:

> pequeña + sobria + amable + profesional.

### Paleta

- Navy / ink
- Fondos cálidos y blancos
- Verde Terravida apagado como identidad secundaria
- Coral cálido para CTA
- Verde semántico solo éxito

### Tamaños

- Portada: 30–34 px máximo
- Título página: 24–28 px
- Sección: 17–19 px
- Body: 14 px
- Buttons: 42–44 px
- Inputs: 40–42 px
- Cards: radius 10–12 px

## Página de inicio

```text
Casino Terravida · CRECIENDO SANO                Demo referencial

Una forma más simple de gestionar los almuerzos
Reservas, pagos y listado diario reunidos en un mismo flujo.

APODERADOS           Reservar almuerzo                           →
CASINO               Gestión diaria                              →

Reserva · Pago · Listado diario
```

No más.

## Prompt para Codex

Lee primero `ALIMENTA_PROJECT_MEMORY.md`, luego `TERRAVIDA_SOURCE_OF_TRUTH.md`, después este `SPEC_CONSOLIDADO.md` y finalmente todos los documentos de `specs/angel-terravida-demo/` comenzando por `START_HERE.md`.

Antes de implementar, inspecciona la base Alimenta. Reutiliza únicamente los componentes que ayuden a construir la demo Terravida sin trasladar complejidad innecesaria.

La prioridad no es refactorizar Alimenta ni crear una arquitectura productiva. La prioridad es una demo comercial pequeña, funcional y visualmente profesional.

No construyas Cocina, multicasino, estadísticas, backend, Supabase ni pasarela real.

Sigue `tasks.md` por fases y no declares el trabajo terminado hasta completar `acceptance.md`.

Solo finalizar cuando puedas marcar:

**CONVERGED / LISTA PARA MOSTRAR**


## Regla de datos Terravida

La fuente pública oficial se usa para confirmar **estructura de operación**, no para congelar información vigente dentro de la demo.

La demo debe usar datos ficticios/referenciales y permanecer atemporal. No usar links reales de pago ni presentar precios/minutas publicados como valores actuales. Consultar `TERRAVIDA_SOURCE_OF_TRUTH.md`.
