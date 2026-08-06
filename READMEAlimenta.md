# Alimenta Casinos — Demo comercial

Demo navegable para presentar la reserva, pago simulado y entrega de almuerzos escolares.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Recorrido recomendado

### Compra y entrega

1. Seleccionar **Familias y apoderados** y continuar.
2. Usar **Completar con Tomás para la demo**.
3. Elegir uno o más días.
4. Simular el pago.
5. Abrir **Entregas** desde la confirmación.
6. Buscar `tom gon` en la fecha comprada y confirmar la entrega.

### Anulación y créditos

1. Desde la entrada, abrir **Anular almuerzos**.
2. Usar **Usar Tomás**.
3. Anular la reserva futura del martes 11.
4. Confirmar que Tomás recibe 1 crédito.
5. Iniciar una nueva compra para Tomás y seleccionar un día.
6. Verificar que el crédito se aplica automáticamente y permite confirmar la reserva con total `$0`.

La compra, los menús, los precios, los créditos, las anulaciones y las entregas se conservan en el navegador mediante `localStorage`. Para volver al estado original, ir a **Panel → Configuración → Restaurar datos iniciales**.

No existen backend, autenticación, base de datos ni cobros reales.
