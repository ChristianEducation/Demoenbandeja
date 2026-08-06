# TERRAVIDA — Fuente pública confirmada y reglas de uso en la demo

## Fuente oficial
Documento público del Colegio Terravida, abril de 2026:

`https://colegioterravida.cl/wp-content/uploads/2026/04/ALMUERZOS-Y-CAFETERIA-TERRAVIDA.docx.pdf`

## Hechos confirmados que SÍ pueden orientar la demo

1. El servicio se presenta públicamente como **Casino: “CRECIENDO SANO”**.
2. Existe oferta de **servicios de almuerzos y cafetería**.
3. El almuerzo se publica por día con:
   - un concepto nutricional;
   - una opción proteica/principal;
   - una alternativa vegetal/vegetariana en varios días;
   - acompañamiento energético y verde;
   - fruta/postre diario.
4. Existen modalidades públicas de compra **diaria** y **semanal**.
5. En el proceso público actual aparecen **links separados de Mercado Pago** para pagar.
6. También existen alternativas de alimentación y cafetería, pero **cafetería NO forma parte del alcance de esta demo**, salvo decisión explícita posterior.

## Datos publicados que NO deben tratarse como datos vigentes de la demo

El PDF publica valores, enlaces de pago y una minuta concreta. Son evidencia válida de cómo funciona hoy la operación, pero la demo debe ser **atemporal y referencial**.

Por lo tanto:
- NO insertar los links reales `mpago.la` en la demo;
- NO presentar los precios publicados como “precio actual” o “tarifa vigente”;
- NO afirmar que la minuta del PDF es la minuta vigente al momento de la demostración;
- NO utilizar fechas reales de abril de 2026 como calendario operativo;
- NO incluir nombres de alumnos reales ni información personal real;
- NO introducir datos reales adicionales inferidos desde la web.

## Cómo usar los datos en fixtures

La demo puede usar **datos ficticios pero realistas**, inspirados en la estructura pública:

- nombres ficticios de alumnos;
- fechas ficticias cercanas y coherentes entre menú/reservas;
- menús de ejemplo con estructura tipo Terravida;
- valores demo claramente mock y centralizados en configuración;
- pago genérico simulado, sin proveedor.

Los textos deben evitar expresiones como “tarifa vigente”, “menú actual” o “datos reales”. Preferir:
- `Valor demo`
- `Menú de ejemplo`
- `Datos ficticios para demostración`

## Diario / Semanal / Mensual

La fuente pública confirma **Diario** y **Semanal**.

**Mensual** permanece en el alcance porque fue definido en el spec comercial de Ángel/Terravida, pero la fuente pública NO entrega un precio mensual.

Regla:
- no inventar una tarifa mensual real;
- para la demo, Mensual puede representar selección agrupada de días del mes y calcular el total usando reglas/fixtures de demostración centralizados;
- si existe descuento mensual, debe estar explícitamente marcado como valor demo/configurable y nunca como tarifa real confirmada.

## Menú del día + vegetariana

La demo no necesita copiar literalmente la minuta del PDF. Debe reproducir su lógica:

`preparación principal + alternativa vegetariana/vegetal + acompañamientos + fruta/postre`

Esto es preferible a arrastrar el modelo buffet de Alimenta.

## Alcance excluido

Aunque el documento tenga una sección completa de cafetería, no agregar:
- venta de snacks;
- carrito de cafetería;
- inventario;
- caja/POS;
- bebidas;
- productos individuales;
- stock.

Eso sería expansión de alcance.
