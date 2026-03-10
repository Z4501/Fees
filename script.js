function calculate()
{

let itemCost = parseFloat(document.getElementById("itemCost").value);
let shipCost = parseFloat(document.getElementById("shipCost").value);
let buyerShip = parseFloat(document.getElementById("buyerShip").value);
let feePercent = parseFloat(document.getElementById("feePercent").value) / 100;
let adPercent = parseFloat(document.getElementById("adPercent").value) / 100;
let taxPercent = parseFloat(document.getElementById("taxPercent").value) / 100;
let feeOnTax = document.getElementById("feeOnTax").value;

let margins = [10,20,22,25,28,30,35,40,50];

let table = document.querySelector("#resultTable tbody");
table.innerHTML = "";

margins.forEach(margin =>
{

let m = margin / 100;

let price = (itemCost + shipCost) / (1 - feePercent - adPercent - m);

let tax = price * taxPercent;

let feeBase = price + buyerShip;

if(feeOnTax === "yes")
feeBase += tax;

let fees = feeBase * (feePercent + adPercent);

let profit = price - fees - itemCost - shipCost;

let rounded = Math.ceil(price) - 0.01;

let row = document.createElement("tr");

row.innerHTML =
`
<td>${margin}%</td>
<td>$${rounded.toFixed(2)}</td>
<td>$${profit.toFixed(2)}</td>
`;

table.appendChild(row);

});

}
