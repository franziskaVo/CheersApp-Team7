// initializeCocktails.js
import { doc, setDoc } from "firebase/firestore";
import { db, cocktailrecipy } from "./firebase";

const initializeCocktails = async () => {
  try {
    await Promise.all([
      setDoc(doc(db, cocktailrecipy, "BM"), {
        name: "Belmont",
        alcohol: "alcoholic",
        glass: "White wine glass",
        ingredients: ["Orange juice", "Vodka", "Light rum", "Dark rum"],
        quantities: [
          "Orange juice - 1 shot",
          "Vodka - 1 shot",
          "Light rum - 2 shots",
          "Dark rum - 1 shot",
        ],
        instructions:
          "Blend with ice. Serve in a wine glass. Garnish with carrot.",
      }),
      setDoc(doc(db, cocktailrecipy, "CP"), {
        name: "Cranberry Punch",
        alcohol: "non alcoholic",
        glass: "Punch Bowl",
        ingredients: [
          "Ginger ale",
          "Almond flavoring",
          "Pineapple juice",
          "Sugar",
          "Cranberry juice",
        ],
        quantities: [
          "Ginger ale - 2 qt",
          "Almond flavoring - 1 tblsp",
          "Pineapple juice - 4 cups",
          "Sugar - 1 1/2 cup",
          "Cranberry juice - 4 cups ",
        ],
        instructions:
          "Combine first four ingredients. Stir until sugar is dissolved, chill. Then add ginger ale just before serving. Add ice ring to keep punch cold.",
      }),
      setDoc(doc(db, cocktailrecipy, "CasaB"), {
        name: "Casa Blanca",
        alcohol: "alcoholic",
        glass: "Cocktail glass",
        ingredients: [
          "Maraschino liqueur",
          "Lime juice",
          "Triple sec",
          "Light rum",
        ],
        quantities: [
          "Maraschino liqueur - 1 1/2 tsp",
          "Lime juice - 1 1/2 tsp",
          "Triple sec - 1 1/2 tsp",
          "Light rum - 2 oz ",
        ],
        instructions:
          "Shake all ingredients with ice, strain into a cocktail glass, and serve.",
      }),
      setDoc(doc(db, cocktailrecipy, "GT"), {
        name: "Gin Tonic",
        alcohol: "alcoholic",
        glass: "Highball glass",
        ingredients: ["Ice", "Lemon Peel", "Tonic Water", "Gin"],
        quantities: [
          "Ice - cubes",
          "Lemon Peel - 1 Slice",
          "Tonic Water - 10 cl",
          "Gin - 4 cl",
        ],
        instructions:
          "Fill a highball glass with ice, pour the gin, top with tonic water and squeeze a lemon wedge and garnish with a lemon wedge.",
      }),
      setDoc(doc(db, cocktailrecipy, "HS"), {
        name: "Hibiscus Sprizz",
        alcohol: "non alcoholic",
        glass: "Spritz glass",
        ingredients: [
          "Ice",
          "Chilled Hibiscus tea",
          "Sugar",
          "Orange Juice",
          "Rose Whater",
          "Sparkling Whater",
        ],
        quantities: [
          "Ice - cubes",
          "Chilled Hibiscus tea - 3 oz",
          "Sugar - 1/2 tsp",
          "Orange Juice - 1 oz",
          "Rose Whater - 1/4 tsp",
          "Sparkling Whater",
        ],
        instructions:
          "Prepare the tea and strain. Add sugar while tea is still warm. Set aside to chill. Fill a spriz glass with ice and pour in hibiscus tea, orange juice, and rose whater. Top with sparkling water. Stir gently and serve.",
      }),
      setDoc(doc(db, cocktailrecipy, "MMM"), {
        name: "Moscow Mule Mocktail",
        alcohol: "non alcoholic",
        glass: "Mug",
        ingredients: [
          "Crushed Ice",
          "Lime",
          "Mint Leaves",
          "Ginger Beer",
          "Alcohol-free Vodka",
        ],
        quantities: [
          "Ice - crusheds",
          "Lime - 1",
          "Mint Leaves - 8",
          "Ginger Beer - 1 cup",
          "Alcohol-free Vodka - 1 oz",
        ],
        instructions:
          "Press the lime in your mug. Clap the mint together in your hands and add to the mug. Add planty of crushed ice, than add your vodka. Add ginger beer and stir gently.",
      }),
      setDoc(doc(db, cocktailrecipy, "BB"), {
        name: "Bora Bora",
        alcohol: "non alcoholic",
        glass: "Highball glass",
        ingredients: [
          "Grenadine",
          "Lemon juice",
          "Passion fruit juice",
          "Pineapple juice",
        ],
        quantities: [
          "Grenadine - 1 cl",
          "Lemon juice - 1 cl",
          "Passion fruit juice - 6 cl",
          "Pineapple juice - 10 cl",
        ],
        instructions:
          "Prepare in a blender or shaker, serve in a highball glass on the rocks. Garnish with 1 slice of pineapple and one cherry.",
      }),
      setDoc(doc(db, cocktailrecipy, "BC"), {
        name: "Barracuda",
        alcohol: "alcoholic",
        glass: "Margarita glass",
        ingredients: [
          "Prosecco",
          "Lime Juice",
          "Pineapple Juice",
          "Galliano",
          "Rum",
        ],
        quantities: [
          "Prosecco - top up",
          "Lime Juice - 1 dash",
          "Pineapple Juice - 6 cl",
          "Galliano - 1.5 cl",
          "Rum - 4.5 cl",
        ],
        instructions:
          "Shake pour ingredients with ice. Strain into glass, top with Sparkling wine.",
      }),
      setDoc(doc(db, cocktailrecipy, "Caipi"), {
        name: "Caipirinha",
        alcohol: "alcoholic",
        glass: "Old-fashioned glass",
        ingredients: ["Cachaca", "Lime", "Sugar"],
        quantities: ["Cachaca - 2 1/2 oz", "Lime - 1", "Sugar - 2 tsp"],
        instructions:
          "Place lime and sugar into old fashioned glass and muddle (mash the two ingredients together using a muddler or a wooden spoon). Fill the glass with ice and add the CachaÁa",
      }),
      setDoc(doc(db, cocktailrecipy, "Cosmop"), {
        name: "Cosmopolitan",
        alcohol: "alcoholic",
        glass: "Cocktail glass",
        ingredients: ["Cranberry juice", "Cointreau", "Lime juice, Vodka"],
        quantities: [
          "Cranberry juice - 1/4 cup",
          "Cointreau - 1/4 oz",
          "Lime juice - 1/4 oz",
          "Vodka - 1 1/4 oz ",
        ],
        instructions:
          "Add all ingredients into cocktail shaker filled with ice. Shake well and double strain into large cocktail glass. Garnish with lime wheel",
      }),
      setDoc(doc(db, cocktailrecipy, "TS"), {
        name: "Tequila Sunrise",
        alcohol: "alcoholic",
        glass: "Highball glass",
        ingredients: ["Grenadine", "Orange juice", "Tequila"],
        quantities: ["Grenadine", "Orange juice", "Tequila - 2 measures "],
        instructions:
          "Pour the tequila and orange juice into glass over ice. Add the grenadine, which will sink to the bottom. Stir gently to create the sunrise effect. Garnish and serve.",
      }),
      setDoc(doc(db, cocktailrecipy, "RS"), {
        name: "Rum Sour",
        alcohol: "alcoholic",
        glass: "Whiskey sour glass",
        ingredients: [
          "Maraschino cherry",
          "Orange",
          "Sugar",
          "Lemon juice",
          "Light rum",
        ],
        quantities: [
          "Maraschino cherry - 1",
          "Orange - 1",
          "Sugar - 1/2 tsp superfine",
          "Lemon juice - 1 oz",
          "Light rum - 2 oz ",
        ],
        instructions:
          "In a shaker half-filled with ice cubes, combine the rum, lemon juice, and sugar. Shake well. Strain into a sour glass and garnish with the orange slice and the cherry.",
      }),
      setDoc(doc(db, cocktailrecipy, "PP"), {
        name: "Planterís Punch",
        alcohol: "alcoholic",
        glass: "Highball glass",
        ingredients: [
          "Angostura Bitters",
          "Sugar Syrup",
          "Grenadine",
          "Pineapple Juice",
          "Orange Juice",
          "Dark Rum",
        ],
        quantities: [
          "Angostura Bitters - 4 drops",
          "Sugar Syrup - 1 cl",
          "Grenadine - 1 cl",
          "Pineapple Juice - 3.5 cl",
          "Orange Juice - 3 cl",
          "Dark Rum - 4.5 cL",
        ],
        instructions:
          "Squeeze an orange and strain the juice. Put all the ingredients in a shaker filled with ice and shake for at least 12 seconds. Strain into a highball glass and decorate with a pineapple wedge or fruit of your choice.",
      }),
      setDoc(doc(db, cocktailrecipy, "NR"), {
        name: "Negroni",
        alcohol: "alcoholic",
        glass: "Old-fashioned glass",
        ingredients: ["Sweet Vermouth", "Campari", "Gin"],
        quantities: ["Sweet Vermouth - 1 oz", "Campari - 1 oz", "Gin - 1 oz"],
        instructions: "Stir into glass over ice, garnish and serve.",
      }),
      setDoc(doc(db, cocktailrecipy, "ML"), {
        name: "Mango Lassi",
        alcohol: "non alcoholic",
        glass: "Highball glass",
        ingredients: ["Water", "Sugar", "Yoghurt", "Mango"],
        quantities: [
          "Water - 1 cup iced",
          "Sugar - 1/2 cup",
          "Yoghurt - 2 cups",
          "Mango - 2",
        ],
        instructions:
          "Put it all in a blender and pour over crushed ice. You can also use other fruits like strawberries and bananas.",
      }),
    ]);
    console.log("Cocktails added successfully!");
  } catch (error) {
    console.error("Error adding cocktails: ", error);
  }
};

export default initializeCocktails;
