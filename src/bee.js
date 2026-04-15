let beeCount = 1;
let hiveCount = 1;
let plotCount = 1;
let honeyCount = 0;
let moneyCount = 0;
let salesCount = 0;
let managerCount = 1;
let marketerCount = 0;

const HIVES_PER_PLOT = 10;
const PLOT_COST = 1000000;
const SALES_COST = 10000;
const MANAGER_COST = 50000;
const MARKETER_COST = 20000;
const BASE_HONEY_SELL_PRICE = 5;
const MARKETER_PRICE_BONUS = 0.05;
const MANAGER_CUT_PER_HONEY_PER_MANAGER = 1;
const MAX_EVENT_LOG_ENTRIES = 20;

function getMaxBeeCapacity() {
  return hiveCount * 50;
}

function getMaxHiveCapacity() {
  return plotCount * HIVES_PER_PLOT;
}

function getMaxSalesAndMarketers() {
  return managerCount * 7;
}

function roundToCents(value) {
  return Math.round(value * 100) / 100;
}

function getHoneySellPricePerUnit() {
  return roundToCents(BASE_HONEY_SELL_PRICE * Math.pow(1 + MARKETER_PRICE_BONUS, marketerCount));
}

function getNetHoneyRevenuePerUnit() {
  return roundToCents(getHoneySellPricePerUnit() - managerCount * MANAGER_CUT_PER_HONEY_PER_MANAGER);
}

function clampBeeCount() {
  const maxBeeCapacity = getMaxBeeCapacity();
  if (beeCount > maxBeeCapacity) {
    beeCount = maxBeeCapacity;
  }
}

