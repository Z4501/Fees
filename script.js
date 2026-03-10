function getNum(id) {
  const el = document.getElementById(id);
  const value = parseFloat(el.value);
  return Number.isFinite(value) ? value : 0;
}

function getVal(id) {
  return document.getElementById(id).value;
}

function money(value) {
  return `$${value.toFixed(2)}`;
}

function percent(value) {
  return `${value.toFixed(2)}%`;
}

function roundSuggestedPrice(value, roundTo99) {
  if (!roundTo99) {
    return Math.ceil(value * 100) / 100;
  }
  const whole = Math.ceil(value);
  const candidate = whole - 0.01;
  return candidate >= value ? candidate : whole + 0.99;
}

/*
  CENTRAL FEE MAP
  Edit these values if you want to tune exact store/category mappings.

  For eBay Motors Parts & Accessories:
  - "none" = general no-store rate family
  - "anchor" is set to 11.50% because your real order implies about 11.5% effective FVF
    before the $0.40 order fee, with no ads and no international fee.
*/

const FEE_TABLES = {
  ebay: {
    defaultOrderFeeLow: 0.30,
    defaultOrderFeeHigh: 0.40,
    internationalRate: 0.0165,
    belowStandardAddOnRate: 0.06,

    categories: {
      most: {
        general: {
          none: { tiers: [{ cap: 7500, rate: 0.136 }, { cap: Infinity, rate: 0.0235 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.132 }, { cap: Infinity, rate: 0.0235 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.129 }, { cap: Infinity, rate: 0.0235 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.125 }, { cap: Infinity, rate: 0.0235 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.120 }, { cap: Infinity, rate: 0.0235 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.117 }, { cap: Infinity, rate: 0.0235 }] }
        }
      },

      motors: {
        general: {
          none: { tiers: [{ cap: 7500, rate: 0.136 }, { cap: Infinity, rate: 0.0235 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.125 }, { cap: Infinity, rate: 0.0235 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.121 }, { cap: Infinity, rate: 0.0235 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.118 }, { cap: Infinity, rate: 0.0235 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.115 }, { cap: Infinity, rate: 0.0235 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.112 }, { cap: Infinity, rate: 0.0235 }] }
        },

        partsAccessories: {
          none: { tiers: [{ cap: 7500, rate: 0.136 }, { cap: Infinity, rate: 0.0235 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.125 }, { cap: Infinity, rate: 0.0235 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.121 }, { cap: Infinity, rate: 0.0235 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.118 }, { cap: Infinity, rate: 0.0235 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.115 }, { cap: Infinity, rate: 0.0235 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.112 }, { cap: Infinity, rate: 0.0235 }] }
        },

        automotiveTools: {
          none: { tiers: [{ cap: 7500, rate: 0.136 }, { cap: Infinity, rate: 0.0235 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.125 }, { cap: Infinity, rate: 0.0235 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.121 }, { cap: Infinity, rate: 0.0235 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.118 }, { cap: Infinity, rate: 0.0235 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.115 }, { cap: Infinity, rate: 0.0235 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.112 }, { cap: Infinity, rate: 0.0235 }] }
        },

        safetySecurity: {
          none: { tiers: [{ cap: 7500, rate: 0.136 }, { cap: Infinity, rate: 0.0235 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.125 }, { cap: Infinity, rate: 0.0235 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.121 }, { cap: Infinity, rate: 0.0235 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.118 }, { cap: Infinity, rate: 0.0235 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.115 }, { cap: Infinity, rate: 0.0235 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.112 }, { cap: Infinity, rate: 0.0235 }] }
        },

        vehicle: {
          none: { flatFee: 79.00 },
          starter: { flatFee: 79.00 },
          basic: { flatFee: 79.00 },
          premium: { flatFee: 79.00 },
          anchor: { flatFee: 79.00 },
          enterprise: { flatFee: 79.00 }
        }
      },

      books: {
        general: {
          none: { tiers: [{ cap: 7500, rate: 0.153 }, { cap: Infinity, rate: 0.0235 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.149 }, { cap: Infinity, rate: 0.0235 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.145 }, { cap: Infinity, rate: 0.0235 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.141 }, { cap: Infinity, rate: 0.0235 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.137 }, { cap: Infinity, rate: 0.0235 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.134 }, { cap: Infinity, rate: 0.0235 }] }
        }
      },

      coins: {
        general: {
          none: { tiers: [{ cap: 7500, rate: 0.1325 }, { cap: Infinity, rate: 0.0235 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.1285 }, { cap: Infinity, rate: 0.0235 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.125 }, { cap: Infinity, rate: 0.0235 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.1215 }, { cap: Infinity, rate: 0.0235 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.118 }, { cap: Infinity, rate: 0.0235 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.115 }, { cap: Infinity, rate: 0.0235 }] }
        }
      },

      bullion: {
        general: {
          none: { tiers: [{ cap: 7500, rate: 0.136 }, { cap: Infinity, rate: 0.07 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.132 }, { cap: Infinity, rate: 0.07 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.128 }, { cap: Infinity, rate: 0.07 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.124 }, { cap: Infinity, rate: 0.07 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.120 }, { cap: Infinity, rate: 0.07 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.117 }, { cap: Infinity, rate: 0.07 }] }
        }
      },

      cards: {
        general: {
          none: { tiers: [{ cap: 7500, rate: 0.1325 }, { cap: Infinity, rate: 0.0235 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.1285 }, { cap: Infinity, rate: 0.0235 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.125 }, { cap: Infinity, rate: 0.0235 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.1215 }, { cap: Infinity, rate: 0.0235 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.118 }, { cap: Infinity, rate: 0.0235 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.115 }, { cap: Infinity, rate: 0.0235 }] }
        }
      },

      jewelry: {
        general: {
          none: { tiers: [{ cap: 5000, rate: 0.15 }, { cap: Infinity, rate: 0.09 }] },
          starter: { tiers: [{ cap: 5000, rate: 0.146 }, { cap: Infinity, rate: 0.09 }] },
          basic: { tiers: [{ cap: 5000, rate: 0.142 }, { cap: Infinity, rate: 0.09 }] },
          premium: { tiers: [{ cap: 5000, rate: 0.138 }, { cap: Infinity, rate: 0.09 }] },
          anchor: { tiers: [{ cap: 5000, rate: 0.134 }, { cap: Infinity, rate: 0.09 }] },
          enterprise: { tiers: [{ cap: 5000, rate: 0.130 }, { cap: Infinity, rate: 0.09 }] }
        }
      },

      watches: {
        general: {
          none: { tiers: [{ cap: 1000, rate: 0.15 }, { cap: 7500, rate: 0.065 }, { cap: Infinity, rate: 0.03 }] },
          starter: { tiers: [{ cap: 1000, rate: 0.146 }, { cap: 7500, rate: 0.065 }, { cap: Infinity, rate: 0.03 }] },
          basic: { tiers: [{ cap: 1000, rate: 0.142 }, { cap: 7500, rate: 0.065 }, { cap: Infinity, rate: 0.03 }] },
          premium: { tiers: [{ cap: 1000, rate: 0.138 }, { cap: 7500, rate: 0.065 }, { cap: Infinity, rate: 0.03 }] },
          anchor: { tiers: [{ cap: 1000, rate: 0.134 }, { cap: 7500, rate: 0.065 }, { cap: Infinity, rate: 0.03 }] },
          enterprise: { tiers: [{ cap: 1000, rate: 0.130 }, { cap: 7500, rate: 0.065 }, { cap: Infinity, rate: 0.03 }] }
        }
      },

      heavy: {
        general: {
          none: { tiers: [{ cap: 15000, rate: 0.03 }, { cap: Infinity, rate: 0.005 }], insertionFee: 20.00 },
          starter: { tiers: [{ cap: 15000, rate: 0.03 }, { cap: Infinity, rate: 0.005 }], insertionFee: 20.00 },
          basic: { tiers: [{ cap: 15000, rate: 0.03 }, { cap: Infinity, rate: 0.005 }], insertionFee: 20.00 },
          premium: { tiers: [{ cap: 15000, rate: 0.03 }, { cap: Infinity, rate: 0.005 }], insertionFee: 20.00 },
          anchor: { tiers: [{ cap: 15000, rate: 0.03 }, { cap: Infinity, rate: 0.005 }], insertionFee: 20.00 },
          enterprise: { tiers: [{ cap: 15000, rate: 0.03 }, { cap: Infinity, rate: 0.005 }], insertionFee: 20.00 }
        }
      },

      guitars: {
        general: {
          none: { tiers: [{ cap: 7500, rate: 0.067 }, { cap: Infinity, rate: 0.0235 }] },
          starter: { tiers: [{ cap: 7500, rate: 0.063 }, { cap: Infinity, rate: 0.0235 }] },
          basic: { tiers: [{ cap: 7500, rate: 0.060 }, { cap: Infinity, rate: 0.0235 }] },
          premium: { tiers: [{ cap: 7500, rate: 0.057 }, { cap: Infinity, rate: 0.0235 }] },
          anchor: { tiers: [{ cap: 7500, rate: 0.054 }, { cap: Infinity, rate: 0.0235 }] },
          enterprise: { tiers: [{ cap: 7500, rate: 0.051 }, { cap: Infinity, rate: 0.0235 }] }
        }
      }
    }
  },

  amazon: {
    defaultOrderFeeLow: 0,
    defaultOrderFeeHigh: 0,
    internationalRate: 0,
    belowStandardAddOnRate: 0,
    categories: {
      most: {
        general: {
          none: { tiers: [{ cap: Infinity, rate: 0.15 }] },
          starter: { tiers: [{ cap: Infinity, rate: 0.15 }] },
          basic: { tiers: [{ cap: Infinity, rate: 0.15 }] },
          premium: { tiers: [{ cap: Infinity, rate: 0.15 }] },
          anchor: { tiers: [{ cap: Infinity, rate: 0.15 }] },
          enterprise: { tiers: [{ cap: Infinity, rate: 0.15 }] }
        }
      }
    }
  }
};

