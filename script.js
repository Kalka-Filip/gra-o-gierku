// Główne statystyki gospodarcze
let score = 0;
let gameStarted = false;
let selectedMapRegion = "capital";
let westernCurrency = 0;
let westernMachinesBought = false;
let westernLicenseBought = false;
let westernCreditBought = false;

// Statystyki Prestiżu (Prezydenci)
let presidentPoints = 0;
let electionsUnlocked = false; // Czy kupiono Wybory Prezydenckie

// Liczniki Prezydentów PRL
let giereks = 0;       
let jaruzelskis = 0;   
let walesas = 0;       

// Liczniki Prezydentów III RP (Nowa Era)
let kwasniewskis = 0;
let kaczynskis = 0;
let dudas = 0;

// Mechanika Strajków i Opozycji
let oppositionBought = false;
let oppositionCost = 50000;
let isStrikeActive = false;
let strikeCost = 0;

// Podatki i zobowiązania wobec ZSRR
const TAX_POLICIES = {
    balanced: {
        name: "Podatki na równo",
        incomeMultiplier: 1,
        strikeChance: 0.25
    },
    high: {
        name: "Wysokie podatki",
        incomeMultiplier: 1.35,
        strikeChance: 1.75
    }
};
const USSR_TRIBUTE_INTERVAL = 45;
let taxPolicy = "balanced";
let ussrTributeTimer = USSR_TRIBUTE_INTERVAL;
let ussrTributeDue = 50;
let missedUssrPayments = 0;
let ussrStatusMessage = "Moskwa czeka na przelew.";

// Kronika dnia - losowe wydarzenia z epoki
const CHRONICLE_INTERVAL = 30;
const CHRONICLE_EVENTS = [
    {
        key: "orangeDelivery",
        name: "Dostawa pomarańczy",
        description: "Na półkach pojawił się towar luksusowy. Ludzie klikają z nową energią.",
        duration: 24,
        type: "good",
        clickMultiplier: 2,
        bpsMultiplier: 1,
        strikeChanceModifier: -0.25,
        tributeMultiplier: 1
    },
    {
        key: "propagandaSuccess",
        name: "Propaganda sukcesu",
        description: "Dziennik pokazuje same sukcesy. Nastroje chwilowo się poprawiają.",
        duration: 28,
        type: "good",
        clickMultiplier: 1,
        bpsMultiplier: 1.1,
        strikeChanceModifier: -0.9,
        tributeMultiplier: 1
    },
    {
        key: "socialAction",
        name: "Czyn społeczny",
        description: "Załoga przyszła po godzinach i produkcja dostała krótkiego kopa.",
        duration: 22,
        type: "good",
        clickMultiplier: 1,
        bpsMultiplier: 1.25,
        strikeChanceModifier: 0,
        tributeMultiplier: 1
    },
    {
        key: "factoryFailure",
        name: "Awaria taśmy",
        description: "Maszyny stanęły, magazyn narzeka, a plan pięcioletni patrzy surowo.",
        duration: 20,
        type: "bad",
        clickMultiplier: 1,
        bpsMultiplier: 0.72,
        strikeChanceModifier: 0.55,
        tributeMultiplier: 1
    },
    {
        key: "moscowInspection",
        name: "Kontrola z Moskwy",
        description: "Towarzysze sprawdzają papiery. Danina może być większa niż zwykle.",
        duration: 26,
        type: "mixed",
        clickMultiplier: 1,
        bpsMultiplier: 0.9,
        strikeChanceModifier: 0.6,
        tributeMultiplier: 1.3
    }
];
let chronicleTimer = CHRONICLE_INTERVAL;
let activeEventKey = "";
let activeEventTimer = 0;
let chronicleMessage = "Centrala obserwuje sytuację. Następny meldunek już w drodze.";

// Ulepszenia: Zmienne (Ilość i Koszt podstawowy)
let workers = 0;         let workerCost = 10;
let ursuses = 0;         let ursusCost = 100;
let mines = 0;           let mineCost = 1000;
let steelworks = 0;      let steelworkCost = 5000;
let fiats = 0;           let fiatCost = 10000;
let blocks = 0;          let blockCost = 100000;

const MAP_BUILD_COSTS = {
    village: 250,
    city: 1500,
    factory: 750,
    pgr: 600,
    warehouse: 2500,
    shop: 4500,
    pewex: 12000
};
const WESTERN_UPGRADES = {
    machines: 5,
    license: 12,
    credit: 25
};
const MAP_REGION_KEYS = ["coast", "capital", "silesia", "malopolska", "south", "west"];
const MAP_REGIONS = {
    coast: {
        title: "Wybrzeże",
        empty: "Porty i stocznie czekają na pierwszą decyzję.",
        active: "Wybrzeże pracuje: wsie karmią region, miasta handlują, a fabryki dokładają produkcję."
    },
    capital: {
        title: "Mazowsze",
        empty: "Mazowsze czeka na wsie, miasta i nowe zakłady.",
        active: "Mazowsze napędza plan centralny i zbiera pierwsze efekty inwestycji."
    },
    silesia: {
        title: "Śląsk",
        empty: "Śląsk ma potencjał przemysłowy, ale trzeba go najpierw uruchomić.",
        active: "Śląsk dokłada ciężki przemysł i stabilne wpływy."
    },
    malopolska: {
        title: "Małopolska",
        empty: "Małopolska czeka na rozruch miast i zaplecza handlowego.",
        active: "Małopolska łączy produkcję z handlem i wzmacnia region."
    },
    south: {
        title: "Podkarpacie",
        empty: "Na południu są grunty pod wsie, PGR-y i fabryki.",
        active: "Podkarpacie rozwija wsie, miasta i produkcję."
    },
    west: {
        title: "Wielkopolska",
        empty: "Wielkopolska czeka na miasta, sklepy i handel z Zachodem.",
        active: "Wielkopolska szybko miesza produkcję, handel i Pewexy."
    }
};
let mapRegions = createDefaultMapRegions();

// Menu startowe
const startMenu = document.getElementById('start-menu');
const startContinueBtn = document.getElementById('start-continue-btn');
const startNewBtn = document.getElementById('start-new-btn');
const startSaveInfo = document.getElementById('start-save-info');

