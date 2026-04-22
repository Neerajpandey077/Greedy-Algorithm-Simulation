
// limits for user inputs
const MAX_ITEMS = 20;       // max items for bin/knapsack
const MAX_CITIES = 20;      // max cities for TSP
const MAX_CAPACITY = 1000;  // arbitrary upper bound for capacities

let items = [];
let binItems = [];
let tspCities = [];

// Color palette for visualizations
const colors = ['#1a73e8','#34a853','#fbbc04','#ea4335'];

document.addEventListener('DOMContentLoaded', function() {
    const algorithmSelect = document.getElementById('algorithm');
    const inputsDiv = document.getElementById('inputs');
    const runBtn = document.getElementById('runBtn');
    const resetBtn = document.getElementById('resetBtn');

    algorithmSelect.addEventListener('change', showInputs);
    runBtn.disabled = true;
    resetBtn.addEventListener('click', reset);
    document.getElementById('closeError').addEventListener('click', hideError);

    // Initialize hero section visibility
    showInputs();

    // Helper function for keyboard navigation
    function addKeyboardNav(currentId, nextId, action) {
        document.getElementById(currentId).addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (nextId) {
                    document.getElementById(nextId).focus();
                } else if (action) {
                    action();
                }
            }
        });
    }


    function showError(message) {
        document.getElementById('errorMessage').textContent = message;
        const modal = document.getElementById('errorModal');
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
        setTimeout(() => hideError(), 5000);
    }

    function hideError() {
        const modal = document.getElementById('errorModal');
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    function showInputs() {
        const algo = algorithmSelect.value;
        const heroSection = document.getElementById('heroSection');
        const leftPane = document.querySelector('.pane.left');
        const rightPane = document.querySelector('.pane.right');

        if (algo) {
            heroSection.style.display = 'none';
            rightPane.style.display = 'flex';
            leftPane.style.maxWidth = '45%';
        } else {
            heroSection.style.display = 'block';
            rightPane.style.display = 'none';
            leftPane.style.maxWidth = '100%';
        }

        inputsDiv.innerHTML = '';
        items = [];
        binItems = [];
        tspCities = [];

        updateSidebar(algo);

        if (algo === 'binpacking') {
            inputsDiv.innerHTML = `
                <div class="input-group">
                    <label for="binCapacity">📦 Bin Capacity</label>
                    <input type="number" id="binCapacity" value="10" min="1" max="${MAX_CAPACITY}" placeholder="Enter bin capacity (max ${MAX_CAPACITY})">
                </div>
                <h4>Add Items to Pack <small>(max ${MAX_ITEMS} items)</small></h4>
                <div class="input-group">
                    <label for="itemName">Item Name</label>
                    <input type="text" id="itemName" placeholder="e.g., Item1">
                </div>
                <div class="input-group">
                    <label for="itemSize">Size</label>
                    <input type="number" id="itemSize" min="1" max="${MAX_CAPACITY}" placeholder="e.g., 5">
                </div>
                <button id="addBinItemBtn">➕ Add Item</button>
                <div id="binItemList"></div>
            `;
            document.getElementById('addBinItemBtn').addEventListener('click', addBinItem);
            addKeyboardNav('itemName', 'itemSize');
            addKeyboardNav('itemSize', null, addBinItem);

        } else if (algo === 'knapsack01') {
            inputsDiv.innerHTML = `
                <div class="input-group">
                    <label for="capacity">🎒 Knapsack Capacity</label>
                    <input type="number" id="capacity" value="50" min="1" max="${MAX_CAPACITY}" placeholder="Enter capacity (max ${MAX_CAPACITY})">
                </div>
                <h4>Add Items <small>(max ${MAX_ITEMS} items)</small></h4>
                <div class="input-group">
                    <label for="itemName">Item Name</label>
                    <input type="text" id="itemName" placeholder="e.g., Item1">
                </div>
                <div class="input-group">
                    <label for="itemWeight">Weight</label>
                    <input type="number" id="itemWeight" min="1" max="${MAX_CAPACITY}" placeholder="e.g., 10">
                </div>
                <div class="input-group">
                    <label for="itemValue">Value ($)</label>
                    <input type="number" id="itemValue" min="1" max="${MAX_CAPACITY}" placeholder="e.g., 60">
                </div>
                <button id="addItemBtn">➕ Add Item</button>
                <div id="itemList"></div>
            `;
            document.getElementById('addItemBtn').addEventListener('click', addItem);
            addKeyboardNav('itemName', 'itemWeight');
            addKeyboardNav('itemWeight', 'itemValue');
            addKeyboardNav('itemValue', null, addItem);

        } else if (algo === 'tsp') {
            inputsDiv.innerHTML = `
                <h4>Add Cities</h4>
                <div class="input-group">
                    <label for="cityName">City Name</label>
                    <input type="text" id="cityName" placeholder="e.g., CityA">
                </div>
                <div class="input-group">
                    <label for="cityX">X Coordinate</label>
                    <input type="number" id="cityX" min="-10000" max="10000" placeholder="e.g., 0">
                </div>
                <div class="input-group">
                    <label for="cityY">Y Coordinate</label>
                    <input type="number" id="cityY" min="-10000" max="10000" placeholder="e.g., 0">
                </div>
                <button id="addCityBtn">➕ Add City</button>
                <div id="cityList"></div>
                <small>Max ${MAX_CITIES} cities allowed.</small>
            `;
            document.getElementById('addCityBtn').addEventListener('click', addCity);
            addKeyboardNav('cityName', 'cityX');
            addKeyboardNav('cityX', 'cityY');
            addKeyboardNav('cityY', null, addCity);

        }

        runBtn.disabled = algo === '';
    }

    function updateSidebar(algo) {
        const sidebar = document.getElementById('algoInfo');
        if (algo === 'binpacking') {
            sidebar.innerHTML = `
                <div class="definition">
                    <h4>📦 Bin Packing Problem</h4>
                    <p>Pack items of different sizes into the minimum number of bins, each with a fixed capacity.</p>
                </div>
                <div class="steps-info">
                    <h4>How It Works:</h4>
                    <ol>
                        <li>Set the bin capacity</li>
                        <li>Add items with their sizes</li>
                        <li>Algorithm places each item in the first bin that has enough space</li>
                        <li>Creates a new bin if no existing bin can fit the item</li>
                        <li>Counts total bins used</li>
                    </ol>
                </div>
            `;
        } else if (algo === 'knapsack01') {
            sidebar.innerHTML = `
                <div class="definition">
                    <h4>🎒 0/1 Knapsack Problem</h4>
                    <p>Select items with weights and values to maximize total value without exceeding the knapsack capacity.</p>
                </div>
                <div class="steps-info">
                    <h4>How It Works:</h4>
                    <ol>
                        <li>Set the knapsack capacity</li>
                        <li>Add items with weight and value</li>
                        <li>Calculate value-to-weight ratio for each item</li>
                        <li>Sort items by ratio (highest first)</li>
                        <li>Pick items that fit in remaining capacity</li>
                    </ol>
                </div>
            `;
        } else if (algo === 'tsp') {
            sidebar.innerHTML = `
                <div class="definition">
                    <h4>🗺️ Traveling Salesman Problem</h4>
                    <p>Find the shortest route that visits all cities exactly once and returns to the starting city.</p>
                </div>
                <div class="steps-info">
                    <h4>How It Works:</h4>
                    <ol>
                        <li>Add cities with X, Y coordinates</li>
                        <li>Start from the first city entered</li>
                        <li>Always visit the nearest unvisited city</li>
                        <li>Continue until all cities are visited</li>
                        <li>Return to starting city to complete the tour</li>
                    </ol>
                </div>
            `;
        } else {
            sidebar.innerHTML = `
                <div class="welcome-section">
                    <h4>🚀 Welcome to DAA Algorithm Simulator!</h4>
                    <p>Explore and visualize classic greedy algorithms for optimization problems.</p>
                    
                    <div class="algorithm-preview">
                        <h5>📚 Available Algorithms:</h5>
                        <div class="algo-card">
                            <span class="algo-emoji">📦</span>
                            <div>
                                <strong>Bin Packing</strong>
                                <small>Pack items into minimum bins</small>
                            </div>
                        </div>
                        <div class="algo-card">
                            <span class="algo-emoji">🎒</span>
                            <div>
                                <strong>0/1 Knapsack</strong>
                                <small>Maximize value with capacity limit</small>
                            </div>
                        </div>
                        <div class="algo-card">
                            <span class="algo-emoji">🗺️</span>
                            <div>
                                <strong>TSP</strong>
                                <small>Find shortest route visiting all cities</small>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            `;
        }
    }

    function addItem() {
        if (items.length >= MAX_ITEMS) {
            showError(`Maximum of ${MAX_ITEMS} items reached.`);
            return;
        }
        const name = document.getElementById('itemName').value.trim();
        const weight = parseInt(document.getElementById('itemWeight').value);
        const value = parseInt(document.getElementById('itemValue').value);

        if (!name || isNaN(weight) || isNaN(value) || weight <= 0 || value <= 0) {
            showError('Please enter valid item details. Weight and value must be positive numbers.');
            return;
        }

        items.push({ name, weight, value });
        updateItemList();
        document.getElementById('itemName').value = '';
        document.getElementById('itemWeight').value = '';
        document.getElementById('itemValue').value = '';
        document.getElementById('itemName').focus();
    }

    function updateItemList() {
        const listDiv = document.getElementById('itemList');
        listDiv.innerHTML = '<h4>Added Items:</h4><ul>';
        items.forEach((item, index) => {
            listDiv.innerHTML += `<li>
                <span>${item.name} <small>(Weight: ${item.weight}, Value: $${item.value})</small></span>
                <button onclick="removeItem(${index})">✕</button>
            </li>`;
        });
        listDiv.innerHTML += '</ul>';
    }

    function addBinItem() {
        if (binItems.length >= MAX_ITEMS) {
            showError(`Maximum of ${MAX_ITEMS} items reached.`);
            return;
        }
        const capacity = parseInt(document.getElementById('binCapacity').value);
        const name = document.getElementById('itemName').value.trim();
        const size = parseInt(document.getElementById('itemSize').value);

        if (!name || isNaN(size) || size <= 0) {
            showError('Please enter valid item details. Size must be a positive number.');
            return;
        }
        if (size > capacity) {
            showError('Item size cannot exceed bin capacity.');
            return;
        }

        binItems.push({ name, size });
        updateBinItemList();
        document.getElementById('itemName').value = '';
        document.getElementById('itemSize').value = '';
        document.getElementById('itemName').focus();
    }

    function updateBinItemList() {
        const listDiv = document.getElementById('binItemList');
        listDiv.innerHTML = '<h4>Added Items:</h4><ul>';
        binItems.forEach((item, index) => {
            listDiv.innerHTML += `<li>
                <span>${item.name} <small>(Size: ${item.size})</small></span>
                <button onclick="removeBinItem(${index})">✕</button>
            </li>`;
        });
        listDiv.innerHTML += '</ul>';
    }

    function addCity() {
        if (tspCities.length >= MAX_CITIES) {
            showError(`Maximum of ${MAX_CITIES} cities reached.`);
            return;
        }
        const name = document.getElementById('cityName').value.trim();
        const x = parseFloat(document.getElementById('cityX').value);
        const y = parseFloat(document.getElementById('cityY').value);

        if (!name || isNaN(x) || isNaN(y)) {
            showError('Please enter valid city details.');
            return;
        }

        tspCities.push({ name, x, y });
        updateCityList();
        document.getElementById('cityName').value = '';
        document.getElementById('cityX').value = '';
        document.getElementById('cityY').value = '';
        document.getElementById('cityName').focus();
    }

    function updateCityList() {
        const listDiv = document.getElementById('cityList');
        listDiv.innerHTML = '<h4>Added Cities:</h4><ul>';
        tspCities.forEach((city, index) => {
            listDiv.innerHTML += `<li>
                <span>${city.name} <small>(${city.x}, ${city.y})</small></span>
                <button onclick="removeCity(${index})">✕</button>
            </li>`;
        });
        listDiv.innerHTML += '</ul>';
    }

    window.removeItem = function(index) {
        items.splice(index, 1);
        updateItemList();
    };

    window.removeBinItem = function(index) {
        binItems.splice(index, 1);
        updateBinItemList();
    };

    window.removeCity = function(index) {
        tspCities.splice(index, 1);
        updateCityList();
    };

    function reset() {
        algorithmSelect.value = '';
        inputsDiv.innerHTML = '';
        document.getElementById('output').innerHTML = '';
        runBtn.disabled = true;
        items = [];
        binItems = [];
        tspCities = [];
        showInputs();
    }
});