function getSalesTaxAmount(sellPrice, buyerShip) {
  const taxMode = getVal("taxMode");
  const taxValue = getNum("taxValue");
  const taxIncludesShipping = getVal("taxIncludesShipping") === "yes";

  if (taxMode === "amount") {
    return taxValue;
  }

  const taxableBase = taxIncludesShipping ? sellPrice + buyerShip : sellPrice;
  return taxableBase * (taxValue / 100);
}

function getOrderFee(marketplace, sellPrice, buyerShip) {
  const feeConfig = FEE_TABLES[marketplace];
  const total = sellPrice + buyerShip;
  return total <= 10 ? feeConfig.defaultOrderFeeLow : feeConfig.defaultOrderFeeHigh;
}

function getFeeRule() {
  const marketplace = getVal("marketplace");
  const category = getVal("category");
  const subCategory = getVal("subCategory");
  const storeLevel = getVal("storeLevel");

  const marketData = FEE_TABLES[marketplace];
  const categoryData = marketData.categories[category] || marketData.categories.most;
  const subData = categoryData[subCategory] || categoryData.general || marketData.categories.most.general;
  const storeRule = subData[storeLevel] || subData.none;

  return {
    marketplace,
    category,
    subCategory,
    storeLevel,
    rule: storeRule
  };
}