// Pobieranie elementów HTML - Statystyki ogólne
const scoreDisplay = document.getElementById('score');
const bpsDisplay = document.getElementById('bps');
const clickButton = document.getElementById('click-btn');
const westernCurrencyDisplay = document.getElementById('western-currency');
const presPointsDisplay = document.getElementById('pres-points');
const pendingPointsDisplay = document.getElementById('pending-points');

// Pobieranie elementów - Strajki
const strikeContainer = document.getElementById('strike-container');
const strikeCostDisplay = document.getElementById('strike-cost');
const resolveStrikeBtn = document.getElementById('resolve-strike-btn');

// Pobieranie elementów - Podatki i ZSRR
const taxPolicyNameDisplay = document.getElementById('tax-policy-name');
const taxIncomeBonusDisplay = document.getElementById('tax-income-bonus');
const strikeRiskDisplay = document.getElementById('strike-risk');
const taxBalancedBtn = document.getElementById('tax-balanced-btn');
const taxHighBtn = document.getElementById('tax-high-btn');
const ussrTimerDisplay = document.getElementById('ussr-timer');
const ussrTributeDisplay = document.getElementById('ussr-tribute');
const ussrStatusDisplay = document.getElementById('ussr-status');
const payUssrBtn = document.getElementById('pay-ussr-btn');

// Pobieranie elementów - Kronika dnia
const chroniclePanel = document.getElementById('chronicle-panel');
const eventNameDisplay = document.getElementById('event-name');
const eventDescDisplay = document.getElementById('event-desc');
const eventTimerLabel = document.getElementById('event-timer-label');
const eventTimerDisplay = document.getElementById('event-timer');
const eventEffectDisplay = document.getElementById('event-effect');

// Pobieranie elementów - Mapa planu
const mapRegionButtons = document.querySelectorAll('[data-map-region]');
const mapCountDisplays = {
    coast: document.getElementById('map-coast-level'),
    capital: document.getElementById('map-capital-level'),
    silesia: document.getElementById('map-silesia-level'),
    malopolska: document.getElementById('map-malopolska-level'),
    south: document.getElementById('map-south-level'),
    west: document.getElementById('map-west-level')
};
const mapFocusTitleDisplay = document.getElementById('map-focus-title');
const mapFocusDescDisplay = document.getElementById('map-focus-desc');
const activeRegionsCountDisplay = document.getElementById('active-regions-count');
const selectedVillagesCountDisplay = document.getElementById('selected-villages-count');
const selectedCitiesCountDisplay = document.getElementById('selected-cities-count');
const selectedFactoriesCountDisplay = document.getElementById('selected-factories-count');
const selectedPgrsCountDisplay = document.getElementById('selected-pgrs-count');
const selectedWarehousesCountDisplay = document.getElementById('selected-warehouses-count');
const selectedShopsCountDisplay = document.getElementById('selected-shops-count');
const selectedPewexesCountDisplay = document.getElementById('selected-pewexes-count');
const buildVillageBtn = document.getElementById('build-village-btn');
const buildCityBtn = document.getElementById('build-city-btn');
const buildMapFactoryBtn = document.getElementById('build-map-factory-btn');
const buildPgrBtn = document.getElementById('build-pgr-btn');
const buildWarehouseBtn = document.getElementById('build-warehouse-btn');
const buildShopBtn = document.getElementById('build-shop-btn');
const buildPewexBtn = document.getElementById('build-pewex-btn');
const villageCostDisplay = document.getElementById('village-cost');
const cityCostDisplay = document.getElementById('city-cost');
const mapFactoryCostDisplay = document.getElementById('map-factory-cost');
const pgrCostDisplay = document.getElementById('pgr-cost');
const warehouseCostDisplay = document.getElementById('warehouse-cost');
const shopCostDisplay = document.getElementById('shop-cost');
const pewexCostDisplay = document.getElementById('pewex-cost');
const westernPanel = document.getElementById('western-panel');
const westernStatusDisplay = document.getElementById('western-status');
const westernIncomeDisplay = document.getElementById('western-income');
const buyWestMachinesBtn = document.getElementById('buy-west-machines-btn');
const buyWestLicenseBtn = document.getElementById('buy-west-license-btn');
const buyWestCreditBtn = document.getElementById('buy-west-credit-btn');

// Przyciski Sklepu
const buyOppositionBtn = document.getElementById('buy-opposition-btn');
const oppositionStatus = document.getElementById('opposition-status');
const oppositionCostDisplay = document.getElementById('opposition-cost');

const buyWorkerBtn = document.getElementById('buy-worker-btn');
const workerCostDisplay = document.getElementById('worker-cost');
const workersCountDisplay = document.getElementById('workers-count');

const buyUrsusBtn = document.getElementById('buy-ursus-btn');
const ursusCostDisplay = document.getElementById('ursus-cost');
const ursusesCountDisplay = document.getElementById('ursuses-count');

const buyMineBtn = document.getElementById('buy-mine-btn');
const mineCostDisplay = document.getElementById('mine-cost');
const minesCountDisplay = document.getElementById('mines-count');

const buySteelworkBtn = document.getElementById('buy-steelwork-btn');
const steelworkCostDisplay = document.getElementById('steelwork-cost');
const steelworksCountDisplay = document.getElementById('steelworks-count');

const buyFiatBtn = document.getElementById('buy-fiat-btn');
const fiatCostDisplay = document.getElementById('fiat-cost');
const fiatsCountDisplay = document.getElementById('fiats-count');

const buyBlockBtn = document.getElementById('buy-block-btn');
const blockCostDisplay = document.getElementById('block-cost');
const blocksCountDisplay = document.getElementById('blocks-count');

// Elementy Prestiżu i Wyborów
const prestigeBtn = document.getElementById('prestige-btn');
const electionBtn = document.getElementById('election-btn');
const modernPresidentsSection = document.getElementById('modern-presidents-section');

const buyGierekBtn = document.getElementById('buy-gierek-btn');
const gierekCountDisplay = document.getElementById('gierek-count');
const buyJaruzelskiBtn = document.getElementById('buy-jaruzelski-btn');
const jaruzelskiCountDisplay = document.getElementById('jaruzelski-count');
const buyWalesaBtn = document.getElementById('buy-walesa-btn');
const walesaCountDisplay = document.getElementById('walesa-count');

