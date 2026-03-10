function getNum(id) {
  const value = parseFloat(document.getElementById(id).value);
  return isNaN(value) ? 0 : value;
}

function money(value) {
  return `$${value.toFixed(2)}`;
}

function pct(value) {
  return `${value.toFixed(2)}%`;
}

function roundPrice(value, roundTo99) {
  if (!roundTo99) {
    return Math.ceil(value * 100) / 100;
  }

  const ceilWhole = Math.ceil(value);
  const rounded = ceilWhole - 0.01;

  if (rounded < value) {
    return ceilWhole + 0.99;
  }

  return rounded;
}

function getSalesTaxAmount(sellPrice, buyerShip) {
  const taxMode = document.getElementById("taxMode").value;
  const taxValue = getNum("taxValue");
  const taxIncludesShipping = document.getElementById("taxIncludesShipping").value === "yes";

  if (taxMode === "amount") {
    return taxValue;
  }

  const rate = taxValue / 100;
  const taxableBase = taxIncludesShipping ? (sellPrice + buyerShip) : sellPrice;
  return taxableBase * rate;
}

function getSellerLevelExtraRate() {
  const sellerLevel = document.getElementById("sellerLevel").value;

  if (sellerLevel === "belowStandard") {
    return 0.06;
  }

  return 0;
}

function getInternationalRate() {
  const overseasSale = document.getElementById("overseasSale").value;
  return overseasSale === "yes" ? 0.0165 : 0;
}

function getCategoryFeeStructure() {
  const marketplace = document.getElementById("marketplace").value;
  const category = document.getElementById("category").value;
  const subCategory = document.getElementById("subCategory").value;

  if (marketplace === "amazon") {
    return {
      label: "Amazon manual rate",
      tier1Rate: getNum("storeFeeAdjustment") / 100 + 0.15,
      tier1Cap: Infinity,
      tier2Rate: 0,
      insertionFee: 0
    };
  }

  if (
    category === "motors" &&
    (subCategory === "partsAccessories" ||
      subCategory === "automotiveTools" ||
      subCategory === "safetySecurity")
  ) {
    return {
      label: "eBay Motors Parts & Accessories / Automotive Tools / Safety & Security",
      tier1Rate: 0.136,
      tier1Cap: 7500,
      tier2Rate: 0.0235,
      insertionFee: 0
    };
  }

  if (category === "most" || category === "motors") {
    return {
      label: "Most categories",
      tier1Rate: 0.136,
      tier1Cap: 7500,
      tier2Rate: 0.0235,
      insertionFee: 0
    };
  }

  if (category === "books") {
    return {
      label: "Books / Movies / Music",
      tier1Rate: 0.153,
      tier1Cap: 7500,
      tier2Rate: 0.0235,
      insertionFee: 0
    };
  }

  if (category === "coins") {
    return {
      label: "Coins & Paper Money",
      tier1Rate: 0.1325,
      tier1Cap: 7500,
      tier2Rate: 0.0235,
      insertionFee: 0
    };
  }

  if (category === "bullion") {
    return {
      label: "Bullion",
      tier1Rate: 0.136,
      tier1Cap: 7500,
      tier2Rate: 0.07,
      insertionFee: 0
    };
  }

  if (category === "cards") {
    return {
      label: "Collectible Cards",
      tier1Rate: 0.1325,
      tier1Cap: 7500,
      tier2Rate: 0.0235,
      insertionFee: 0
    };
  }

  if (category === "jewelry") {
    return {
      label: "Jewelry & Watches",
      tier1Rate: 0.15,
      tier1Cap: 5000,
      tier2Rate: 0.09,
      insertionFee: 0
    };
  }

  if (category === "watches") {
    return {
      label: "Watches, Parts & Accessories",
      tier1Rate: 0.15,
      tier1Cap: 1000,
      tier2Rate: 0.065,
      tier3Cap: 7500,
      tier3Rate: 0.03,
      insertionFee: 0
    };
  }

  if (category === "heavy") {
    return {
      label: "Select Business & Industrial Heavy Equipment",
      tier1Rate: 0.03,
      tier1Cap: 15000,
      tier2Rate: 0.005,
      insertionFee: 20
    };
  }

  if (category === "guitars") {
    return {
      label: "Guitars & Basses",
      tier1Rate: 0.067,
      tier1Cap: 7500,
      tier2Rate: 0.0235,
      insertionFee: 0
    };
  }

  return {
    label: "Most categories",
    tier1Rate: 0.136,
    tier1Cap: 7500,
    tier2Rate: 0.0235,
    insertionFee: 0
  };
}

