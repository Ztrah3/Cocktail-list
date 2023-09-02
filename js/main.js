import cocktailApiKey from "./apikey.mjs"


let transformedData
let userSearch


// Transform the data by mapping each drink and extracting its ingredients
const transformData = (drinks) => {
    return drinks.map((drink) => {
        const ingredients = []
        for (let i = 0; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`]
            const measure = drink[`strMeasure${i}`]
            if (ingredient && measure) {
                ingredients.push({ ingredient, measure })
            }
        }
        return {
            name: drink.strDrink,
            ingredients,
            guide: drink.strInstructions
        }
    })
}


// Display the drinks by dynamically creating HTML elements
const displayDrinks = (drinks) => {
    const container = document.getElementById('drinkContainer')


    // Clear the container before displaying the drinks
    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }


    // Loop through each drink and create a div element for display
    for (const drink of drinks) {
        const drinkDiv = document.createElement('div')
        drinkDiv.classList.add('drink')


        const formattedDrink = `
      <h3>Name: ${drink.name}</h3>
      <p>Ingredients: ${drink.ingredients.map(
            (ingredient) => `${ingredient.ingredient} - ${ingredient.measure}`
        ).join('<br>')}</p>
      <p>Guide: ${drink.guide}</p>
    `
        drinkDiv.id = 'drink'
        drinkDiv.innerHTML = formattedDrink
        container.appendChild(drinkDiv)
    }
}


// Fetch data from API using async/await
const fetchData = async () => {
    let url = `https://the-cocktail-db.p.rapidapi.com/search.php?s=${userSearch}`
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': cocktailApiKey,
            'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
        }
    }


    try {
        const response = await fetch(url, options)
        const result = await response.json()
        transformedData = transformData(result.drinks)
        const drinkDisplay = displayDrinks(transformedData)
    } catch (error) {
        console.error(error)
    }
}


// Store user input
const storeInput = () => {
    userSearch = document.getElementById("user-search").value
}


// Fetch all drinks based on user input
const fetchAllDrinks = () => {
    userSearch = ""
    fetchData()
}




// Get a random drink from the transformed data
const getRandomDrink = () => {
    const randomIndex = Math.floor(Math.random() * transformedData.length)
    const randomDrink = [transformedData[randomIndex]]
    displayDrinks(randomDrink)
}




// Display the currently stored drinks
const displayCurrentDrinks = () => {
    displayDrinks(transformedData)
}


fetchAllDrinks()

// Adding event listeners for user inputs 
document.getElementById('randomDrink').addEventListener('click', getRandomDrink)
document.getElementById('user-search').addEventListener('input', storeInput)
document.getElementById('user-search').addEventListener('input', fetchData)
document.getElementById('returnList').addEventListener('click', displayCurrentDrinks)