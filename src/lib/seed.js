// Starter kitchen, read off the fridge photo and the notes on its door
// (Fridge_door_notes.png, Whats_in_the_Fridge.png). Used only on first run.
const i = (key, label, cat, extra = {}) => ({ key, label, cat, have: true, ...extra });

export const SEED_ITEMS = [
  i("spinach", "Spinach (use before Thu)", "produce", { useBy: 3, green: true }),
  i("lettuce", "Lettuce", "produce", { green: true }),
  i("peppers", "Bell peppers", "produce"),
  i("tomatoes", "Tomatoes", "produce"),
  i("onions", "Onions", "produce", { have: false, short: true }),
  i("grapes", "Grapes", "fruit"),
  i("apples", "Apples", "fruit"),
  i("oranges", "Oranges", "fruit"),
  i("milk", "Milk (not lactose-free)", "dairy", { note: "R wants the lactose-free one, the blue cap." }),
  i("cheddar", "Cheddar", "dairy"),
  i("yogurt", "Yogurt", "dairy"),
  i("eggs", "Eggs", "dairy", { have: false, short: true }),
  i("ham", "Deli ham", "meat"),
  i("chicken", "Chicken breasts", "meat"),
  i("tenders", "Chicken tenders (Leo's, Saturday)", "meat", { reserveDay: 5 }),
  i("beans", "Black beans", "protein"),
  i("peanut-butter", "Peanut butter", "protein", { peanuts: true }),
  i("broccoli", "Frozen broccoli", "frozen", { green: true }),
  i("peas", "Frozen peas", "frozen", { green: true }),
  i("pizza", "Frozen pizza", "frozen"),
  i("waffles", "Frozen waffles", "frozen"),
  i("tortillas", "Tortillas", "carb", { have: false, short: true }),
  i("bread", "Bread", "carb", { have: false, short: true }),
  i("ketchup", "Ketchup (a vegetable, per Sam)", "condiment"),
  i("pickles", "Pickles", "condiment"),
  i("salsa", "Salsa", "condiment"),
  i("ranch", "Ranch", "condiment"),
];

const d = (id, name, o) => ({ id, name, blurb: "", pantry: "", need: [], opt: [], veg: true, peanuts: false, eggs: false, plant: "no", swap: "", green: "none", salt: "med", onlyDay: null, ...o });

export const SEED_DISHES = [
  d("s1", "Cheesy broccoli-tree pasta", { blurb: "Pasta with broccoli 'trees' and melted cheddar on top.", mins: 25, pantry: "pasta, butter", need: ["broccoli", "cheddar"], plant: "swap", swap: "olive oil and beans instead of cheese", green: "sam", salt: "low" }),
  d("s2", "Spinach & bean quesadillas", { blurb: "Crisp tortillas folded over beans, cheddar and wilted spinach.", mins: 20, need: ["tortillas", "beans"], opt: ["spinach", "cheddar", "salsa", "peppers"], plant: "swap", swap: "skip the cheese on Maya's", green: "split", salt: "med" }),
  d("s3", "Tomato soup with hidden spinach", { blurb: "Blended tomato soup with the spinach whizzed in, plus grilled cheese.", mins: 35, pantry: "stock (veg), olive oil", need: ["tomatoes", "spinach"], opt: ["bread", "cheddar", "onions"], plant: "swap", swap: "dunk plain toast instead of grilled cheese", green: "hide", salt: "low" }),
  d("s4", "Black bean & pepper rice bowls", { blurb: "Rice, spiced beans, roasted peppers and salsa. Cheese on the side.", mins: 30, pantry: "rice, cumin", need: ["beans", "peppers"], opt: ["salsa", "cheddar", "lettuce"], plant: "yes", green: "split", salt: "low" }),
  d("s5", "Leo's chicken tenders", { blurb: "Oven-crisp tenders with ketchup, as promised on the fridge.", mins: 25, need: ["tenders"], opt: ["ketchup", "ranch"], veg: false, green: "none", salt: "high", onlyDay: 5, onlyNote: "Leo's chicken tenders, saved for Saturday. Hands off." }),
  d("s6", "Frozen pizza & side salad", { blurb: "Easy night. Salad for whoever wants it.", mins: 20, need: ["pizza"], opt: ["lettuce", "ranch"], green: "split", salt: "high" }),
  d("s7", "Breakfast-for-dinner waffles", { blurb: "Waffles, fruit and yogurt. Eggs if anyone picks some up.", mins: 15, need: ["waffles"], opt: ["grapes", "apples", "yogurt", "eggs"], eggs: true, plant: "swap", swap: "skip the yogurt and eggs", green: "none", salt: "low" }),
  d("s8", "Spinach & cheddar frittata", { blurb: "Uses up the spinach in one pan.", mins: 30, need: ["eggs", "spinach"], opt: ["cheddar", "peppers", "onions"], eggs: true, green: "visible", salt: "med" }),
  d("s9", "Ham & cheese melts", { blurb: "Toasted sandwiches with pickles on the side.", mins: 10, need: ["bread", "ham", "cheddar"], opt: ["pickles"], veg: false, green: "none", salt: "high" }),
  d("s10", "Peanut noodle stir-fry", { blurb: "Noodles in a peanut-butter sauce with crunchy veg.", mins: 25, pantry: "noodles, soy sauce", need: ["peanut-butter", "peppers"], opt: ["broccoli"], peanuts: true, plant: "yes", green: "visible", salt: "high" }),
  d("s11", "Sheet-pan chicken & peppers", { blurb: "Everything on one tray at 220°C.", mins: 45, pantry: "olive oil, paprika", need: ["chicken", "peppers"], opt: ["broccoli", "onions"], veg: false, green: "split", salt: "med" }),
];
