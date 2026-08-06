import type {
  CafeteriaCategory,
  CafeteriaProduct,
  DemoConfig,
  MenuDay,
  MenuWeek,
  Order,
  Student,
} from "@/types";

// Fecha de referencia "hoy" para esta demostración. Ficticia; solo da coherencia
// al corte de reservas y al listado operativo del día.
export const DEMO_TODAY = "2026-07-27";

export const cafeteriaCategoryLabels: Record<CafeteriaCategory, string> = {
  sandwiches: "Sándwiches y wraps",
  snacks: "Snacks",
  horneados: "Horneados",
  bebestibles: "Bebestibles",
};

export const courses: string[] = [
  "5° Básico",
  "6° Básico",
  "7° Básico",
  "8° Básico",
  "I° Medio",
  "II° Medio",
  "III° Medio",
  "IV° Medio",
];

const firstNames = [
  "Amanda", "Baltazar", "Colomba", "Domingo", "Esperanza",
  "Fabián", "Genoveva", "Horacio", "Ignacia", "Jerónimo",
  "Karen", "Leonor", "Maximiliano", "Nicole", "Osvaldo",
  "Paulina", "Quintín", "Rocío", "Segundo", "Tamara",
  "Ulises", "Valeska", "Wladimir", "Ximena", "Yolanda",
  "Zacarías", "Abigail", "Bernardo", "Carola", "Diego",
  "Estefanía", "Franco", "Graciela", "Hernán", "Iris",
  "Jocelyn", "Kevin", "Loreto", "Mauricio", "Natalia",
];

const surnames = [
  "Aguayo Rivas", "Barrientos Soto", "Contreras Muñoz", "Duarte León", "Escobar Pino",
  "Figueroa Ramos", "Guzmán Cortés", "Henríquez Bravo", "Iturra Campos", "Jofré Vega",
];

export const demoStudentId = "student-16";

export const students: Student[] = courses.flatMap((course, courseIndex) =>
  Array.from({ length: 5 }, (_, studentIndex) => {
    const globalIndex = courseIndex * 5 + studentIndex;
    const id = `student-${globalIndex + 1}`;
    const isDemoStudent = id === demoStudentId;
    return {
      id,
      name: isDemoStudent
        ? "Martina Rojas Fuentes"
        : `${firstNames[globalIndex]} ${surnames[globalIndex % surnames.length]}`,
      course,
      guardianName: isDemoStudent
        ? "Daniela Fuentes Soto"
        : `${firstNames[(globalIndex + 13) % firstNames.length]} ${surnames[(globalIndex + 4) % surnames.length]}`,
    };
  }),
);

const createDay = (
  date: string,
  dayName: string,
  main: string,
  vegetarian: string,
  sides: string[],
  dessert: string,
): MenuDay => ({ date, dayName, main, vegetarian, sides, dessert });