// Nowi Prezydenci elementy
const buyKwasniewskiBtn = document.getElementById('buy-kwasniewski-btn');
const kwasniewskiCountDisplay = document.getElementById('kwasniewski-count');
const buyKaczynskiBtn = document.getElementById('buy-kaczynski-btn');
const kaczynskiCountDisplay = document.getElementById('kaczynski-count');
const buyDudaBtn = document.getElementById('buy-duda-btn');
const dudaCountDisplay = document.getElementById('duda-count');

// Obliczanie wartości kliknięcia
function getClickValue() {
    let baseClick = 1 + (giereks * 5);
    // Lech Kaczyński podwaja siłę kliknięcia za każdy posiadany poziom
    if (kaczynskis > 0) {
        baseClick *= (1 + kaczynskis);
    }

    if (westernLicenseBought) {
        baseClick *= 1.75;
    }

    return Math.floor(baseClick * getChronicleClickMultiplier());
}

// Obliczanie zysków na sekundę (BPS)
function calculateBps() {
    // Bonus Jaruzelskiego (+50% dla robotników)
    let workerBonus = 1 + (jaruzelskis * 0.5);
    let totalWorkers = workers * 1 * workerBonus;

    // Bonus Dudy (+30% dla Ursusów, Fiatów, Wielkiej Płyty)
    let dudaBonus = 1 + (dudas * 0.3);
    let totalUrsus = (ursuses * 10) * dudaBonus;
    let totalFiats = (fiats * 1000) * dudaBonus;
    let totalBlocks = (blocks * 10000) * dudaBonus;

    // Bonus Kwaśniewskiego (+50% dla Kopalń i Hut)
    let kwasniewskiBonus = 1 + (kwasniewskis * 0.5);
    let totalMines = (mines * 100) * kwasniewskiBonus;
    let totalSteelworks = (steelworks * 400) * kwasniewskiBonus;

    let totalMapProduction = calculateMapBps();
    let baseBps = totalWorkers + totalUrsus + totalMines + totalSteelworks + totalFiats + totalBlocks + totalMapProduction;
    
    // Globalne bonusy: Wałęsa (+25% za sztukę) + Opozycja (+50%)
    let globalMultiplier = 1 + (walesas * 0.25);
    if (oppositionBought) {
        globalMultiplier += 0.5;
    }

    if (westernCreditBought) {
        globalMultiplier += 0.4;
    }
    
    let taxMultiplier = TAX_POLICIES[taxPolicy].incomeMultiplier;
    let chronicleMultiplier = getChronicleBpsMultiplier();
    let finalBps = Math.floor(baseBps * globalMultiplier * taxMultiplier * chronicleMultiplier);

    // Redukcja dochodów przez STRAJK (Spadek o 50%)
    if (isStrikeActive) {
        finalBps = Math.floor(finalBps / 2);
    }

    return finalBps;
}

function getStrikeChance() {
    let chance = TAX_POLICIES[taxPolicy].strikeChance;

    if (oppositionBought) {
        chance += 2;
    }

    if (missedUssrPayments > 0) {
        chance += missedUssrPayments * 1.25;
    }

    chance += getChronicleStrikeModifier();

    return Math.max(0.05, chance);
}

function calculateUssrTribute() {
    let currentBps = calculateBps();
    return Math.max(50, Math.floor(((currentBps * 8) + (score * 0.04)) * getChronicleTributeMultiplier()));
}

function resetUssrTimer() {
    ussrTributeTimer = USSR_TRIBUTE_INTERVAL;
    ussrTributeDue = calculateUssrTribute();
}

function payUssrTribute(isManualPayment) {
    if (score >= ussrTributeDue) {
        score -= ussrTributeDue;
        missedUssrPayments = Math.max(0, missedUssrPayments - 1);
        ussrStatusMessage = isManualPayment
            ? "Danina zapłacona przed terminem. Moskwa chwilowo zadowolona."
            : "Danina zapłacona w terminie. ZSRR patrzy łaskawiej.";
        resetUssrTimer();
        return true;
    }

    if (!isManualPayment) {
        missedUssrPayments++;
        isStrikeActive = true;
        strikeCost = Math.max(500, Math.floor((calculateBps() + 1) * 12));
        ussrStatusMessage = "Nie było z czego zapłacić daniny. Naciski rosną, strajk wybucha.";
        resetUssrTimer();
    }

    return false;
}

function setTaxPolicy(policyKey) {
    taxPolicy = policyKey;
    ussrStatusMessage = policyKey === "high"
        ? "Podatki podniesione. Kasa rośnie, cierpliwość ludzi maleje."
        : "Podatki wróciły na równo. Mniej wpływów, spokojniejsze nastroje.";
    updateDisplay();
    saveGame();
}

function getActiveChronicleEvent() {
    return CHRONICLE_EVENTS.find((event) => event.key === activeEventKey) || null;
}

function getChronicleClickMultiplier() {
    let event = getActiveChronicleEvent();
    return event ? event.clickMultiplier : 1;
}

function getChronicleBpsMultiplier() {
    let event = getActiveChronicleEvent();
    return event ? event.bpsMultiplier : 1;
}

function getChronicleStrikeModifier() {
    let event = getActiveChronicleEvent();
    return event ? event.strikeChanceModifier : 0;
}

function getChronicleTributeMultiplier() {
    let event = getActiveChronicleEvent();
    return event ? event.tributeMultiplier : 1;
}

function describeEventEffect(event) {
    let effects = [];

    if (event.clickMultiplier !== 1) {
        effects.push(`kliknięcia x${event.clickMultiplier}`);
    }

    if (event.bpsMultiplier !== 1) {
        let bpsChange = Math.round((event.bpsMultiplier - 1) * 100);
        effects.push(`zarobki ${bpsChange > 0 ? "+" : ""}${bpsChange}%`);
    }

    if (event.strikeChanceModifier !== 0) {
        effects.push(`ryzyko strajku ${event.strikeChanceModifier > 0 ? "+" : ""}${event.strikeChanceModifier.toFixed(2)} pkt proc`);
    }

    if (event.tributeMultiplier !== 1) {
        let tributeChange = Math.round((event.tributeMultiplier - 1) * 100);
        effects.push(`danina dla ZSRR ${tributeChange > 0 ? "+" : ""}${tributeChange}%`);
    }

    return effects.length > 0 ? `Efekt: ${effects.join(", ")}.` : "Efekt: klimat epoki.";
}