function run() {
    const algo = document.getElementById("algorithm").value;
    const output = document.getElementById("output");
    const stepsDiv = document.getElementById('steps');

    if (algo === "") {
        output.innerHTML = "<p class='result-highlight'>Please select an algorithm.</p>";
        stepsDiv.innerHTML = '';
        return;
    }

    output.innerHTML = "<p class='loading'>🧠 Running algorithm... Please wait.</p>";
    stepsDiv.innerHTML = "<p class='loading'>🧠 Calculating steps...</p>";

    setTimeout(() => {
        if (algo === "binpacking") {
            binPacking(output, stepsDiv);
        } else if (algo === "knapsack01") {
            knapsack01(output, stepsDiv);
        } else if (algo === "tsp") {
            tsp(output, stepsDiv);
        }
    }, 500);
}

// BIN PACKING ALGORITHM
function binPacking(output, stepsDiv) {
    const capacity = parseInt(document.getElementById('binCapacity').value);

    if (isNaN(capacity) || capacity <= 0 || capacity > MAX_CAPACITY) {
        showError(`Bin capacity must be between 1 and ${MAX_CAPACITY}.`);
        output.innerHTML = "";
        stepsDiv.innerHTML = '';
        return;
    }

    if (binItems.length === 0) {
        output.innerHTML = "<p class='result-highlight'>Please add at least one item.</p>";
        stepsDiv.innerHTML = '';
        return;
    }

    // First Fit Bin Packing
    let bins = [];
    let steps = [];
    let colorMap = {};
    let colorIndex = 0;

    steps.push({ type: 'start', message: `📦 Starting Bin Packing with bin capacity: ${capacity}` });

    binItems.forEach(item => {
        if (!colorMap[item.name]) {
            colorMap[item.name] = colors[colorIndex % colors.length];
            colorIndex++;
        }
        
        let placed = false;
        for (let binIndex = 0; binIndex < bins.length; binIndex++) {
            let bin = bins[binIndex];
            if (bin.remaining >= item.size) {
                bin.items.push(item);
                bin.remaining -= item.size;
                steps.push({ 
                    type: 'place', 
                    message: `✅ Placed <strong>${item.name}</strong> (size: ${item.size}) in Bin ${binIndex + 1}. Remaining: ${bin.remaining}` 
                });
                placed = true;
                break;
            }
        }
        if (!placed) {
            bins.push({ items: [item], remaining: capacity - item.size });
            steps.push({ 
                type: 'new-bin', 
                message: `🆕 Created Bin ${bins.length} for <strong>${item.name}</strong> (size: ${item.size}). Remaining: ${capacity - item.size}` 
            });
        }
    });

    let stepHtml = `<h4>📋 Step-by-Step Execution</h4><div class="steps">`;
    steps.forEach((step, index) => {
        let icon = '';
        if (step.type === 'start') icon = '📦';
        else if (step.type === 'place') icon = '✅';
        else if (step.type === 'new-bin') icon = '🆕';
        
        stepHtml += `<div class="step-item">
            <span class="step-number">${index + 1}</span>
            <span class="step-message">${icon} ${step.message}</span>
        </div>`;
    });
    stepHtml += '</div>';

    // Calculate efficiency
    const totalItemSize = binItems.reduce((sum, item) => sum + item.size, 0);
    const totalCapacity = bins.length * capacity;
    const efficiency = ((totalItemSize / totalCapacity) * 100).toFixed(1);
    let html = `
        <div class="bin-packing-result">
            <h3>📦 Bin Packing Result</h3>
            <p><strong>Greedy Strategy:</strong> First Fit - Place each item in the first bin with enough space</p>
            
            <div class="result-summary">
                <div class="summary-card">
                    <div class="label">Total Bins Used</div>
                    <div class="value success">${bins.length}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Items Packed</div>
                    <div class="value">${binItems.length}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Space Efficiency</div>
                    <div class="value">${efficiency}%</div>
                </div>
            </div>

            <h4>📊 Bin Visualization</h4>
            <div class="vis-bin-container">
    `;

    bins.forEach((bin, index) => {
        const usedSpace = capacity - bin.remaining;
        const fillPercent = (usedSpace / capacity) * 100;
        
        // Determine fill color based on how full the bin is
        let fillColor = '#34a853'; // green for < 70%
        if (fillPercent > 90) fillColor = '#ea4335'; // red for > 90%
        else if (fillPercent > 70) fillColor = '#fbbc04'; // yellow for 70-90%

        html += `
            <div class="vis-bin-wrapper">
                <div class="vis-bin-header">
                    <span class="vis-bin-title">Bin ${index + 1}</span>
                    <span class="vis-bin-meta">${usedSpace}/${capacity} used (${bin.remaining} remaining)</span>
                </div>
                <div class="vis-bin-progress">
                    <div class="vis-bin-fill" style="width: ${fillPercent}%; background: ${fillColor};"></div>
                </div>
                <div class="vis-bin-items">
        `;
        
        bin.items.forEach(item => {
            html += `<span class="item-tag" style="background: ${colorMap[item.name]}">
                ${item.name} <span class="item-size">(${item.size})</span>
            </span>`;
        });
        
        html += `</div></div>`;
    });

    html += `</div>`;


    stepsDiv.innerHTML = stepHtml;
    output.innerHTML = html;
}