function calculateTieredFVF(feeBase, structure, manualAdjustmentRate, sellerExtraRate, internationalRate) {
  let baseFVF = 0;

  if (structure.tier3Rate !== undefined) {
    const firstCap = structure.tier1Cap;
    const secondCap = structure.tier3Cap;

    const part1 = Math.min(feeBase, firstCap);
    const part2 = Math.min(Math.max(feeBase - firstCap, 0), secondCap - firstCap);
    const part3 = Math.max(feeBase - secondCap, 0);

    baseFVF =
      part1 * structure.tier1Rate +
      part2 * structure.tier2Rate +
      part3 * structure.tier3Rate;
  } else {
    const part1 = Math.min(feeBase, structure.tier1Cap);
    const part2 = Math.max(feeBase - structure.tier1Cap, 0);

    baseFVF =
      part1 * structure.tier1Rate +
      part2 * structure.tier2Rate;
  }

  const manualAdj = feeBase * manualAdjustmentRate;
  const sellerAdj = feeBase * sellerExtraRate;
  const intlFee = feeBase * internationalRate;

  return {
    baseFVF,
    manualAdj,
    sellerAdj,
    intlFee,
    totalFVF: baseFVF + manualAdj + sellerAdj + intlFee
  };
}

function getPerOrderFee(sellPrice, buyerShip) {
  const orderTotalExTax = sellPrice + buyerShip;
  return orderTotalExTax <= 10 ? 0.30 : 0.40;
}

function getFeeDataFromInputs(overrideSellPrice = null) {
  const marketplace = document.getElementById("marketplace").value;
  const sellPrice = overrideSellPrice !== null ? overrideSellPrice : getNum("sellPrice");
  const buyerShip = getNum("buyerShip");
  const itemCost = getNum("itemCost");
  const shipCost = getNum("shipCost");
  const adPercent = getNum("adPercent") / 100;
  const storeFeeAdjustment = getNum("storeFeeAdjustment") / 100;
  const roundTo99 = document.getElementById("roundTo99").value === "yes";

  const salesTax = getSalesTaxAmount(sellPrice, buyerShip);
  const structure = getCategoryFeeStructure();
  const sellerExtraRate = marketplace === "ebay" ? getSellerLevelExtraRate() : 0;
  const internationalRate = marketplace === "ebay" ? getInternationalRate() : 0;

  let feeBase = sellPrice + buyerShip;

  if (marketplace === "ebay") {
    feeBase += salesTax;
  }

  const fvfData = calculateTieredFVF(
    feeBase,
    structure,
    storeFeeAdjustment,
    sellerExtraRate,
    internationalRate
  );

  const perOrderFee = marketplace === "ebay" ? getPerOrderFee(sellPrice, buyerShip) : 0;
  const promotedAdFee = (sellPrice + buyerShip) * adPercent;
  const insertionFee = structure.insertionFee || 0;

  const totalFees =
    fvfData.totalFVF +
    perOrderFee +
    promotedAdFee +
    insertionFee;

  const totalCost = itemCost + shipCost;
  const payoutBeforeCost = sellPrice + buyerShip - totalFees;
  const profit = payoutBeforeCost - totalCost;

  const marginPercent = sellPrice > 0 ? (profit / sellPrice) * 100 : 0;
  const roiPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  return {
    marketplace,
    sellPrice,
    buyerShip,
    itemCost,
    shipCost,
    salesTax,
    feeBase,
    structure,
    sellerExtraRate,
    internationalRate,
    fvfData,
    perOrderFee,
    promotedAdFee,
    insertionFee,
    totalFees,
    totalCost,
    payoutBeforeCost,
    profit,
    marginPercent,
    roiPercent,
    roundTo99
  };
}