function startChronicleEvent() {
    let event = CHRONICLE_EVENTS[Math.floor(Math.random() * CHRONICLE_EVENTS.length)];
    activeEventKey = event.key;
    activeEventTimer = event.duration;
    chronicleMessage = event.description;
}

function tickChronicle() {
    if (activeEventTimer > 0) {
        activeEventTimer--;

        if (activeEventTimer <= 0) {
            activeEventKey = "";
            chronicleTimer = CHRONICLE_INTERVAL;
            chronicleMessage = "Meldunek odłożony do archiwum. Kraj wraca do codziennego planu.";
        }

        return;
    }

    chronicleTimer--;

    if (chronicleTimer <= 0) {
        startChronicleEvent();
    }
}

function createDefaultMapRegions() {
    let regions = {};

    MAP_REGION_KEYS.forEach((regionKey) => {
        regions[regionKey] = {
            villages: 0,
            cities: 0,
            factories: 0,
            pgrs: 0,
            warehouses: 0,
            shops: 0,
            pewexes: 0
        };
    });

    return regions;
}

function normalizeMapRegions(savedRegions) {
    let normalized = createDefaultMapRegions();

    if (!savedRegions || typeof savedRegions !== "object") {
        return normalized;
    }

    MAP_REGION_KEYS.forEach((regionKey) => {
        if (!savedRegions[regionKey]) {
            return;
        }

        Object.keys(normalized[regionKey]).forEach((buildingKey) => {
            if (typeof savedRegions[regionKey][buildingKey] === "number") {
                normalized[regionKey][buildingKey] = savedRegions[regionKey][buildingKey];
            }
        });
    });

    return normalized;
}

function getSelectedRegionState() {
    return mapRegions[selectedMapRegion];
}

function getMapDevelopmentScore(regionKey) {
    let region = mapRegions[regionKey];

    if (!region) {
        return 0;
    }

    return region.villages + region.cities + region.factories + region.pgrs + region.warehouses + region.shops + region.pewexes;
}

function getTotalMapBuildings(buildingKey) {
    return MAP_REGION_KEYS.reduce((total, regionKey) => total + mapRegions[regionKey][buildingKey], 0);
}

function calculateMapBps() {
    let total = 0;

    MAP_REGION_KEYS.forEach((regionKey) => {
        let region = mapRegions[regionKey];
        total += region.villages * 3;
        total += region.cities * 12;
        total += region.factories * 50;
        total += region.pgrs * 15;
        total += region.warehouses * 60;
        total += region.shops * 90;
        total += region.pewexes * 120;
    });

    if (westernMachinesBought) {
        total *= 1.25;
    }

    return Math.floor(total);
}

function calculateWesternIncome() {
    let pewexes = getTotalMapBuildings("pewexes");
    return pewexes * 0.25;
}

function hasWesternCurrencyUnlocked() {
    return getTotalMapBuildings("pewexes") > 0;
}

function getMapBuildCost(action) {
    let baseCost = MAP_BUILD_COSTS[action];
    let buildingKey = getBuildingKeyForAction(action);
    let owned = getTotalMapBuildings(buildingKey);

    return Math.floor(baseCost * Math.pow(1.35, owned));
}

function getBuildingKeyForAction(action) {
    switch (action) {
        case "village": return "villages";
        case "city": return "cities";
        case "factory": return "factories";
        case "pgr": return "pgrs";
        case "warehouse": return "warehouses";
        case "shop": return "shops";
        case "pewex": return "pewexes";
        default: return "";
    }
}

function canBuildMapAction(action) {
    let region = getSelectedRegionState();

    if (!region) {
        return false;
    }

    if (action === "pgr") {
        return region.villages > 0;
    }

    if (action === "warehouse" || action === "shop" || action === "pewex") {
        return region.cities > 0;
    }

    return true;
}

function buyMapAction(action) {
    let buildingKey = getBuildingKeyForAction(action);
    let region = getSelectedRegionState();
    let cost = getMapBuildCost(action);

    if (!buildingKey || !region || !canBuildMapAction(action) || score < cost) {
        return;
    }

    score -= cost;
    region[buildingKey]++;

    if (action === "pewex") {
        chronicleMessage = "Pierwszy Pewex pachnie kawą, dżinsami i walutą zachodnią.";
    }

    updateDisplay();
    saveGame();
}

function buyWesternUpgrade(upgradeKey) {
    if (!hasWesternCurrencyUnlocked()) {
        return;
    }

    let cost = WESTERN_UPGRADES[upgradeKey];

    if (westernCurrency < cost) {
        return;
    }

    if (upgradeKey === "machines" && !westernMachinesBought) {
        westernCurrency -= cost;
        westernMachinesBought = true;
    }

    if (upgradeKey === "license" && !westernLicenseBought) {
        westernCurrency -= cost;
        westernLicenseBought = true;
    }

    if (upgradeKey === "credit" && !westernCreditBought) {
        westernCurrency -= cost;
        westernCreditBought = true;
    }

    updateDisplay();
    saveGame();
}

function hasSavedGame() {
    return localStorage.getItem("gierkoclickerSave") !== null;
}

function updateStartMenu() {
    if (hasSavedGame()) {
        startContinueBtn.textContent = "Kontynuuj plan";
        startNewBtn.style.display = "block";
        startSaveInfo.textContent = "Zapis odnaleziony w archiwum.";
    } else {
        startContinueBtn.textContent = "Rozpocznij plan";
        startNewBtn.style.display = "none";
        startSaveInfo.textContent = "Nowa karta w kronice.";
    }
}

function beginGame() {
    gameStarted = true;
    startMenu.classList.add("is-hidden");
    updateDisplay();
}

function resetGameState() {
    score = 0;
    presidentPoints = 0;
    electionsUnlocked = false;

    giereks = 0;
    jaruzelskis = 0;
    walesas = 0;
    kwasniewskis = 0;
    kaczynskis = 0;
    dudas = 0;
    westernCurrency = 0;
    westernMachinesBought = false;
    westernLicenseBought = false;
    westernCreditBought = false;

    oppositionBought = false;
    isStrikeActive = false;
    strikeCost = 0;
    taxPolicy = "balanced";
    ussrTributeTimer = USSR_TRIBUTE_INTERVAL;
    ussrTributeDue = 50;
    missedUssrPayments = 0;
    ussrStatusMessage = "Moskwa czeka na przelew.";

    chronicleTimer = CHRONICLE_INTERVAL;
    activeEventKey = "";
    activeEventTimer = 0;
    chronicleMessage = "Centrala obserwuje sytuację. Następny meldunek już w drodze.";

    workers = 0;        workerCost = 10;
    ursuses = 0;        ursusCost = 100;
    mines = 0;          mineCost = 1000;
    steelworks = 0;     steelworkCost = 5000;
    fiats = 0;          fiatCost = 10000;
    blocks = 0;         blockCost = 100000;

    mapRegions = createDefaultMapRegions();
    selectedMapRegion = "capital";
    strikeContainer.style.display = "none";
}