// Save game state to localStorage
function saveGameState() {
  const gameState = {
    beeCount,
    hiveCount,
    plotCount,
    honeyCount,
    moneyCount,
    salesCount,
    managerCount,
    marketerCount,
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
      plotCount = gameState.plotCount || 1;
      honeyCount = gameState.honeyCount || 0;
      moneyCount = gameState.moneyCount || 0;
      salesCount = gameState.salesCount || 0;
      managerCount = gameState.managerCount || 1;
      marketerCount = gameState.marketerCount || 0;
      clampBeeCount();
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
        maxValue = Math.min(Math.floor(moneyCount / 10), Math.max(0, getMaxBeeCapacity() - beeCount));
        break;
      case "sellHoneyCount":
        maxValue = honeyCount;
        break;
      case "buyHiveCount":
        maxValue = Math.min(
          Math.floor(moneyCount / 1000),
          Math.floor(honeyCount / 1000),
          Math.max(0, getMaxHiveCapacity() - hiveCount)
        );
        break;
      case "buySalesCount":
        maxValue = Math.min(
          Math.floor(moneyCount / SALES_COST),
          Math.max(0, getMaxSalesAndMarketers() - (salesCount + marketerCount))
        );
        break;
      case "buyManagerCount":
        maxValue = Math.floor(moneyCount / MANAGER_COST);
        break;
      case "buyMarketerCount":
        maxValue = Math.min(
          Math.floor(moneyCount / MARKETER_COST),
          Math.max(0, getMaxSalesAndMarketers() - (salesCount + marketerCount))
        );
        break;
      case "buyPlotCount":
        maxValue = Math.floor(moneyCount / PLOT_COST);
        break;
    }

    inputField.value = maxValue;
  } else {
    inputField.value = currentValue * factor;
  }
}
function updateCounts() {
  document.getElementById("beeCount").textContent = `Thousand Bees: 🐝${beeCount}`;
  document.getElementById("hiveCount").textContent = `Hives: 🏠${hiveCount}/${getMaxHiveCapacity()}`;
  document.getElementById("plotCount").textContent = `Plots of Land: 🌱${plotCount}`;
  document.getElementById("honeyCount").textContent = `Honey: 🍯${honeyCount}`;
  document.getElementById("moneyCount").textContent = `Money: 💲${moneyCount.toFixed(2)}`;
  document.getElementById("salesCount").textContent = `Sales Team: 👩‍💼${salesCount}`;
  document.getElementById("managerCount").textContent = `Managers: 🧑‍💼${managerCount}`;
  document.getElementById("marketerCount").textContent = `Marketers: 📣${marketerCount}`;
  document.getElementById("staffCap").textContent = `Sales + Marketers Capacity: ${salesCount + marketerCount}/${getMaxSalesAndMarketers()}`;
  document.getElementById("sellPrice").textContent = `Honey Sell Price: 💲${getHoneySellPricePerUnit().toFixed(2)} each`;
  document.getElementById("sellHoneyCardPrice").textContent = `(💲${getNetHoneyRevenuePerUnit().toFixed(2)})`;
  document.getElementById("managerCut").textContent = `Manager Cut: 💲${(managerCount * MANAGER_CUT_PER_HONEY_PER_MANAGER).toFixed(2)} total per glass`;
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

function getTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function addEventLogEntry(message) {
  const eventLogList = document.getElementById("eventLogList");
  if (!eventLogList) {
    return;
  }

  const listItem = document.createElement("li");
  const timestamp = document.createElement("span");

  timestamp.className = "event-log-time";
  timestamp.textContent = `[${getTimestamp()}]`;

  listItem.appendChild(timestamp);
  listItem.appendChild(document.createTextNode(message));
  eventLogList.prepend(listItem);

  while (eventLogList.children.length > MAX_EVENT_LOG_ENTRIES) {
    eventLogList.removeChild(eventLogList.lastElementChild);
  }
}

function resetGame() {
  const confirmed = window.confirm("Are you sure you want to reset your game progress?");

  if (!confirmed) {
    return;
  }

  beeCount = 1;
  hiveCount = 1;
  plotCount = 1;
  honeyCount = 0;
  moneyCount = 0;
  salesCount = 0;
  managerCount = 1;
  marketerCount = 0;

  localStorage.removeItem("gameState");

  setAmount("buyBeeCount", 1);
  setAmount("sellHoneyCount", 1);
  setAmount("buyHiveCount", 1);
  setAmount("buySalesCount", 1);
  setAmount("buyManagerCount", 1);
  setAmount("buyMarketerCount", 1);
  setAmount("buyPlotCount", 1);

  hideErrorMessage();
  updateCounts();
}

function buySales() {
  const buySalesamount = parseInt(document.getElementById("buySalesCount").value);
  const availableStaffSlots = getMaxSalesAndMarketers() - (salesCount + marketerCount);

  if (availableStaffSlots <= 0) {
    showErrorMessage("Staff capacity reached! Buy more managers to hire more Sales People or Marketers.");
    return;
  }

  if (buySalesamount > availableStaffSlots) {
    showErrorMessage(`You can only hire ${availableStaffSlots} more Sales People with your current managers.`);
    return;
  }

  if (moneyCount >= SALES_COST * buySalesamount) {
    salesCount += buySalesamount;
    moneyCount -= SALES_COST * buySalesamount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("Not enough money to buy that many Sales People!");
  }
}

function buyManager() {
  const buyManagerAmount = parseInt(document.getElementById("buyManagerCount").value);

  if (moneyCount >= MANAGER_COST * buyManagerAmount) {
    managerCount += buyManagerAmount;
    moneyCount -= MANAGER_COST * buyManagerAmount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("Not enough money to buy that many Managers!");
  }
}

function buyMarketer() {
  const buyMarketerAmount = parseInt(document.getElementById("buyMarketerCount").value);
  const availableStaffSlots = getMaxSalesAndMarketers() - (salesCount + marketerCount);

  if (availableStaffSlots <= 0) {
    showErrorMessage("Staff capacity reached! Buy more managers to hire more Marketers or Sales People.");
    return;
  }

  if (buyMarketerAmount > availableStaffSlots) {
    showErrorMessage(`You can only hire ${availableStaffSlots} more Marketers with your current managers.`);
    return;
  }

  if (moneyCount >= MARKETER_COST * buyMarketerAmount) {
    marketerCount += buyMarketerAmount;
    moneyCount -= MARKETER_COST * buyMarketerAmount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("Not enough money to buy that many Marketers!");
  }
}

function buyBee() {
  const buyBeeamount = parseInt(document.getElementById("buyBeeCount").value);
  const availableBeeCapacity = getMaxBeeCapacity() - beeCount;

  if (availableBeeCapacity <= 0) {
    showErrorMessage("Bee capacity reached! Buy more hives to hold more bees.");
    return;
  }

  if (buyBeeamount > availableBeeCapacity) {
    showErrorMessage(`You can only buy ${availableBeeCapacity} more bees with your current hives.`);
    return;
  }

  if (moneyCount >= 10 * buyBeeamount) {
    beeCount += buyBeeamount;
    moneyCount -= 10 * buyBeeamount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("Not enough money to buy that many bees!");
  }
}

function buyPlot() {
  const buyPlotAmount = parseInt(document.getElementById("buyPlotCount").value);

  if (moneyCount >= PLOT_COST * buyPlotAmount) {
    plotCount += buyPlotAmount;
    moneyCount -= PLOT_COST * buyPlotAmount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("Not enough money to buy that many plots!");
  }
}

function sellHoney() {
  const sellHoneyamount = parseInt(document.getElementById("sellHoneyCount").value);

  if (honeyCount > 0 && honeyCount >= sellHoneyamount) {
    moneyCount = roundToCents(moneyCount + getNetHoneyRevenuePerUnit() * sellHoneyamount);
    honeyCount -= 1 * sellHoneyamount;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("You have no honey to sell!");
  }
}

function buyHive() {
  const buyHiveamount = parseInt(document.getElementById("buyHiveCount").value);
  const availableHiveCapacity = getMaxHiveCapacity() - hiveCount;

  if (availableHiveCapacity <= 0) {
    showErrorMessage("Hive capacity reached! Buy another plot of land to place more hives.");
    return;
  }

  if (buyHiveamount > availableHiveCapacity) {
    showErrorMessage(`You can only buy ${availableHiveCapacity} more hives with your current plots.`);
    return;
  }

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

function reduceSales() {
  if (salesCount > 0) {
    salesCount -= 1;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("You have no Sales People to remove!");
  }
}

function reduceManager() {
  if (managerCount > 1) {
    const currentStaffCount = salesCount + marketerCount;
    const newMaxCapacity = (managerCount - 1) * 7;
    
    if (currentStaffCount > newMaxCapacity) {
      showErrorMessage(`You cannot remove this manager! You have ${currentStaffCount} sales/marketing staff but would only have capacity for ${newMaxCapacity}. Remove staff before removing this manager.`);
      return;
    }
    
    managerCount -= 1;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("You must have at least 1 Manager!");
  }
}

function reduceMarketer() {
  if (marketerCount > 0) {
    marketerCount -= 1;
    updateCounts();
    hideErrorMessage();
  } else {
    showErrorMessage("You have no Marketers to remove!");
  }
}

function getRandomEvent() {
  const events = [
    { kind: "bee", message: "The queen bee lays a healthy batch of eggs! Bee population is significantly increased!", modifier: 0.3 },
    { kind: "bee", message: "The bees discover a new nesting ground! Bee population is slightly increased.", modifier: 0.1 },
    { kind: "bee", message: "Favorable weather conditions promote brood rearing. Bee population is minimally increased.", modifier: 0.05 },
    { kind: "bee", message: "A new generation of worker bees emerges! Bee population is moderately increased.", modifier: 0.2 },
    { kind: "bee", message: "The hive successfully swarms and establishes a new colony! Bee population is significantly increased.", modifier: 0.4 },
    { kind: "bee", message: "A plentiful pollen source leads to increased brood rearing. Bee population is minimally increased.", modifier: 0.05 },
    { kind: "bee", message: "The beekeeper adds a new feeder full of pollen substitute. Bee population is slightly increased.", modifier: 0.1 },
    { kind: "bee", message: "A successful mite treatment eliminates Varroa infestation. Bee population recovers slightly.", modifier: 0.1 },
    { kind: "bee", message: "A scout bee returns, unable to locate a new nectar source. No change in bee population.", modifier: 0 },
    { kind: "bee", message: "The beekeeper performs a routine hive inspection. No change in bee population.", modifier: 0 },
    { kind: "bee", message: "A light rain showers the area, providing some moisture for the bees. No change in bee population.", modifier: 0 },
    { kind: "bee", message: "The bees spend a sunny day cleaning the hive and preparing for brood rearing. No change in bee population.", modifier: 0 },
    { kind: "bee", message: "The hive experiences a natural fluctuation in bee population. No change in bee population.", modifier: 0 },
    { kind: "bee", message: "A late frost damages nearby flowers, reducing pollen availability. Bee population is slightly decreased.", modifier: -0.1 },
    { kind: "bee", message: "A strong windstorm disrupts the hive entrance, causing bee deaths. Bee population is minimally decreased.", modifier: -0.05 },
    { kind: "bee", message: "A nearby pesticide application contaminates flowers, harming foraging bees. Bee population is moderately decreased.", modifier: -0.2 },
    { kind: "bee", message: "The drone population reaches its peak, leading to increased competition for resources. Bee population is slightly decreased.", modifier: -0.1 },
    { kind: "bee", message: "The queen bee's egg-laying slows down due to age. Bee population slowly decreases.", modifier: -0.1 },
    { kind: "bee", message: "A skunk raids the hive, preying on bees. Bee population is moderately decreased.", modifier: -0.2 },
    { kind: "bee", message: "A nearby wildfire destroys a significant amount of flowering plants. Bee population is heavily decreased!", modifier: -0.5 },
    { kind: "bee", message: "A sudden cold snap reduces foraging activity and bee survival. Bee population is moderately decreased.", modifier: -0.2 },
    { kind: "bee", message: "A malfunctioning feeder leaks and dsub-containerns some bees. Bee population is minimally decreased.", modifier: -0.05 },
    { kind: "bee", message: "The beekeeper accidentally injures some bees during hive inspection. Bee population is minimally decreased.", modifier: -0.05 },
    { kind: "bee", message: "A predator attacks the hive! Bee population is slightly decreased.", modifier: -0.1 },
    { kind: "bee", message: "Varroa mites infest the hive! Bee population is moderately decreased.", modifier: -0.2 },
    { kind: "bee", message: "A harsh winter reduces the bee population. Bee population is heavily decreased!", modifier: -0.5 },
    {
      kind: "money",
      message: "A new plot near a highway boosts foot traffic. Land value payout increases your cash.",
      amount: roundToCents(plotCount * 2500),
    },
    {
      kind: "money",
      message: "Property taxes hit your plots this season. You lose money on land upkeep.",
      amount: roundToCents(-plotCount * 1200),
    },
    {
      kind: "money",
      message: "A manager negotiates better supplier rates. Operations savings increase your cash.",
      amount: roundToCents(managerCount * 1800),
    },
    {
      kind: "money",
      message: "A manager-approved process mistake causes waste. Recovery costs reduce your cash.",
      amount: roundToCents(-managerCount * 1400),
    },
    {
      kind: "money",
      message: "Your marketers launch a successful local campaign. Honey demand surges.",
      amount: roundToCents(marketerCount * 2200),
    },
    {
      kind: "money",
      message: "An ad campaign underperforms this cycle. Marketing spend cuts into your cash.",
      amount: roundToCents(-marketerCount * 1600),
    },
    {
      kind: "money",
      message: "Sales People close a bulk retailer contract. You earn a strong one-time payment.",
      amount: roundToCents(salesCount * 2000),
    },
    {
      kind: "money",
      message: "A key buyer delays payment from the sales pipeline. Cash flow drops.",
      amount: roundToCents(-salesCount * 1500),
    },
    {
      kind: "money",
      message: "No major market news this cycle. Your cash remains steady.",
      amount: 0,
    },
  ];

  const randomIndex = Math.floor(Math.random() * events.length);
  return events[randomIndex];
}

// Unified random event system
setInterval(function() {
  const event = getRandomEvent();
  let eventMessage = event.message;

  if (event.kind === "bee") {
    beeCount += Math.trunc(beeCount * event.modifier);
    clampBeeCount();
  } else {
    moneyCount = roundToCents(Math.max(0, moneyCount + event.amount));
    const amountLabel = event.amount >= 0
      ? ` Money +$${event.amount.toFixed(2)}`
      : ` Money -$${Math.abs(event.amount).toFixed(2)}`;
    eventMessage += amountLabel;
  }

  showErrorMessage(eventMessage);
  addEventLogEntry(eventMessage);

  updateCounts();
}, 360000); // 6 minutes in milliseconds

// Bee production every hour
setInterval(function() {
  const availableBeeCapacity = getMaxBeeCapacity() - beeCount;
  if (availableBeeCapacity > 0) {
    beeCount += Math.min(hiveCount, availableBeeCapacity);
  }
  updateCounts();
}, 3600000); // 1 hour in milliseconds

// Honey production every second
setInterval(function() {
  honeyCount += beeCount;

  if (honeyCount >= 5 * salesCount && salesCount > 0) {
    const honeySoldBySales = salesCount * 5;
    honeyCount -= honeySoldBySales;
    moneyCount = roundToCents(moneyCount + getNetHoneyRevenuePerUnit() * honeySoldBySales);
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
  // Initialize Materialize tooltips
  const tooltips = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(tooltips);

  const resetButton = document.getElementById("resetGameButton");
  if (resetButton) {
    resetButton.addEventListener("click", resetGame);
  }

  // Load game state on page load
  loadGameState();
  updateCounts();

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
});