function renderResults() {
  const data = getFeeDataFromInputs();

  const profitClass =
    data.profit > 0 ? "money-good" : data.profit < 0 ? "money-bad" : "money-warn";

  document.getElementById("profitResult").innerHTML = `
    <div><strong>Sold Price:</strong> ${money(data.sellPrice)}</div>
    <div><strong>Shipping Charged:</strong> ${money(data.buyerShip)}</div>
    <div><strong>Sales Tax Collected:</strong> ${money(data.salesTax)}</div>
    <hr class="calc-divider">
    <div><strong>Total Fees:</strong> ${money(data.totalFees)}</div>
    <div><strong>Total Item + Shipping Cost:</strong> ${money(data.totalCost)}</div>
    <div><strong>Net Profit:</strong> <span class="${profitClass}">${money(data.profit)}</span></div>
    <div><strong>Profit Margin:</strong> ${pct(data.marginPercent)}</div>
    <div><strong>ROI:</strong> ${pct(data.roiPercent)}</div>
  `;

  document.getElementById("feeBreakdown").innerHTML = `
    <div><strong>Category Logic:</strong> ${data.structure.label}</div>
    <div><strong>Fee Base:</strong> ${money(data.feeBase)}</div>
    <div><strong>Base Final Value Fee:</strong> ${money(data.fvfData.baseFVF)}</div>
    <div><strong>Store Fee Adjustment:</strong> ${money(data.fvfData.manualAdj)}</div>
    <div><strong>Seller Level Add-on:</strong> ${money(data.fvfData.sellerAdj)}</div>
    <div><strong>International Fee:</strong> ${money(data.fvfData.intlFee)}</div>
    <div><strong>Per-Order Fee:</strong> ${money(data.perOrderFee)}</div>
    <div><strong>Promoted Ad Fee:</strong> ${money(data.promotedAdFee)}</div>
    <div><strong>Insertion Fee:</strong> ${money(data.insertionFee)}</div>
    <hr class="calc-divider">
    <div><strong>Payout Before Cost:</strong> ${money(data.payoutBeforeCost)}</div>
  `;

  document.getElementById("storeNote").textContent =
    "The uploaded eBay fee page confirms that Store subscribers have different fees, but it does not include the actual store-specific final value fee table. So this calculator includes the store selector and a manual Store Fee Adjustment field, but it does not invent store discounts. If you upload the eBay Store selling fees page, I can wire exact store subscription math into the selector.";
}

function findSuggestedPriceForMargin(targetMarginPercent) {
  const targetMargin = targetMarginPercent / 100;
  let low = 0.01;
  let high = 50000;
  let best = high;

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const data = getFeeDataFromInputs(mid);
    const currentMargin = mid > 0 ? data.profit / mid : 0;

    if (currentMargin >= targetMargin) {
      best = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return best;
}

function generateMarginTable() {
  const margins = [10, 20, 22, 25, 28, 30, 35, 40, 50];
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";

  const roundTo99 = document.getElementById("roundTo99").value === "yes";

  margins.forEach((margin) => {
    const rawPrice = findSuggestedPriceForMargin(margin);
    const finalPrice = roundPrice(rawPrice, roundTo99);
    const result = getFeeDataFromInputs(finalPrice);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${margin}%</td>
      <td>${money(finalPrice)}</td>
      <td>${money(result.profit)}</td>
      <td>${pct(result.roiPercent)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function applyMarketplaceDefaults() {
  const marketplace = document.getElementById("marketplace").value;

  if (marketplace === "ebay") {
    document.getElementById("category").value = "motors";
    document.getElementById("subCategory").value = "safetySecurity";
    document.getElementById("taxMode").value = "percent";
    document.getElementById("taxValue").value = "7.00";
  } else {
    document.getElementById("category").value = "most";
    document.getElementById("subCategory").value = "most";
    document.getElementById("storeFeeAdjustment").value = "0.00";
  }
}

function calculateAll() {
  renderResults();
  generateMarginTable();
}

document.getElementById("marketplace").addEventListener("change", () => {
  applyMarketplaceDefaults();
  calculateAll();
});

document.getElementById("calcBtn").addEventListener("click", calculateAll);

[
  "sellPrice",
  "buyerShip",
  "itemCost",
  "shipCost",
  "storeLevel",
  "sellerLevel",
  "overseasSale",
  "adPercent",
  "taxMode",
  "taxValue",
  "taxIncludesShipping",
  "category",
  "subCategory",
  "storeFeeAdjustment",
  "roundTo99"
].forEach((id) => {
  const el = document.getElementById(id);
  el.addEventListener("input", calculateAll);
  el.addEventListener("change", calculateAll);
});

applyMarketplaceDefaults();
calculateAll();