function selectMapRegion(regionKey) {
    if (!MAP_REGIONS[regionKey]) {
        return;
    }

    selectedMapRegion = regionKey;
    updateMap();
    saveGame();
}

function updateMap() {
    let activeRegions = 0;

    mapRegionButtons.forEach((button) => {
        let regionKey = button.dataset.mapRegion;
        let count = getMapDevelopmentScore(regionKey);

        if (mapCountDisplays[regionKey]) {
            mapCountDisplays[regionKey].textContent = count;
        }

        if (count > 0) {
            activeRegions++;
        }

        button.classList.toggle("online", count > 0);
        button.classList.toggle("hot", count >= 10);
        button.classList.toggle("selected", regionKey === selectedMapRegion);
    });

    let selectedRegion = MAP_REGIONS[selectedMapRegion];
    let selectedState = getSelectedRegionState();
    let selectedCount = getMapDevelopmentScore(selectedMapRegion);

    mapFocusTitleDisplay.textContent = selectedRegion.title;
    mapFocusDescDisplay.textContent = selectedCount > 0 ? selectedRegion.active : selectedRegion.empty;
    activeRegionsCountDisplay.textContent = activeRegions;

    selectedVillagesCountDisplay.textContent = selectedState.villages;
    selectedCitiesCountDisplay.textContent = selectedState.cities;
    selectedFactoriesCountDisplay.textContent = selectedState.factories;
    selectedPgrsCountDisplay.textContent = selectedState.pgrs;
    selectedWarehousesCountDisplay.textContent = selectedState.warehouses;
    selectedShopsCountDisplay.textContent = selectedState.shops;
    selectedPewexesCountDisplay.textContent = selectedState.pewexes;

    villageCostDisplay.textContent = getMapBuildCost("village");
    cityCostDisplay.textContent = getMapBuildCost("city");
    mapFactoryCostDisplay.textContent = getMapBuildCost("factory");
    pgrCostDisplay.textContent = getMapBuildCost("pgr");
    warehouseCostDisplay.textContent = getMapBuildCost("warehouse");
    shopCostDisplay.textContent = getMapBuildCost("shop");
    pewexCostDisplay.textContent = getMapBuildCost("pewex");

    buildVillageBtn.disabled = score < getMapBuildCost("village");
    buildCityBtn.disabled = score < getMapBuildCost("city");
    buildMapFactoryBtn.disabled = score < getMapBuildCost("factory");
    buildPgrBtn.disabled = !canBuildMapAction("pgr") || score < getMapBuildCost("pgr");
    buildWarehouseBtn.disabled = !canBuildMapAction("warehouse") || score < getMapBuildCost("warehouse");
    buildShopBtn.disabled = !canBuildMapAction("shop") || score < getMapBuildCost("shop");
    buildPewexBtn.disabled = !canBuildMapAction("pewex") || score < getMapBuildCost("pewex");

    updateWesternPanel();
}

function updateWesternPanel() {
    let unlocked = hasWesternCurrencyUnlocked();
    westernPanel.classList.toggle("locked", !unlocked);
    westernStatusDisplay.textContent = unlocked
        ? "Pewex działa. Dolary płyną z handlu z Zachodem."
        : "Zablokowana. Otwórz pierwszy Pewex, żeby zdobywać dolary.";
    westernIncomeDisplay.textContent = calculateWesternIncome().toFixed(1);

    buyWestMachinesBtn.disabled = !unlocked || westernMachinesBought || westernCurrency < WESTERN_UPGRADES.machines;
    buyWestLicenseBtn.disabled = !unlocked || westernLicenseBought || westernCurrency < WESTERN_UPGRADES.license;
    buyWestCreditBtn.disabled = !unlocked || westernCreditBought || westernCurrency < WESTERN_UPGRADES.credit;

    buyWestMachinesBtn.textContent = westernMachinesBought
        ? "Importowane maszyny kupione"
        : `Importowane maszyny (${WESTERN_UPGRADES.machines} $)`;
    buyWestLicenseBtn.textContent = westernLicenseBought
        ? "Licencja technologiczna kupiona"
        : `Licencja technologiczna (${WESTERN_UPGRADES.license} $)`;
    buyWestCreditBtn.textContent = westernCreditBought
        ? "Zachodni kredyt uruchomiony"
        : `Zachodni kredyt (${WESTERN_UPGRADES.credit} $)`;
}

// Obsługa głównego przycisku
clickButton.addEventListener('click', () => {
    if (!gameStarted) {
        return;
    }

    score += getClickValue();
    updateDisplay();
});

startContinueBtn.addEventListener('click', () => {
    beginGame();
});

startNewBtn.addEventListener('click', () => {
    if (hasSavedGame() && !confirm("Czy rozpocząć nową grę i usunąć obecny zapis?")) {
        return;
    }

    localStorage.removeItem("gierkoclickerSave");
    resetGameState();
    beginGame();
    saveGame();
});

mapRegionButtons.forEach((button) => {
    button.addEventListener('click', () => {
        selectMapRegion(button.dataset.mapRegion);
    });
});

buildVillageBtn.addEventListener('click', () => { buyMapAction("village"); });
buildCityBtn.addEventListener('click', () => { buyMapAction("city"); });
buildMapFactoryBtn.addEventListener('click', () => { buyMapAction("factory"); });
buildPgrBtn.addEventListener('click', () => { buyMapAction("pgr"); });
buildWarehouseBtn.addEventListener('click', () => { buyMapAction("warehouse"); });
buildShopBtn.addEventListener('click', () => { buyMapAction("shop"); });
buildPewexBtn.addEventListener('click', () => { buyMapAction("pewex"); });
buyWestMachinesBtn.addEventListener('click', () => { buyWesternUpgrade("machines"); });
buyWestLicenseBtn.addEventListener('click', () => { buyWesternUpgrade("license"); });
buyWestCreditBtn.addEventListener('click', () => { buyWesternUpgrade("credit"); });

