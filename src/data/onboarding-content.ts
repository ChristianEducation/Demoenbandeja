export interface TourStep {
  anchor?: string;
  title: string;
  body: string;
}

export const apoderadoTourSteps: TourStep[] = [
  {
    anchor: "week-strip",
    title: "Tu semana",
    body: "El servicio va de lunes a jueves. Toca un día para ver qué hay disponible.",
  },
  {
    anchor: "lunch-card",
    title: "El almuerzo del día",
    body: "Cada día trae un plato principal y una alternativa vegetariana. No hay que elegir entre los dos al reservar.",
  },
  {
    anchor: "lunch-card",
    title: "Cómo se calcula el precio",
    body: "Cada almuerzo se cobra al precio diario. Si completas los cuatro días de una misma semana, esos cuatro pasan solos a la tarifa semanal, que es más baja. La cafetería se cobra aparte y no entra en ese cálculo.",
  },
  {
    title: "Tu pedido",
    body: "Todo lo que agregues se junta en un resumen con el total siempre visible. Puedes cambiar de semana sin perderlo, y también comprar solo cafetería, sin almuerzo.",
  },
];

export const panelTourSteps: TourStep[] = [
  {
    anchor: "panel-date",
    title: "Todo depende del día",
    body: "Primero eliges la fecha. Preparación es la vista de la cocina; Entregas es la del mesón.",
  },
  {
    anchor: "panel-metrics",
    title: "Qué hay que preparar",
    body: "Cuántos almuerzos salen ese día y cuántas unidades de cada producto de cafetería, ya sumadas. No aparece un desglose entre principal y vegetariana porque los apoderados no eligen entre las dos al reservar.",
  },
  {
    anchor: "panel-entregas-tab",
    title: "Una fila por alumno",
    body: "Toca aquí para ver Entregas: cada fila junta todo lo que un alumno compró para el día —almuerzo y cafetería— y se entrega de una vez, con la hora registrada.",
  },
  {
    anchor: "panel-cutoff",
    title: "Esto es solo para la demostración",
    body: "Este control no forma parte del sistema real. Sirve para mostrar en vivo qué pasa cuando un día deja de aceptar reservas: es lo que hace aparecer \"Cerrado\" en la pantalla del apoderado.",
  },
];

export const infoTips = {
  weeklyRate:
    "La tarifa semanal se aplica cuando están los cuatro días —lunes a jueves— de una misma semana. Cuatro almuerzos repartidos entre dos semanas no la activan, y si quitas uno, los demás vuelven al precio diario. La cafetería nunca entra en este cálculo.",
  alreadyBooked: "Este alumno ya tiene un almuerzo pagado para esta fecha. No se puede reservar dos veces el mismo día.",
  pastDay: "Este día ya pasó.",
  cutoffReached: (cutoff: string) =>
    `Ya pasó la hora de corte de hoy (${cutoff}), así que este día no acepta más reservas online. El casino puede agregar el almuerzo a mano desde su panel.`,
  noFullWeek: "Esta semana no se puede reservar completa: alguno de sus días ya está cerrado o ya lo tienes reservado.",
  ordersMetric: "Cuenta a cuántos alumnos hay que entregarles algo ese día, no cuántas compras se hicieron. Si un alumno compró almuerzo y un jugo, es un solo pedido.",
  manualLunch: "Para casos puntuales: un alumno que llegó sin reserva, un pago hecho por fuera. Se salta la hora de corte y no permite duplicar un almuerzo que ya existe.",
  pendingFilterDefault: "La lista parte mostrando solo los pendientes. Cambia a “Todos” para ver también los que ya se entregaron.",
};