// 0/1 KNAPSACK ALGORITHM
function knapsack01(output, stepsDiv) {
    const capacity = parseInt(document.getElementById('capacity').value);

    if (isNaN(capacity) || capacity <= 0 || capacity > MAX_CAPACITY) {
        showError(`Knapsack capacity must be between 1 and ${MAX_CAPACITY}.`);
        output.innerHTML = "";
        stepsDiv.innerHTML = '';
        return;
    }

    if (items.length === 0) {
        output.innerHTML = "<p class='result-highlight'>Please add at least one item.</p>";
        stepsDiv.innerHTML = '';
        return;
    }

    // Greedy approach
    let its = [...items];
    let steps = [];
    let colorMap = {};
    let colorIndex = 0;

    steps.push({ type: 'start', message: `🎒 Starting 0/1 Knapsack with capacity: ${capacity}` });

    // Calculate ratios
    its.forEach(item => {
        item.ratio = item.value / item.weight;
        if (!colorMap[item.name]) {
            colorMap[item.name] = colors[colorIndex % colors.length];
            colorIndex++;
        }
    });

    steps.push({ type: 'ratio', message: '📊 Calculating value-to-weight ratios for all items' });

    // Show ratios
    its.forEach(item => {
        steps.push({ type: 'item', message: `${item.name}: Value/Weight = ${item.ratio.toFixed(2)} ($${item.value} / ${item.weight}kg)` });
    });

    // Sort by ratio
    its.sort((a, b) => b.ratio - a.ratio);
    steps.push({ type: 'sort', message: '⬇️ Items sorted by ratio (highest first)' });

    let totalValue = 0;
    let totalWeight = 0;
    let selectedItems = [];
    let skippedItems = [];
    let remainingCapacity = capacity;

    for (let item of its) {
        if (remainingCapacity >= item.weight) {
            selectedItems.push(item);
            totalValue += item.value;
            totalWeight += item.weight;
            remainingCapacity -= item.weight;
            steps.push({ 
                type: 'select', 
                message: `✅ Selected <strong>${item.name}</strong> (Weight: ${item.weight}, Value: $${item.value}). Remaining: ${remainingCapacity}` 
            });
        } else {
            skippedItems.push(item);
            steps.push({ 
                type: 'skip', 
                message: `❌ Skipped <strong>${item.name}</strong> (Weight: ${item.weight}) - exceeds remaining capacity (${remainingCapacity})` 
            });
        }
    }

    steps.push({ type: 'complete', message: `🎉 Complete! Total Value: $${totalValue}, Total Weight: ${totalWeight}kg` });

    // Build step-by-step HTML
    let stepHtml = `<h4>📋 Step-by-Step Execution</h4><div class="steps">`;
    steps.forEach((step, index) => {
        let stepClass = 'step-item';
        if (step.type === 'select') stepClass += ' success';
        else if (step.type === 'skip') stepClass += ' skip';
        
        stepHtml += `<div class="${stepClass}">
            <span class="step-number">${index + 1}</span>
            <span class="step-message">${step.message}</span>
        </div>`;
    });
    stepHtml += '</div>';

    // Build result HTML
    const efficiency = ((totalWeight / capacity) * 100).toFixed(1);

    let html = `
        <div class="knapsack-result">
            <h3>🎒 0/1 Knapsack Result</h3>
            <p><strong>Greedy Strategy:</strong> Sort by value-to-weight ratio, select items that fit</p>
            
            <div class="result-summary">
                <div class="summary-card">
                    <div class="label">Total Value</div>
                    <div class="value success">$${totalValue}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Total Weight</div>
                    <div class="value">${totalWeight}kg</div>
                </div>
                <div class="summary-card">
                    <div class="label">Capacity Used</div>
                    <div class="value">${efficiency}%</div>
                </div>
            </div>

            <h4>📊 Visual Representation</h4>
            <div class="knapsack-visual">
                <div class="knapsack-cap">
                    <span>Knapsack Capacity: ${capacity}kg</span>
                    <span>Used: ${totalWeight}kg | Remaining: ${remainingCapacity}kg</span>
                </div>
                <div class="knapsack-bar-container">
    `;

    // Build knapsack bar
    let usedWeight = 0;
    selectedItems.forEach((item, index) => {
        const width = (item.weight / capacity) * 100;
        html += `<div class="knapsack-bar-item" style="width: ${width}%; background: ${colorMap[item.name]}">
            ${item.name}
        </div>`;
        usedWeight += item.weight;
    });

    if (remainingCapacity > 0) {
        const remainingWidth = (remainingCapacity / capacity) * 100;
        html += `<div class="knapsack-bar-remaining" style="width: ${remainingWidth}%">
            Empty (${remainingCapacity}kg)
        </div>`;
    }

    html += `</div></div>`;

    // Selected items table
    html += `
        <div class="selected-items-table">
            <h4>✅ Selected Items</h4>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Weight</th>
                        <th>Value</th>
                        <th>Ratio</th>
                    </tr>
                </thead>
                <tbody>
    `;

    selectedItems.forEach(item => {
        html += `<tr>
            <td><span class="item-color" style="background: ${colorMap[item.name]}"></span>${item.name}</td>
            <td>${item.weight}kg</td>
            <td>$${item.value}</td>
            <td>${item.ratio.toFixed(2)}</td>
        </tr>`;
    });

    html += `</tbody></table></div>`;

    // Skipped items
    if (skippedItems.length > 0) {
        html += `
            <div class="selected-items-table" style="margin-top: 16px; opacity: 0.7;">
                <h4>❌ Skipped Items (Didn't Fit)</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Weight</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        skippedItems.forEach(item => {
            html += `<tr>
                <td>${item.name}</td>
                <td>${item.weight}kg</td>
                <td>$${item.value}</td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
    }


    stepsDiv.innerHTML = stepHtml;
    output.innerHTML = html;
}

