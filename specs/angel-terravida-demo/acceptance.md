# ACCEPTANCE — Ángel / Terravida demo

Todos los ítems marcados **OBLIGATORIO** deben pasar.

## A. Alcance
- [ ] **OBLIGATORIO** Solo existen dos experiencias principales visibles: Apoderado y Casino.
- [ ] **OBLIGATORIO** No hay Cocina.
- [ ] **OBLIGATORIO** No hay multicasino.
- [ ] **OBLIGATORIO** No hay dashboard corporativo.
- [ ] **OBLIGATORIO** No hay backend/Supabase/auth/pasarela real.
- [ ] **OBLIGATORIO** No se conservan módulos Alimenta fuera de alcance solo porque ya existían.

## B. Inicio
- [ ] **OBLIGATORIO** La portada es entrada compacta al producto, no landing comercial.
- [ ] **OBLIGATORIO** Muestra Terravida/CRECIENDO SANO y “Demo referencial”.
- [ ] **OBLIGATORIO** Presenta accesos claros a APODERADOS y CASINO.
- [ ] **OBLIGATORIO** No contiene secciones extra de marketing.

## C. Apoderado
- [ ] **OBLIGATORIO** Curso → Alumno funciona como selección dependiente.
- [ ] **OBLIGATORIO** Existen Diario, Semanal y Mensual.
- [ ] **OBLIGATORIO** Cada modalidad permite seleccionar fechas coherentes.
- [ ] **OBLIGATORIO** Se muestra menú del día con principal + alternativa vegetariana/vegetal + acompañamiento(s) + fruta/postre.
- [ ] **OBLIGATORIO** Existe resumen antes de pago.
- [ ] **OBLIGATORIO** Pago es neutral y simulado.
- [ ] **OBLIGATORIO** Confirmar crea reservas persistentes.
- [ ] **OBLIGATORIO** Las reservas aparecen en Casino sin recargar datos externos.
- [ ] **OBLIGATORIO** No se puede reservar alumno-fecha duplicado.

## D. Casino
- [ ] **OBLIGATORIO** La vista principal está centrada en almuerzos/listado del día.
- [ ] **OBLIGATORIO** Tiene búsqueda funcional.
- [ ] **OBLIGATORIO** Tiene filtros compactos útiles.
- [ ] **OBLIGATORIO** Tiene `+ Agregar reserva` funcional.
- [ ] **OBLIGATORIO** La reserva manual actualiza el listado inmediatamente.
- [ ] **OBLIGATORIO** Existen próximos almuerzos como información secundaria.
- [ ] **OBLIGATORIO** No se transforma en un dashboard de tarjetas gigantes.

## E. Corte y reglas
- [ ] **OBLIGATORIO** Existe una hora de corte centralizada/configurable.
- [ ] **OBLIGATORIO** El flujo online comunica/bloquea reservas fuera de regla.
- [ ] **OBLIGATORIO** La reserva manual del Casino sigue siendo una excepción operativa.

## F. Persistencia y consistencia
- [ ] **OBLIGATORIO** Usa `localStorage` con clave `terravida-demo-state-v1`.
- [ ] **OBLIGATORIO** Una recarga conserva reservas de la sesión demo.
- [ ] **OBLIGATORIO** IDs y relaciones entre alumno/reserva son coherentes.
- [ ] **OBLIGATORIO** Fechas de reservas y menús están alineadas.
- [ ] **OBLIGATORIO** No quedan textos visibles “Alimenta” o “Colegio Curimón”.
- [ ] **OBLIGATORIO** No se presentan datos no confirmados como hechos reales de Terravida.
- [ ] **OBLIGATORIO** No se usan links reales de Mercado Pago de Terravida.
- [ ] **OBLIGATORIO** Precios y menús del fixture no se presentan como vigentes/actuales.
- [ ] **OBLIGATORIO** No se implementa cafetería, snacks, POS o inventario por haber aparecido en la fuente pública.

## G. Diseño
- [ ] **OBLIGATORIO** Manrope es la tipografía de interfaz y titulares.
- [ ] **OBLIGATORIO** Paleta sigue navy/ink + cálidos + verde Terravida apagado + coral CTA.
- [ ] **OBLIGATORIO** Verde semántico se reserva para éxito.
- [ ] **OBLIGATORIO** Portada no supera ~34 px de título principal.
- [ ] **OBLIGATORIO** Títulos de página ~24–28 px.
- [ ] **OBLIGATORIO** Body ~14 px.
- [ ] **OBLIGATORIO** Buttons/inputs mantienen escala compacta indicada.
- [ ] **OBLIGATORIO** No hay cards gigantes ni exceso de aire heredado de una landing.

## H. Responsive / UX
- [ ] **OBLIGATORIO** Apoderado funciona correctamente en ~390 px.
- [ ] **OBLIGATORIO** Casino es usable en tablet/notebook.
- [ ] **OBLIGATORIO** No existe overflow horizontal accidental.
- [ ] **OBLIGATORIO** Estados disabled son claros.
- [ ] **OBLIGATORIO** Foco de teclado visible.

## I. Calidad técnica
- [ ] **OBLIGATORIO** `npm run lint` pasa.
- [ ] **OBLIGATORIO** `npx tsc --noEmit` pasa.
- [ ] **OBLIGATORIO** `npm run build` pasa.
- [ ] **OBLIGATORIO** No se introducen dependencias innecesarias para resolver UI simple.
- [ ] **OBLIGATORIO** No hay errores evidentes de consola durante el recorrido principal.

## J. Demo story
Un evaluador debe poder hacer en pocos minutos:

1. entrar como Apoderado;
2. seleccionar curso/alumno;
3. elegir modalidad y fecha(s);
4. revisar menú;
5. pagar de forma simulada;
6. confirmar;
7. entrar a Casino;
8. encontrar inmediatamente la reserva;
9. agregar una reserva manual adicional.

- [ ] **OBLIGATORIO** La historia completa funciona sin intervención de desarrollador.

## Condición final
Solo reportar:

`CONVERGED / LISTA PARA MOSTRAR`

cuando todos los ítems obligatorios estén marcados y los tres comandos de verificación pasen.