function calculateTieredFee(feeBase, rule) {
  if (typeof rule.flatFee === "number") {
    return rule.flatFee;
  }

  if (!Array.isArray(rule.tiers)) {
    return 0;
  }

  let remaining = feeBase;
  let previousCap = 0;
  let total = 0;

  for (const tier of rule.tiers) {
    if (remaining <= 0) {
      break;
    }

    const currentCap = tier.cap;
    const width = currentCap === Infinity ? remaining : Math.min(remaining, currentCap - previousCap);

    total += width * tier.rate;
    remaining -= width;
    previousCap = currentCap === Infinity ? previousCap : currentCap;
  }

  return total;
}

function getAllData(overrideSellPrice = null) {
  const marketplace = getVal("marketplace");
  const sellPrice = overrideSellPrice !== null ? overrideSellPrice : getNum("sellPrice");
  const buyerShip = getNum("buyerShip");
  const itemCost = getNum("itemCost");
  const shipCost = getNum("shipCost");
  const sellerLevel = getVal("sellerLevel");
  const overseasSale = getVal("overseasSale") === "yes";
  const adPercent = getNum("adPercent") / 100;
  const manualFeeAdjust = getNum("manualFeeAdjust") / 100;
  const salesTax = getSalesTaxAmount(sellPrice, buyerShip);

  const feeLookup = getFeeRule();
  const rule = feeLookup.rule;
  const insertionFee = rule.insertionFee || 0;
  const orderFee = getOrderFee(marketplace, sellPrice, buyerShip);

  let feeBase = sellPrice + buyerShip;
  if (marketplace === "ebay") {
    feeBase += salesTax;
  }

  const baseFinalValueFee = calculateTieredFee(feeBase, rule);
  const manualAdjustmentFee = feeBase * manualFeeAdjust;

  const belowStandardAddOn =
    marketplace === "ebay" && sellerLevel === "belowStandard"
      ? feeBase * FEE_TABLES.ebay.belowStandardAddOnRate
      : 0;

  const internationalFee =
    marketplace === "ebay" && overseasSale
      ? feeBase * FEE_TABLES.ebay.internationalRate
      : 0;

  const promotedAdFee = (sellPrice + buyerShip) * adPercent;

  const totalFees =
    baseFinalValueFee +
    manualAdjustmentFee +
    belowStandardAddOn +
    internationalFee +
    promotedAdFee +
    orderFee +
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
    sellerLevel,
    overseasSale,
    adPercent,
    salesTax,
    feeBase,
    feeLookup,
    rule,
    baseFinalValueFee,
    manualAdjustmentFee,
    belowStandardAddOn,
    internationalFee,
    promotedAdFee,
    orderFee,
    insertionFee,
    totalFees,
    totalCost,
    payoutBeforeCost,
    profit,
    marginPercent,
    roiPercent
  };
}