// TRAVELING SALESMAN PROBLEM
function tsp(output, stepsDiv) {
    if (tspCities.length < 2) {
        output.innerHTML = "<p class='result-highlight'>Please add at least two cities.</p>";
        stepsDiv.innerHTML = '';
        return;
    }
    // Nearest Neighbor TSP
    let steps = [];
    let unvisited = [...tspCities];
    steps.push({ type: 'start', message: `🗺️ Starting TSP with ${tspCities.length} cities` });
    steps.push({ type: 'start', message: `📍 Starting city: <strong>${unvisited[0].name}</strong> at (${unvisited[0].x}, ${unvisited[0].y})` });
    
    let path = [unvisited.shift()];
    let totalDistance = 0;
    let legDistances = [];

    while (unvisited.length > 0) {
        let current = path[path.length - 1];
        let nearestIndex = 0;
        let minDist = distance(current, unvisited[0]);

        for (let i = 1; i < unvisited.length; i++) {
            let dist = distance(current, unvisited[i]);
            if (dist < minDist) {
                minDist = dist;
                nearestIndex = i;
            }
        }

        legDistances.push({ from: current.name, to: unvisited[nearestIndex].name, dist: minDist });
        totalDistance += minDist;
        path.push(unvisited.splice(nearestIndex, 1)[0]);
        
        steps.push({ 
            type: 'visit', 
            message: `🚗 Travel from <strong>${current.name}</strong> to <strong>${path[path.length - 1].name}</strong> - Distance: ${minDist.toFixed(2)}` 
        });
    }

    // Return to start
    let returnDist = distance(path[path.length - 1], path[0]);
    legDistances.push({ from: path[path.length - 1].name, to: path[0].name, dist: returnDist, isReturn: true });
    totalDistance += returnDist;
    
    steps.push({ 
        type: 'return', 
        message: `🏁 Return to <strong>${path[0].name}</strong> from <strong>${path[path.length - 1].name}</strong> - Distance: ${returnDist.toFixed(2)}` 
    });
    steps.push({ 
        type: 'complete', 
        message: `🎉 Complete! Total tour distance: <strong>${totalDistance.toFixed(2)}</strong>` 
    });

    // Build step-by-step HTML
    let stepHtml = `<h4>📋 Step-by-Step Execution</h4><div class="steps">`;
    steps.forEach((step, index) => {
        let stepClass = 'step-item';
        if (step.type === 'visit') stepClass += ' visit';
        else if (step.type === 'return') stepClass += ' return';
        else if (step.type === 'complete') stepClass += ' complete';
        
        stepHtml += `<div class="${stepClass}">
            <span class="step-number">${index + 1}</span>
            <span class="step-message">${step.message}</span>
        </div>`;
    });
    stepHtml += '</div>';

    // Build result HTML
    let pathString = path.map(c => c.name).join(' → ') + ' → ' + path[0].name;

    let html = `
        <div class="tsp-result">
            <h3>🗺️ TSP Result (Nearest Neighbor)</h3>
            <p><strong>Greedy Strategy:</strong> Always visit the nearest unvisited city</p>
            
            <div class="tsp-path-display">
                <span class="label">Route:</span>
                <span class="path">${pathString}</span>
            </div>

            <div class="tsp-stats">
                <div class="tsp-stat">
                    <div class="label">Total Distance</div>
                    <div class="value">${totalDistance.toFixed(2)}</div>
                </div>
                <div class="tsp-stat">
                    <div class="label">Cities Visited</div>
                    <div class="value">${tspCities.length}</div>
                </div>
                <div class="tsp-stat">
                    <div class="label">Avg. Leg Distance</div>
                    <div class="value">${(totalDistance / tspCities.length).toFixed(2)}</div>
                </div>
            </div>

            <h4>📊 Route Visualization</h4>
            <div class="tsp-canvas-container">
                <canvas id="tspCanvas"></canvas>
            </div>

            <h4>📋 Distance Table</h4>
            <div class="tsp-table">
                <table>
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>To</th>
                            <th>Distance</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    legDistances.forEach(leg => {
        const rowStyle = leg.isReturn ? 'style="background: rgba(251, 188, 4, 0.1);"' : '';
        const label = leg.isReturn ? ' (return)' : '';
        html += `<tr ${rowStyle}>
            <td>${leg.from}</td>
            <td>${leg.to}${label}</td>
            <td>${leg.dist.toFixed(2)}</td>
        </tr>`;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    stepsDiv.innerHTML = stepHtml;
    output.innerHTML = html;
    
    // Draw TSP visualization
    setTimeout(() => drawTsp(path), 100);
}

// TSP CANVAS DRAWING
function drawTsp(path) {
    const canvas = document.getElementById('tspCanvas');
    if (!canvas) return;

    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const size = Math.min(Math.max(rect.width - 40, 400), 900);
    canvas.width = Math.floor(size);
    canvas.height = Math.floor(Math.max(400, size * 0.7));

    const ctx = canvas.getContext('2d');
    const pad = 50;

    // Clear and draw background
    ctx.fillStyle = '#0a0e14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1e2a38';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let x = pad; x < canvas.width - pad; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, pad);
        ctx.lineTo(x, canvas.height - pad);
        ctx.stroke();
    }
    for (let y = pad; y < canvas.height - pad; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(canvas.width - pad, y);
        ctx.stroke();
    }

    // Calculate scaling
    let xs = path.map(c => c.x);
    let ys = path.map(c => c.y);
    let minx = Math.min(...xs), maxx = Math.max(...xs);
    let miny = Math.min(...ys), maxy = Math.max(...ys);
    
    let rangeX = maxx - minx || 1;
    let rangeY = maxy - miny || 1;
    let scaleX = (canvas.width - 2 * pad) / rangeX;
    let scaleY = (canvas.height - 2 * pad) / rangeY;
    let scale = Math.min(scaleX, scaleY);

    // Center offset
    let offsetX = (canvas.width - 2 * pad - rangeX * scale) / 2;
    let offsetY = (canvas.height - 2 * pad - rangeY * scale) / 2;

    function toCanvas(x, y) {
        return {
            x: pad + offsetX + (x - minx) * scale,
            y: pad + offsetY + (y - miny) * scale
        };
    }

    // Draw path lines
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let start = toCanvas(path[0].x, path[0].y);
    ctx.moveTo(start.x, start.y);

    for (let i = 1; i < path.length; i++) {
        let p = toCanvas(path[i].x, path[i].y);
        ctx.lineTo(p.x, p.y);
    }
    
    // Return to start
    ctx.lineTo(start.x, start.y);
    ctx.stroke();

    // Draw return path with different color
    ctx.strokeStyle = '#fbbc04';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    let last = toCanvas(path[path.length - 1].x, path[path.length - 1].y);
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(start.x, start.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw cities
    path.forEach((city, index) => {
        let p = toCanvas(city.x, city.y);
        
        // City circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 18, 0, 2 * Math.PI);
        ctx.fillStyle = '#1a73e8';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // City label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((index + 1).toString(), p.x, p.y);

        // City name
        ctx.fillStyle = '#8b949e';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(city.name, p.x, p.y - 28);
    });

    // Draw start city with special marker
    let first = toCanvas(path[0].x, path[0].y);
    ctx.beginPath();
    ctx.arc(first.x, first.y, 24, 0, 2 * Math.PI);
    ctx.strokeStyle = '#34a853';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw distance labels on path
    ctx.fillStyle = '#fbbc04';
    ctx.font = 'bold 12px Inter, sans-serif';
    for (let i = 0; i < path.length - 1; i++) {
        let p1 = toCanvas(path[i].x, path[i].y);
        let p2 = toCanvas(path[i + 1].x, path[i + 1].y);
        let mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        let dist = distance(path[i], path[i + 1]);
        
        // Background for text
        ctx.fillStyle = 'rgba(10, 14, 20, 0.8)';
        let textWidth = ctx.measureText(dist.toFixed(1)).width;
        ctx.fillRect(mid.x - textWidth/2 - 6, mid.y - 10, textWidth + 12, 20);
        
        ctx.fillStyle = '#fbbc04';
        ctx.fillText(dist.toFixed(1), mid.x, mid.y);
    }
}

function distance(city1, city2) {
    return Math.sqrt((city1.x - city2.x) ** 2 + (city1.y - city2.y) ** 2);
}