export const initialMenus: MenuWeek[] = [
  {
    id: "week-2026-07-27",
    label: "Semana del 27 al 30 de julio",
    shortLabel: "27–30 jul",
    startDate: "2026-07-27",
    endDate: "2026-07-30",
    days: [
      createDay("2026-07-27", "Lunes", "Pollo al jugo con arroz", "Guiso de lentejas", ["Ensalada surtida", "Puré de papas"], "Fruta de estación"),
      createDay("2026-07-28", "Martes", "Carne mechada", "Mix de verduras salteadas", ["Papas doradas", "Hortalizas"], "Fruta de estación"),
      createDay("2026-07-29", "Miércoles", "Pescado al horno", "Porotos verdes salteados", ["Puré rústico", "Ensalada verde"], "Fruta de estación"),
      createDay("2026-07-30", "Jueves", "Pollo al horno", "Cazuela de verduras", ["Arroz", "Papas cocidas"], "Postre de la casa"),
    ],
  },
  {
    id: "week-2026-08-03",
    label: "Semana del 3 al 6 de agosto",
    shortLabel: "3–6 ago",
    startDate: "2026-08-03",
    endDate: "2026-08-06",
    days: [
      createDay("2026-08-03", "Lunes", "Pavo al jugo", "Lasaña de verduras", ["Puré de zapallo", "Ensalada chilena"], "Fruta de estación"),
      createDay("2026-08-04", "Martes", "Vacuno a la plancha", "Guiso de garbanzos", ["Arroz", "Ensalada verde"], "Postre de la casa"),
      createDay("2026-08-05", "Miércoles", "Pollo arvejado", "Porotos granados", ["Puré rústico"], "Fruta de estación"),
      createDay("2026-08-06", "Jueves", "Merluza al horno", "Tortilla de zapallo italiano", ["Arroz primavera", "Ensalada surtida"], "Yogur"),
    ],
  },
  {
    id: "week-2026-08-10",
    label: "Semana del 10 al 13 de agosto",
    shortLabel: "10–13 ago",
    startDate: "2026-08-10",
    endDate: "2026-08-13",
    days: [
      createDay("2026-08-10", "Lunes", "Pastel de choclo", "Pastel de choclo vegetariano", ["Ensalada chilena"], "Fruta de estación"),
      createDay("2026-08-11", "Martes", "Pollo teriyaki", "Tofu salteado con verduras", ["Arroz", "Ensalada verde"], "Postre de la casa"),
      createDay("2026-08-12", "Miércoles", "Carne a la cacerola", "Tortilla de acelga", ["Puré rústico", "Ensalada surtida"], "Fruta de estación"),
      createDay("2026-08-13", "Jueves", "Charquicán con carne", "Charquicán vegetariano", ["Ensalada surtida"], "Fruta de estación"),
    ],
  },
];

export const cafeteriaProducts: CafeteriaProduct[] = [
  { id: "cafe-fajita", name: "Fajita TerraVida", description: "Pollo, palta, queso y pico de gallo", category: "sandwiches", price: 2600 },
  { id: "cafe-sanguche", name: "Sánguche TerraVida", description: "Jamón, queso y tomate en pan artesanal", category: "sandwiches", price: 2400 },
  { id: "cafe-energy", name: "Vaso Energy", description: "Mix de frutos secos y semillas", category: "snacks", price: 1800 },
  { id: "cafe-frutas", name: "Vaso de frutas", description: "Frutas de estación cortadas", category: "snacks", price: 1600 },
  { id: "cafe-magdalenas", name: "Magdalenas", description: "Pack de 3 unidades", category: "horneados", price: 1500 },
  { id: "cafe-croissant", name: "Croissant", description: "Croissant de mantequilla", category: "horneados", price: 1700 },
  { id: "cafe-cafe", name: "Café", description: "Café americano o con leche", category: "bebestibles", price: 1400 },
  { id: "cafe-jugo", name: "Jugo natural", description: "Jugo natural de fruta de estación", category: "bebestibles", price: 1300 },
];

// Valores demo. No corresponden a tarifas vigentes de Terravida.
export const initialConfig: DemoConfig = {
  dailyLunchPrice: 5200,
  weeklyLunchUnitPrice: 4700,
  bookingCutoff: "10:30",
  cutoffMode: "automatico",
};

const productById = (id: string) => cafeteriaProducts.find((product) => product.id === id)!;