function renderResults() {
  const d = getAllData();

  const profitClass = d.profit > 0 ? "good" : d.profit < 0 ? "bad" : "warn";

  document.getElementById("resultsBox").innerHTML = `
    <div><strong>Sold Price:</strong> ${money(d.sellPrice)}</div>
    <div><strong>Shipping Charged:</strong> ${money(d.buyerShip)}</div>
    <div><strong>Sales Tax Collected:</strong> ${money(d.salesTax)}</div>
    <hr>
    <div><strong>Total Fees:</strong> ${money(d.totalFees)}</div>
    <div><strong>Total Item + Shipping Cost:</strong> ${money(d.totalCost)}</div>
    <div><strong>Net Profit:</strong> <span class="${profitClass}">${money(d.profit)}</span></div>
    <div><strong>Profit Margin:</strong> ${percent(d.marginPercent)}</div>
    <div><strong>ROI:</strong> ${percent(d.roiPercent)}</div>
  `;

  document.getElementById("feeBox").innerHTML = `
    <div><strong>Fee Base:</strong> ${money(d.feeBase)}</div>
    <div><strong>Base Final Value Fee:</strong> ${money(d.baseFinalValueFee)}</div>
    <div><strong>Manual Fee Adjustment:</strong> ${money(d.manualAdjustmentFee)}</div>
    <div><strong>Below Standard Add-on:</strong> ${money(d.belowStandardAddOn)}</div>
    <div><strong>International Fee:</strong> ${money(d.internationalFee)}</div>
    <div><strong>Promoted Ad Fee:</strong> ${money(d.promotedAdFee)}</div>
    <div><strong>Order Fee:</strong> ${money(d.orderFee)}</div>
    <div><strong>Insertion Fee:</strong> ${money(d.insertionFee)}</div>
    <hr>
    <div><strong>Payout Before Cost:</strong> ${money(d.payoutBeforeCost)}</div>
  `;

  const tierText =
    d.rule.flatFee !== undefined
      ? `Flat fee: ${money(d.rule.flatFee)}`
      : d.rule.tiers
          .map((t, idx) => {
            const capText = t.cap === Infinity ? "over prior cap" : `up to ${money(t.cap)}`;
            return `Tier ${idx + 1}: ${percent(t.rate * 100)} ${capText}`;
          })
          .join("<br>");

  document.getElementById("logicBox").innerHTML = `
    <div><strong>Marketplace:</strong> ${d.marketplace}</div>
    <div><strong>Category:</strong> ${d.feeLookup.category}</div>
    <div><strong>Subcategory:</strong> ${d.feeLookup.subCategory}</div>
    <div><strong>Store Level:</strong> ${d.feeLookup.storeLevel}</div>
    <div><strong>Seller Level:</strong> ${d.sellerLevel}</div>
    <div><strong>International Sale:</strong> ${d.overseasSale ? "Yes" : "No"}</div>
    <hr>
    <div>${tierText}</div>
    <hr>
    <div class="muted">
      This version makes store/category/subcategory selectors functional using the fee map in script.js.
      If you want to tune exact store schedules later, edit the FEE_TABLES object only.
    </div>
  `;
}

