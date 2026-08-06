# Casino Enbandeja — Demo

Demo comercial navegable de un sistema de pedidos para un casino escolar: el apoderado
reserva almuerzos y cafetería, paga de forma simulada, y el casino ve de inmediato qué
preparar y qué entregar.

Funciona completa en el navegador, sin backend ni instalación de servicios.

> **Casino Enbandeja es un casino ficticio.** Todos los datos —alumnos, cursos, menús,
> productos, precios y fechas— son de ejemplo y no corresponden a ningún establecimiento
> real. El pago es simulado: no hay pasarela, no se piden datos bancarios y no existe
> ninguna transacción.

## Flujos incluidos

### Apoderado

1. **Alumno** — selección dependiente de curso y alumno.
2. **Mi semana** — agenda de lunes a jueves. Por cada día se puede agregar el almuerzo y
   productos de cafetería con cantidad. Se navega entre semanas sin perder el pedido.
   - Tarifa diaria por defecto.
   - Al completar los cuatro días de una misma semana, se aplica automáticamente la tarifa
     semanal a esos almuerzos. La cafetería no participa de ese cálculo.
   - Los días fuera de plazo aparecen cerrados.
3. **Pago** — resumen agrupado por semana y día, y pago simulado.
4. **Confirmación** — detalle del pedido y acceso directo al panel.

### Casino (`/panel`)

- **Preparación** — cuántos almuerzos hay para el día, el menú correspondiente y la
  cafetería agregada por producto, para saber qué producir.
- **Entregas** — un paquete por alumno y fecha con todos sus ítems. Búsqueda por nombre o
  curso, filtros por estado y por contenido, y confirmación de entrega con hora.
- **Agregar almuerzo manual** — excepción operativa para casos fuera del flujo online.
- Conmutador de modo de corte, para poder mostrar en vivo el estado abierto y cerrado.

## Instalación y ejecución

Requiere Node.js compatible con Next.js 15 y npm.

```bash
npm install
```

```bash
npm run dev
```

Abrir `http://localhost:3000`.

Otros comandos:

```bash
npm run build
```

```bash
npm run start
```

```bash
npm run lint
```

## Notas

- El estado de la demo (pedidos y entregas) se guarda en el `localStorage` del navegador,
  de modo que sobreviva a una recarga durante una presentación.
- Al entrar aparece una vez por sesión un modal que aclara el carácter referencial de la
  demo.
- Para el detalle técnico —arquitectura, modelo de dominio, reglas de precio y limitaciones
  conocidas— ver [HANDOFF.md](HANDOFF.md).