const buildOrder = (
  index: number,
  studentId: string,
  lunchDates: string[],
  cafeteriaLines: { productId: string; quantity: number; date: string }[],
): Order => {
  const lunchItems = lunchDates.map((date) => ({
    studentId,
    date,
    weekId: initialMenus.find((week) => week.days.some((day) => day.date === date))!.id,
    unitPriceApplied: lunchDates.length === 4 ? initialConfig.weeklyLunchUnitPrice : initialConfig.dailyLunchPrice,
    pricingMode: (lunchDates.length === 4 ? "weekly" : "daily") as "weekly" | "daily",
    source: "online" as const,
  }));
  const cafeteriaItems = cafeteriaLines.map((line) => {
    const product = productById(line.productId);
    return {
      studentId,
      date: line.date,
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity: line.quantity,
      unitPrice: product.price,
    };
  });
  const lunchSubtotal = lunchItems.reduce((sum, item) => sum + item.unitPriceApplied, 0);
  const cafeteriaSubtotal = cafeteriaItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return {
    id: `order-seed-${index + 1}`,
    studentId,
    purchasedAt: new Date(Date.UTC(2026, 6, 20 + (index % 6), 13 + (index % 6), 15)).toISOString(),
    lunchItems,
    cafeteriaItems,
    lunchSubtotal,
    cafeteriaSubtotal,
    total: lunchSubtotal + cafeteriaSubtotal,
  };
};

const seedStudents = students.filter((student) => student.id !== demoStudentId);
const TODAY = DEMO_TODAY;

const lunchOnlyStudents = seedStudents.slice(0, 7);
const cafeteriaOnlyStudents = seedStudents.slice(7, 13);
const mixedStudents = seedStudents.slice(13, 19);
const weeklyStudent = seedStudents[19];

const cafeteriaCycle = [
  [{ productId: "cafe-jugo", quantity: 2, date: TODAY }],
  [{ productId: "cafe-fajita", quantity: 1, date: TODAY }],
  [{ productId: "cafe-magdalenas", quantity: 1, date: TODAY }, { productId: "cafe-cafe", quantity: 1, date: TODAY }],
  [{ productId: "cafe-frutas", quantity: 1, date: TODAY }],
  [{ productId: "cafe-sanguche", quantity: 1, date: TODAY }, { productId: "cafe-jugo", quantity: 1, date: TODAY }],
  [{ productId: "cafe-energy", quantity: 2, date: TODAY }],
];

const mixedCafeteriaCycle = [
  [{ productId: "cafe-jugo", quantity: 1, date: TODAY }],
  [{ productId: "cafe-fajita", quantity: 1, date: TODAY }],
  [{ productId: "cafe-croissant", quantity: 1, date: TODAY }],
  [{ productId: "cafe-frutas", quantity: 1, date: TODAY }],
  [{ productId: "cafe-jugo", quantity: 2, date: TODAY }],
  [{ productId: "cafe-cafe", quantity: 1, date: TODAY }],
];

const seedOrders: Order[] = [
  ...lunchOnlyStudents.map((student, index) => buildOrder(index, student.id, [TODAY], [])),
  ...cafeteriaOnlyStudents.map((student, index) =>
    buildOrder(lunchOnlyStudents.length + index, student.id, [], cafeteriaCycle[index % cafeteriaCycle.length]),
  ),
  ...mixedStudents.map((student, index) =>
    buildOrder(
      lunchOnlyStudents.length + cafeteriaOnlyStudents.length + index,
      student.id,
      [TODAY],
      mixedCafeteriaCycle[index % mixedCafeteriaCycle.length],
    ),
  ),
  ...(weeklyStudent
    ? [
        buildOrder(
          lunchOnlyStudents.length + cafeteriaOnlyStudents.length + mixedStudents.length,
          weeklyStudent.id,
          initialMenus[1].days.map((day) => day.date),
          [],
        ),
      ]
    : []),
];

export const initialOrders: Order[] = seedOrders;

const todaysPackageStudentIds = Array.from(
  new Set(
    seedOrders
      .flatMap((order) => [...order.lunchItems, ...order.cafeteriaItems])
      .filter((item) => item.date === TODAY)
      .map((item) => item.studentId),
  ),
);

export const initialDeliveries: Record<string, string> = Object.fromEntries(
  todaysPackageStudentIds
    .filter((_, index) => index % 2 === 0)
    .map((studentId, index) => [
      `${studentId}__${TODAY}`,
      new Date(Date.UTC(2026, 6, 27, 16, 30 + index)).toISOString(),
    ]),
);