// KUPOWANIE ZWYKŁYCH BUDYNKÓW
buyWorkerBtn.addEventListener('click', () => {
    if (score >= workerCost) { score -= workerCost; workers++; workerCost = Math.floor(workerCost * 1.5); updateDisplay(); }
});
buyUrsusBtn.addEventListener('click', () => {
    if (score >= ursusCost) { score -= ursusCost; ursuses++; ursusCost = Math.floor(ursusCost * 1.5); updateDisplay(); }
});
buyMineBtn.addEventListener('click', () => {
    if (score >= mineCost) { score -= mineCost; mines++; mineCost = Math.floor(mineCost * 1.5); updateDisplay(); }
});
buySteelworkBtn.addEventListener('click', () => {
    if (score >= steelworkCost) { score -= steelworkCost; steelworks++; steelworkCost = Math.floor(steelworkCost * 1.5); updateDisplay(); }
});
buyFiatBtn.addEventListener('click', () => {
    if (score >= fiatCost) { score -= fiatCost; fiats++; fiatCost = Math.floor(fiatCost * 1.5); updateDisplay(); }
});
buyBlockBtn.addEventListener('click', () => {
    if (score >= blockCost) { score -= blockCost; blocks++; blockCost = Math.floor(blockCost * 1.5); updateDisplay(); }
});

// KUPOWANIE OPOZYCJI
buyOppositionBtn.addEventListener('click', () => {
    if (score >= oppositionCost && !oppositionBought) {
        score -= oppositionCost;
        oppositionBought = true;
        updateDisplay();
    }
});

// PODATKI I DANINA DLA ZSRR
taxBalancedBtn.addEventListener('click', () => { setTaxPolicy("balanced"); });
taxHighBtn.addEventListener('click', () => { setTaxPolicy("high"); });
payUssrBtn.addEventListener('click', () => {
    if (payUssrTribute(true)) {
        updateDisplay();
        saveGame();
    }
});

// ROZWIĄZYWANIE STRAJKU
resolveStrikeBtn.addEventListener('click', () => {
    if (score >= strikeCost) {
        score -= strikeCost;
        isStrikeActive = false;
        strikeContainer.style.display = "none";
        updateDisplay();
    }
});

// KUPOWANIE PREZYDENTÓW PRL
buyGierekBtn.addEventListener('click', () => {
    if (presidentPoints >= 1) { presidentPoints -= 1; giereks++; updateDisplay(); saveGame(); }
});
buyJaruzelskiBtn.addEventListener('click', () => {
    if (presidentPoints >= 5) { presidentPoints -= 5; jaruzelskis++; updateDisplay(); saveGame(); }
});
buyWalesaBtn.addEventListener('click', () => {
    if (presidentPoints >= 15) { presidentPoints -= 15; walesas++; updateDisplay(); saveGame(); }
});

// ODBLOKOWANIE WYBORÓW PREZYDENCKICH
electionBtn.addEventListener('click', () => {
    if (presidentPoints >= 5 && !electionsUnlocked) {
        presidentPoints -= 5;
        electionsUnlocked = true;
        updateDisplay();
        saveGame();
    }
});

// KUPOWANIE NOWYCH PREZYDENTÓW
buyKwasniewskiBtn.addEventListener('click', () => {
    if (presidentPoints >= 3) { presidentPoints -= 3; kwasniewskis++; updateDisplay(); saveGame(); }
});
buyKaczynskiBtn.addEventListener('click', () => {
    if (presidentPoints >= 6) { presidentPoints -= 6; kaczynskis++; updateDisplay(); saveGame(); }
});
buyDudaBtn.addEventListener('click', () => {
    if (presidentPoints >= 10) { presidentPoints -= 10; dudas++; updateDisplay(); saveGame(); }
});

// MECHANIKA PRESTIŻU (RESETU)
prestigeBtn.addEventListener('click', () => {
    let pointsGained = Math.floor(score / 200000);
    if (pointsGained >= 1) {
        if (confirm(`Czy chcesz ogłosić Nową Epokę? Oddasz kasę i zakłady w zamian za ${pointsGained} 👑 Punktów Prezydenta.`)) {
            presidentPoints += pointsGained;
            
            // Reset gospodarki
            score = 0;
            workers = 0;        workerCost = 10;
            ursuses = 0;        ursusCost = 100;
            mines = 0;          mineCost = 1000;
            steelworks = 0;     steelworkCost = 5000;
            fiats = 0;          fiatCost = 10000;
            blocks = 0;         blockCost = 100000;
            mapRegions = createDefaultMapRegions();
            selectedMapRegion = "capital";
            westernCurrency = 0;
            westernMachinesBought = false;
            westernLicenseBought = false;
            westernCreditBought = false;
            oppositionBought = false;
            isStrikeActive = false;
            taxPolicy = "balanced";
            missedUssrPayments = 0;
            ussrStatusMessage = "Nowa epoka, nowe rozliczenia z Moskwą.";
            resetUssrTimer();
            chronicleTimer = CHRONICLE_INTERVAL;
            activeEventKey = "";
            activeEventTimer = 0;
            chronicleMessage = "Nowa epoka zaczyna się spokojnie. Kronika czeka na pierwszy meldunek.";
            strikeContainer.style.display = "none";
            
            updateDisplay();
            saveGame();
        }
    }
});

// PĘTLA GRY (Wywoływana co sekundę)
setInterval(() => {
    if (!gameStarted) {
        return;
    }

    let currentBps = calculateBps();
    score += currentBps;
    westernCurrency += calculateWesternIncome();
    ussrTributeTimer--;
    tickChronicle();

    if (ussrTributeTimer <= 0) {
        payUssrTribute(false);
    }

    // LOSOWANIE STRAJKÓW (podatki, opozycja i zaległości wobec ZSRR zwiększają ryzyko)
    if (!isStrikeActive) {
        let chance = Math.random() * 100;
        if (chance < getStrikeChance()) {
            isStrikeActive = true;
            // Koszt ugaszenia strajku zależy od zarobków gracza
            strikeCost = Math.max(500, Math.floor(currentBps * 12));
        }
    }

    updateDisplay();
}, 1000);

