let beeCount = 1;
let hiveCount = 1;
let honeyCount = 0;
let moneyCount = 0;
let salesCount = 0;

// Save game state to localStorage
function saveGameState() {
  const gameState = {
    beeCount,
    hiveCount,
    honeyCount,
    moneyCount,
    salesCount,
  };
  localStorage.setItem("gameState", JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
  const savedState = localStorage.getItem("gameState");
  if (savedState) {
    try {
      const gameState = JSON.parse(savedState);
      beeCount = gameState.beeCount || 1;
      hiveCount = gameState.hiveCount || 1;
      honeyCount = gameState.honeyCount || 0;
      moneyCount = gameState.moneyCount || 0;
      salesCount = gameState.salesCount || 0;
    } catch (error) {
      console.error("Failed to load game state:", error);
    }
  }
}

// Sets the input field value to a specific amount
function setAmount(inputId, value) {
  const inputField = document.getElementById(inputId);
  inputField.value = value;
}

// Multiplies the current input field value by a specific factor
function multiplyAmount(inputId, factor) {
  const inputField = document.getElementById(inputId);
  const currentValue = parseInt(inputField.value) || 0;

  if (factor === "max") {
    let maxValue = 0;

    switch (inputId) {
      case "buyBeeCount":
        maxValue = Math.floor(moneyCount / 10);
        break;
      case "sellHoneyCount":
        maxValue = honeyCount;
        break;
      case "buyHiveCount":
        maxValue = Math.min(Math.floor(moneyCount / 1000), Math.floor(honeyCount / 1000));
        break;
      case "buySalesCount":
        maxValue = Math.floor(moneyCount / 10000);
        break;
    }

    inputField.value = maxValue;
  } else {
    inputField.value = currentValue * factor;
  }
}
function updateCounts() {
  document.getElementById("beeCount").textContent = `Bees: 🐝${beeCount}`;
  document.getElementById("hiveCount").textContent = `Hives: 🏠${hiveCount}`;
  document.getElementById("honeyCount").textContent = `Honey: 🍯${honeyCount}`;
  document.getElementById("moneyCount").textContent = `Money: 💲${moneyCount}`;
  document.getElementById("salesCount").textContent = `Sales Team: 👩‍💼${salesCount}`;
  saveGameState();
}

function showErrorMessage(message) {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";
}

function hideErrorMessage() {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = "";
  errorMessageElement.style.display = "none";
}

function buySales() {
  const buySalesamount = parseInt(document.getElementById("buySalesCount").value);

  if (moneyCount >= 10000 * buySalesamount) {
    salesCount += buySalesamount;
    moneyCount -= 10000 * buySalesamount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("Not enough money to buy that many Sales People!");
  }
}

function buyBee() {
  const buyBeeamount = parseInt(document.getElementById("buyBeeCount").value);

  if (moneyCount >= 10 * buyBeeamount) {
    beeCount += buyBeeamount;
    moneyCount -= 10 * buyBeeamount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("Not enough money to buy that many bees!");
  }
}

function sellHoney() {
  const sellHoneyamount = parseInt(document.getElementById("sellHoneyCount").value);

  if (honeyCount > 0 && honeyCount >= sellHoneyamount) {
    moneyCount += 5 * sellHoneyamount;
    honeyCount -= 1 * sellHoneyamount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("You have no honey to sell!");
  }
}

function buyHive() {
  const buyHiveamount = parseInt(document.getElementById("buyHiveCount").value);

  if (moneyCount >= 1000 * buyHiveamount && honeyCount >= 1000 * buyHiveamount) {
    hiveCount += buyHiveamount;
    moneyCount -= 1000 * buyHiveamount;
    honeyCount -= 1000 * buyHiveamount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("Not enough money and honey to buy that many hives!");
  }
}

function getRandomEvent() {
  const events = [
    { message: "The queen bee lays a healthy batch of eggs! Bee population is significantly increased!", modifier: 0.3 },
    { message: "The bees discover a new nesting ground! Bee population is slightly increased.", modifier: 0.1 },
    { message: "Favorable weather conditions promote brood rearing. Bee population is minimally increased.", modifier: 0.05 },
    { message: "A new generation of worker bees emerges! Bee population is moderately increased.", modifier: 0.2 },
    { message: "The hive successfully swarms and establishes a new colony! Bee population is significantly increased.", modifier: 0.4 },
    { message: "A plentiful pollen source leads to increased brood rearing. Bee population is minimally increased.", modifier: 0.05 },
    { message: "The beekeeper adds a new feeder full of pollen substitute. Bee population is slightly increased.", modifier: 0.1 },
    { message: "A successful mite treatment eliminates Varroa infestation. Bee population recovers slightly.", modifier: 0.1 },
    { message: "A scout bee returns, unable to locate a new nectar source. No change in bee population.", modifier: 0 },
    { message: "The beekeeper performs a routine hive inspection. No change in bee population.", modifier: 0 },
    { message: "A light rain showers the area, providing some moisture for the bees. No change in bee population.", modifier: 0 },
    { message: "The bees spend a sunny day cleaning the hive and preparing for brood rearing. No change in bee population.", modifier: 0 },
    { message: "The hive experiences a natural fluctuation in bee population. No change in bee population.", modifier: 0 },
    { message: "A late frost damages nearby flowers, reducing pollen availability. Bee population is slightly decreased.", modifier: -0.1 },
    { message: "A strong windstorm disrupts the hive entrance, causing bee deaths. Bee population is minimally decreased.", modifier: -0.05 },
    { message: "A nearby pesticide application contaminates flowers, harming foraging bees. Bee population is moderately decreased.", modifier: -0.2 },
    { message: "The drone population reaches its peak, leading to increased competition for resources. Bee population is slightly decreased.", modifier: -0.1 },
    { message: "The queen bee's egg-laying slows down due to age. Bee population slowly decreases.", modifier: -0.1 },
    { message: "A skunk raids the hive, preying on bees. Bee population is moderately decreased.", modifier: -0.2 },
    { message: "A nearby wildfire destroys a significant amount of flowering plants. Bee population is heavily decreased!", modifier: -0.5 },
    { message: "A sudden cold snap reduces foraging activity and bee survival. Bee population is moderately decreased.", modifier: -0.2 },
    { message: "A malfunctioning feeder leaks and dsub-containerns some bees. Bee population is minimally decreased.", modifier: -0.05 },
    { message: "The beekeeper accidentally injures some bees during hive inspection. Bee population is minimally decreased.", modifier: -0.05 },
    { message: "A predator attacks the hive! Bee population is slightly decreased.", modifier: -0.1 },
    { message: "Varroa mites infest the hive! Bee population is moderately decreased.", modifier: -0.2 },
    { message: "A harsh winter reduces the bee population. Bee population is heavily decreased!", modifier: -0.5 },
  ];

  const randomIndex = Math.floor(Math.random() * events.length);
  const event = events[randomIndex];

  showErrorMessage(event.message);
  return event.modifier;
}

// Random Event
setInterval(function() {
  beeCount += Math.trunc(beeCount * getRandomEvent());
  updateCounts();
}, 600000); // 1 hour in milliseconds

// Bee production every hour
setInterval(function() {
  beeCount += hiveCount;
  updateCounts();
}, 10000); // 10 seconds in milliseconds

// Honey production every second
setInterval(function() {
  honeyCount += beeCount;

  if (honeyCount >= 5 * salesCount && salesCount > 0) {
    honeyCount -= salesCount * 5;
    moneyCount += salesCount * 4 * 5;
  }

  updateCounts();
}, 1000); // 1 second in milliseconds

// Dark Mode Toggle
document.getElementById("darkModeToggle").addEventListener("click", function() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  // Save preference to localStorage
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Apply saved theme on page load
document.addEventListener("DOMContentLoaded", function() {
  // Load game state on page load
  loadGameState();
  updateCounts();

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
});
