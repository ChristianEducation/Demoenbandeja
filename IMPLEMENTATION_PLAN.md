# Plan de implementación — Demo Alimenta Casinos

## Stack

- Next.js con App Router, TypeScript y Tailwind CSS.
- Componentes propios con iconografía SVG consistente mediante Lucide.
- Estado compartido en React Context con persistencia en `localStorage` para mantener la historia de la demo al navegar o recargar.
- Datos completamente mock; sin backend, autenticación, base de datos ni integraciones externas.

## Dirección visual

- Estética de hospitalidad operativa cálida: clara, confiable y contemporánea.
- Paleta marfil + verde bosque, con terracota como acento secundario.
- Tipografía humanista con contraste editorial, jerarquía marcada, superficies planas, separadores finos y animación breve orientada a feedback.
- Portal del apoderado optimizado para móvil; Entregas optimizada para tablet/notebook; panel adaptado mediante sidebar y drawer.

## Estructura

- `src/app`: rutas del portal y panel.
- `src/components`: componentes visuales, navegación, formularios, overlays y gráficos simples.
- `src/data`: estudiantes, ciclos, menús, pedidos y reservas mock.
- `src/store`: estado compartido y acciones de la demo.
- `src/lib`: formato CLP, fechas, búsqueda normalizada y reglas horarias.
- `src/types`: tipos de dominio.

## Componentes principales

- Identidad Alimenta, entrada con selección de perfil, stepper del apoderado, selector encadenado y tarjetas de día.
- Resumen de compra, pago simulado y confirmación.
- Shell responsive del panel, métricas, filtros, buscador y filas operativas de entregas.
- Confirmación de entrega, toast y bloqueo horario.
- Filas de pedidos y alumnos, editor semanal, estadísticas y configuración.
- Flujo de anulación de reservas futuras, generación de créditos y aplicación automática en la próxima compra.

## Estado compartido

- Estudiante y semana seleccionados.
- Días del pedido y última compra confirmada.
- Pedidos, reservas, anulaciones, créditos y entregas.
- Menús publicados/borradores.
- Precios por ciclo, horario de entrega, hora límite de anulación y modos de simulación.

La compra simulada genera un pedido y reservas que aparecen inmediatamente en Entregas. Confirmar una entrega registra la hora y actualiza el Resumen. Anular una reserva futura la retira de Entregas, la marca en Pedidos y acredita un almuerzo al estudiante.

## Orden de implementación

1. Base visual, tipos, configuración, datos mock y store.
2. Flujo comercial completo del apoderado.
3. Shell del panel y Entregas conectadas.
4. Resumen, Menú, Pedidos, Alumnos, Estadísticas y Configuración.
5. Pruebas funcionales, responsive, accesibilidad básica y pulido final.

## Referencias

Se revisaron de manera acotada los ZIP de PedidosAIS y Plataforma Almuerzos San Luis para comprender el flujo de anulación/créditos y la densidad operativa de sus listados. La identidad, componentes, código y diseño de esta demo siguen siendo nuevos y viven exclusivamente en `/app`.