// AUTO-ZAPIS CO 10 SEKUND
setInterval(() => {
    if (gameStarted) {
        saveGame();
    }
}, 10000);

// ODŚWIEŻANIE EKRANU
function updateDisplay() {
    let currentBps = calculateBps();
    let pendingPoints = Math.floor(score / 200000);

    scoreDisplay.textContent = score;
    bpsDisplay.textContent = currentBps;
    clickButton.textContent = `Pomożecie? (+${getClickValue()} zł)`;
    westernCurrencyDisplay.textContent = westernCurrency.toFixed(1);
    
    presPointsDisplay.textContent = presidentPoints;
    pendingPointsDisplay.textContent = pendingPoints;

    let currentTaxPolicy = TAX_POLICIES[taxPolicy];
    let incomeBonus = Math.round((currentTaxPolicy.incomeMultiplier - 1) * 100);
    taxPolicyNameDisplay.textContent = currentTaxPolicy.name;
    taxIncomeBonusDisplay.textContent = `${incomeBonus >= 0 ? "+" : ""}${incomeBonus}%`;
    strikeRiskDisplay.textContent = `${getStrikeChance().toFixed(2)}% / sek`;
    taxBalancedBtn.classList.toggle("active-policy", taxPolicy === "balanced");
    taxHighBtn.classList.toggle("active-policy", taxPolicy === "high");
    taxBalancedBtn.setAttribute("aria-pressed", taxPolicy === "balanced");
    taxHighBtn.setAttribute("aria-pressed", taxPolicy === "high");

    ussrTimerDisplay.textContent = ussrTributeTimer;
    ussrTributeDisplay.textContent = ussrTributeDue;
    ussrStatusDisplay.textContent = ussrStatusMessage;
    payUssrBtn.disabled = score < ussrTributeDue;

    let activeEvent = getActiveChronicleEvent();
    chroniclePanel.className = activeEvent ? `chronicle-panel ${activeEvent.type}` : "chronicle-panel";

    if (activeEvent) {
        eventNameDisplay.textContent = activeEvent.name;
        eventDescDisplay.textContent = activeEvent.description;
        eventTimerLabel.textContent = "Wydarzenie trwa jeszcze:";
        eventTimerDisplay.textContent = activeEventTimer;
        eventEffectDisplay.textContent = describeEventEffect(activeEvent);
    } else {
        eventNameDisplay.textContent = "Spokojny dzień w kraju";
        eventDescDisplay.textContent = chronicleMessage;
        eventTimerLabel.textContent = "Do następnego meldunku:";
        eventTimerDisplay.textContent = chronicleTimer;
        eventEffectDisplay.textContent = "Brak aktywnego efektu.";
    }

    // Wyświetlanie strajku
    if (isStrikeActive) {
        strikeContainer.style.display = "block";
        strikeCostDisplay.textContent = strikeCost;
        resolveStrikeBtn.disabled = score < strikeCost;
    } else {
        strikeContainer.style.display = "none";
    }

    // Wyświetlanie statusu opozycji
    if (oppositionBought) {
        oppositionStatus.textContent = "Zalegalizowana! (+50% zysków, Ryzyko strajku)";
        oppositionStatus.style.color = "#4CAF50";
        buyOppositionBtn.disabled = true;
        buyOppositionBtn.textContent = "Opozycja Działa";
    } else {
        oppositionStatus.textContent = "Nielegalna";
        oppositionStatus.style.color = "#f44336";
        buyOppositionBtn.disabled = score < oppositionCost;
    }

    // Aktualizacja tekstów sklepów
    workersCountDisplay.textContent = workers; workerCostDisplay.textContent = workerCost;
    ursusesCountDisplay.textContent = ursuses; ursusCostDisplay.textContent = ursusCost;
    minesCountDisplay.textContent = mines; mineCostDisplay.textContent = mineCost;
    steelworksCountDisplay.textContent = steelworks; steelworkCostDisplay.textContent = steelworkCost;
    fiatsCountDisplay.textContent = fiats; fiatCostDisplay.textContent = fiatCost;
    blocksCountDisplay.textContent = blocks; blockCostDisplay.textContent = blockCost;

    // Liczniki Prezydentów PRL
    gierekCountDisplay.textContent = giereks;
    jaruzelskiCountDisplay.textContent = jaruzelskis;
    walesaCountDisplay.textContent = walesas;

    // Liczniki Nowych Prezydentów
    kwasniewskiCountDisplay.textContent = kwasniewskis;
    kaczynskiCountDisplay.textContent = kaczynskis;
    dudaCountDisplay.textContent = dudas;

    // Blokowanie przycisków budynków
    buyWorkerBtn.disabled = score < workerCost;
    buyUrsusBtn.disabled = score < ursusCost;
    buyMineBtn.disabled = score < mineCost;
    buySteelworkBtn.disabled = score < steelworkCost;
    buyFiatBtn.disabled = score < fiatCost;
    buyBlockBtn.disabled = score < blockCost;

    // Blokowanie przycisków prezydentów PRL
    buyGierekBtn.disabled = presidentPoints < 1;
    buyJaruzelskiBtn.disabled = presidentPoints < 5;
    buyWalesaBtn.disabled = presidentPoints < 15;

    // Przycisk Wyborów Prezydenckich i sekcja nowej ery
    if (electionsUnlocked) {
        electionBtn.style.display = "none";
        modernPresidentsSection.style.display = "block";
        buyKwasniewskiBtn.disabled = presidentPoints < 3;
        buyKaczynskiBtn.disabled = presidentPoints < 6;
        buyDudaBtn.disabled = presidentPoints < 10;
    } else {
        electionBtn.style.display = "block";
        electionBtn.disabled = presidentPoints < 5;
        modernPresidentsSection.style.display = "none";
    }

    // Aktywacja przycisku prestiżu
    if (score >= 200000) {
        prestigeBtn.disabled = false;
        prestigeBtn.textContent = `Ogłoś Nową Epokę! (+${pendingPoints} 👑)`;
    } else {
        prestigeBtn.disabled = true;
        prestigeBtn.textContent = "Wymaga przynajmniej 200 000 zł";
    }

    updateMap();
}