function findPriceForTargetMargin(targetMarginPercent) {
  const target = targetMarginPercent / 100;
  let low = 0.01;
  let high = 50000;
  let best = high;

  for (let i = 0; i < 70; i++) {
    const mid = (low + high) / 2;
    const result = getAllData(mid);
    const currentMargin = mid > 0 ? result.profit / mid : 0;

    if (currentMargin >= target) {
      best = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return best;
}

function renderMarginTable() {
  const tbody = document.querySelector("#resultTable tbody");
  const margins = [10, 20, 22, 25, 28, 30, 35, 40, 50];
  const roundTo99 = getVal("roundTo99") === "yes";

  tbody.innerHTML = "";

  margins.forEach((margin) => {
    const raw = findPriceForTargetMargin(margin);
    const price = roundSuggestedPrice(raw, roundTo99);
    const result = getAllData(price);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${margin}%</td>
      <td>${money(price)}</td>
      <td>${money(result.profit)}</td>
      <td>${percent(result.roiPercent)}</td>
    `;
    tbody.appendChild(row);
  });
}

function syncSubcategoryOptions() {
  const marketplace = getVal("marketplace");
  const category = getVal("category");
  const sub = document.getElementById("subCategory");

  const optionsByCategory = {
    motors: [
      ["partsAccessories", "Parts & Accessories"],
      ["automotiveTools", "Automotive Tools & Supplies"],
      ["safetySecurity", "Safety & Security Accessories"],
      ["vehicle", "Vehicle Listing"],
      ["general", "General"]
    ],
    most: [["general", "General"]],
    books: [["general", "General"]],
    coins: [["general", "General"]],
    bullion: [["general", "General"]],
    cards: [["general", "General"]],
    jewelry: [["general", "General"]],
    watches: [["general", "General"]],
    heavy: [["general", "General"]],
    guitars: [["general", "General"]]
  };

  const options = marketplace === "amazon"
    ? [["general", "General"]]
    : (optionsByCategory[category] || [["general", "General"]]);

  const current = sub.value;
  sub.innerHTML = "";

  options.forEach(([value, label]) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    sub.appendChild(opt);
  });

  const stillExists = options.some(([value]) => value === current);
  sub.value = stillExists ? current : options[0][0];
}

function applyMarketplaceDefaults() {
  const marketplace = getVal("marketplace");

  if (marketplace === "ebay") {
    document.getElementById("category").value = "motors";
    document.getElementById("storeLevel").value = "anchor";
  } else {
    document.getElementById("category").value = "most";
    document.getElementById("storeLevel").value = "none";
    document.getElementById("sellerLevel").value = "aboveStandard";
    document.getElementById("overseasSale").value = "no";
    document.getElementById("taxIncludesShipping").value = "yes";
  }

  syncSubcategoryOptions();
}

function calculateAll() {
  renderResults();
  renderMarginTable();
}

document.getElementById("marketplace").addEventListener("change", () => {
  applyMarketplaceDefaults();
  calculateAll();
});

document.getElementById("category").addEventListener("change", () => {
  syncSubcategoryOptions();
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
  "subCategory",
  "manualFeeAdjust",
  "roundTo99"
].forEach((id) => {
  const el = document.getElementById(id);
  el.addEventListener("input", calculateAll);
  el.addEventListener("change", calculateAll);
});

applyMarketplaceDefaults();
calculateAll();