// SYSTEM LOCAL STORAGE
function saveGame() {
    let gameSave = {
        score: score,
        workers: workers, workerCost: workerCost,
        ursuses: ursuses, ursusCost: ursusCost,
        mines: mines, mineCost: mineCost,
        steelworks: steelworks, steelworkCost: steelworkCost,
        fiats: fiats, fiatCost: fiatCost,
        blocks: blocks, blockCost: blockCost,
        presidentPoints: presidentPoints,
        electionsUnlocked: electionsUnlocked,
        giereks: giereks, jaruzelskis: jaruzelskis, walesas: walesas,
        kwasniewskis: kwasniewskis, kaczynskis: kaczynskis, dudas: dudas,
        oppositionBought: oppositionBought,
        isStrikeActive: isStrikeActive,
        strikeCost: strikeCost,
        taxPolicy: taxPolicy,
        ussrTributeTimer: ussrTributeTimer,
        ussrTributeDue: ussrTributeDue,
        missedUssrPayments: missedUssrPayments,
        ussrStatusMessage: ussrStatusMessage,
        chronicleTimer: chronicleTimer,
        activeEventKey: activeEventKey,
        activeEventTimer: activeEventTimer,
        chronicleMessage: chronicleMessage,
        selectedMapRegion: selectedMapRegion,
        mapRegions: mapRegions,
        westernCurrency: westernCurrency,
        westernMachinesBought: westernMachinesBought,
        westernLicenseBought: westernLicenseBought,
        westernCreditBought: westernCreditBought
    };
    localStorage.setItem("gierkoclickerSave", JSON.stringify(gameSave));
}

function loadGame() {
    let savedGame = JSON.parse(localStorage.getItem("gierkoclickerSave"));
    if (savedGame !== null) {
        if (typeof savedGame.score !== "undefined") score = savedGame.score;
        if (typeof savedGame.workers !== "undefined") workers = savedGame.workers;
        if (typeof savedGame.workerCost !== "undefined") workerCost = savedGame.workerCost;
        if (typeof savedGame.ursuses !== "undefined") ursuses = savedGame.ursuses;
        if (typeof savedGame.ursusCost !== "undefined") ursusCost = savedGame.ursusCost;
        if (typeof savedGame.mines !== "undefined") mines = savedGame.mines;
        if (typeof savedGame.mineCost !== "undefined") mineCost = savedGame.mineCost;
        if (typeof savedGame.steelworks !== "undefined") steelworks = savedGame.steelworks;
        if (typeof savedGame.steelworkCost !== "undefined") steelworkCost = savedGame.steelworkCost;
        if (typeof savedGame.fiats !== "undefined") fiats = savedGame.fiats;
        if (typeof savedGame.fiatCost !== "undefined") fiatCost = savedGame.fiatCost;
        if (typeof savedGame.blocks !== "undefined") blocks = savedGame.blocks;
        if (typeof savedGame.blockCost !== "undefined") blockCost = savedGame.blockCost;
        
        if (typeof savedGame.presidentPoints !== "undefined") presidentPoints = savedGame.presidentPoints;
        if (typeof savedGame.electionsUnlocked !== "undefined") electionsUnlocked = savedGame.electionsUnlocked;
        
        if (typeof savedGame.giereks !== "undefined") giereks = savedGame.giereks;
        if (typeof savedGame.jaruzelskis !== "undefined") jaruzelskis = savedGame.jaruzelskis;
        if (typeof savedGame.walesas !== "undefined") walesas = savedGame.walesas;

        if (typeof savedGame.kwasniewskis !== "undefined") kwasniewskis = savedGame.kwasniewskis;
        if (typeof savedGame.kaczynskis !== "undefined") kaczynskis = savedGame.kaczynskis;
        if (typeof savedGame.dudas !== "undefined") dudas = savedGame.dudas;

        if (typeof savedGame.oppositionBought !== "undefined") oppositionBought = savedGame.oppositionBought;
        if (typeof savedGame.isStrikeActive !== "undefined") isStrikeActive = savedGame.isStrikeActive;
        if (typeof savedGame.strikeCost !== "undefined") strikeCost = savedGame.strikeCost;
        if (typeof savedGame.taxPolicy !== "undefined" && TAX_POLICIES[savedGame.taxPolicy]) taxPolicy = savedGame.taxPolicy;
        if (typeof savedGame.ussrTributeTimer !== "undefined") ussrTributeTimer = savedGame.ussrTributeTimer;
        if (typeof savedGame.ussrTributeDue !== "undefined") ussrTributeDue = savedGame.ussrTributeDue;
        if (typeof savedGame.missedUssrPayments !== "undefined") missedUssrPayments = savedGame.missedUssrPayments;
        if (typeof savedGame.ussrStatusMessage !== "undefined") ussrStatusMessage = savedGame.ussrStatusMessage;
        if (typeof savedGame.chronicleTimer !== "undefined") chronicleTimer = savedGame.chronicleTimer;
        if (typeof savedGame.activeEventKey !== "undefined" && (savedGame.activeEventKey === "" || CHRONICLE_EVENTS.some((event) => event.key === savedGame.activeEventKey))) activeEventKey = savedGame.activeEventKey;
        if (typeof savedGame.activeEventTimer !== "undefined") activeEventTimer = savedGame.activeEventTimer;
        if (typeof savedGame.chronicleMessage !== "undefined") chronicleMessage = savedGame.chronicleMessage;
        if (typeof savedGame.selectedMapRegion !== "undefined" && MAP_REGIONS[savedGame.selectedMapRegion]) selectedMapRegion = savedGame.selectedMapRegion;
        if (typeof savedGame.mapRegions !== "undefined") mapRegions = normalizeMapRegions(savedGame.mapRegions);
        if (typeof savedGame.westernCurrency !== "undefined") westernCurrency = savedGame.westernCurrency;
        if (typeof savedGame.westernMachinesBought !== "undefined") westernMachinesBought = savedGame.westernMachinesBought;
        if (typeof savedGame.westernLicenseBought !== "undefined") westernLicenseBought = savedGame.westernLicenseBought;
        if (typeof savedGame.westernCreditBought !== "undefined") westernCreditBought = savedGame.westernCreditBought;
    }
}

document.getElementById('save-btn').addEventListener('click', () => { saveGame(); alert("Gra zapisana w czynie społecznym!"); });
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm("Czy na pewno chcesz zresetować cały postęp, w tym Nowych Prezydentów i Opozycję?")) {
        localStorage.removeItem("gierkoclickerSave");
        location.reload();
    }
});

// START GRY
loadGame();
updateDisplay();
updateStartMenu();
