let items = [];
let binItems = [];
let tspCities = [];

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
        // Auto hide after 5 seconds
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

        if (algo) {
            heroSection.style.display = 'none';
        } else {
            heroSection.style.display = 'block';
        }

        inputsDiv.innerHTML = '';
        items = [];
        binItems = [];
        tspCities = [];

        updateSidebar(algo);

        if (algo === 'binpacking') {
            inputsDiv.innerHTML = `
                <div class="input-group">
                    <label for="binCapacity">Bin Capacity:</label>
                    <input type="number" id="binCapacity" value="10" min="1">
                </div>
                <h4>Add Items</h4>
                <div class="input-group">
                    <label for="itemName">Item Name:</label>
                    <input type="text" id="itemName" placeholder="e.g., Item1">
                </div>
                <div class="input-group">
                    <label for="itemSize">Size:</label>
                    <input type="number" id="itemSize" min="1" placeholder="5">
                </div>
                <button id="addBinItemBtn">Add Item</button>
                <div id="binItemList"></div>
            `;
            document.getElementById('addBinItemBtn').addEventListener('click', addBinItem);
            // Keyboard navigation
            addKeyboardNav('itemName', 'itemSize');
            addKeyboardNav('itemSize', null, addBinItem);
        } else if (algo === 'knapsack01') {
            inputsDiv.innerHTML = `
                <div class="input-group">
                    <label for="capacity">Knapsack Capacity:</label>
                    <input type="number" id="capacity" value="50" min="1">
                </div>
                <h4>Add Items</h4>
                <div class="input-group">
                    <label for="itemName">Item Name:</label>
                    <input type="text" id="itemName" placeholder="e.g., Item1">
                </div>
                <div class="input-group">
                    <label for="itemWeight">Weight:</label>
                    <input type="number" id="itemWeight" min="1" placeholder="10">
                </div>
                <div class="input-group">
                    <label for="itemValue">Value:</label>
                    <input type="number" id="itemValue" min="1" placeholder="60">
                </div>
                <button id="addItemBtn">Add Item</button>
                <div id="itemList"></div>
            `;
            document.getElementById('addItemBtn').addEventListener('click', addItem);
            // Keyboard navigation
            addKeyboardNav('itemName', 'itemWeight');
            addKeyboardNav('itemWeight', 'itemValue');
            addKeyboardNav('itemValue', null, addItem);
        } else if (algo === 'tsp') {
            inputsDiv.innerHTML = `
                <h4>Add Cities</h4>
                <div class="input-group">
                    <label for="cityName">City Name:</label>
                    <input type="text" id="cityName" placeholder="e.g., City1">
                </div>
                <div class="input-group">
                    <label for="cityX">X Coordinate:</label>
                    <input type="number" id="cityX" placeholder="0">
                </div>
                <div class="input-group">
                    <label for="cityY">Y Coordinate:</label>
                    <input type="number" id="cityY" placeholder="0">
                </div>
                <button id="addCityBtn">Add City</button>
                <div id="cityList"></div>
            `;
            document.getElementById('addCityBtn').addEventListener('click', addCity);
            // Keyboard navigation
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
                    <p>Given a set of items with sizes and bins with fixed capacity, pack all items into the minimum number of bins.</p>
                </div>
                <div class="flowchart">
                    <h4>Algorithm Flow:</h4>
                    <pre>
Start
│
├─ Sort items (optional)
│
├─ For each item:
│  ├─ Try to place in existing bin
│  └─ If no fit, create new bin
│
End
                    </pre>
                </div>
                <div class="key-points">
                    <h4>Key Points:</h4>
                    <ul>
                        <li><strong>NP-hard:</strong> Reduction from Partition Problem</li>
                        <li><strong>First-Fit Algorithm:</strong> Place in first bin with space</li>
                        <li><strong>Time Complexity:</strong> O(n²) in worst case</li>
                        <li><strong>Decision Version:</strong> Can items fit in k bins?</li>
                        <li><strong>Applications:</strong> Memory management, file storage</li>
                        <li><strong>Online vs Offline:</strong> Items known in advance or not</li>
                        <li><strong>Performance Guarantee:</strong> ≤ 1.7 × optimal bins</li>
                        <li><strong>Related Problems:</strong> Cutting stock, multiprocessor scheduling</li>
                    </ul>
                </div>
            `;
        } else if (algo === 'knapsack01') {
            sidebar.innerHTML = `
                <div class="definition">
                    <h4>🎒 0/1 Knapsack Problem</h4>
                    <p>Given items with weights and values, and a knapsack with capacity, select items to maximize total value without exceeding capacity. Each item can be taken 0 or 1 time.</p>
                </div>
                <div class="flowchart">
                    <h4>Greedy Approach:</h4>
                    <pre>
Start
│
├─ Calculate value/weight ratio
│
├─ Sort items by ratio descending
│
├─ Add items if they fit
│
End
                    </pre>
                </div>
                <div class="key-points">
                    <h4>Key Points:</h4>
                    <ul>
                        <li><strong>DP Solution:</strong> K[i][w] = max(K[i-1][w], K[i-1][w-wi] + vi)</li>
                        <li><strong>Time/Space:</strong> O(nW), can optimize to O(W) space</li>
                        <li><strong>Greedy Failure:</strong> Items: (10,60), (20,100), (30,120), W=50</li>
                        <li><strong>Fractional vs 0/1:</strong> Fractional allows partial items</li>
                        <li><strong>NP-complete:</strong> Reduction from Subset Sum</li>
                        <li><strong>Unbounded Variant:</strong> Unlimited item copies</li>
                        <li><strong>Decision Problem:</strong> Subset with exact weight/value</li>
                        <li><strong>Applications:</strong> Budget allocation, cargo loading</li>
                    </ul>
                </div>
            `;
        } else if (algo === 'tsp') {
            sidebar.innerHTML = `
                <div class="definition">
                    <h4>🗺️ Traveling Salesman Problem</h4>
                    <p>Given cities and distances, find the shortest route that visits each city exactly once and returns to the starting city.</p>
                </div>
                <div class="flowchart">
                    <h4>Nearest Neighbor:</h4>
                    <pre>
Start at city A
│
├─ Visit nearest unvisited city
│
├─ Repeat until all visited
│
└─ Return to start
                    </pre>
                </div>
                <div class="key-points">
                    <h4>Key Points:</h4>
                    <ul>
                        <li><strong>NP-complete:</strong> Certificate in polynomial time</li>
                        <li><strong>Brute Force:</strong> Check all (n-1)!/2 Hamiltonian cycles</li>
                        <li><strong>DP Solution:</strong> O(n² × 2ⁿ) for small n</li>
                        <li><strong>Approximation:</strong> 1.5-approximation for metric TSP</li>
                        <li><strong>Triangle Inequality:</strong> dist(a,c) ≤ dist(a,b) + dist(b,c)</li>
                        <li><strong>MST Heuristic:</strong> TSP cost ≤ 2 × MST cost</li>
                        <li><strong>Real Applications:</strong> Circuit board drilling, vehicle routing</li>
                        <li><strong>Complexity Class:</strong> NP-hard optimization problem</li>
                    </ul>
                </div>
            `;
        } else {
            sidebar.innerHTML = `
                <div class="welcome-section">
                    <h4>🎯 Welcome to DAA Algorithm Simulator!</h4>
                    <p>Explore classic NP-hard optimization problems and their greedy solutions.</p>
                    
                    <div class="algorithm-preview">
                        <h5>📚 Available Algorithms:</h5>
                        <div class="algo-card">
                            <span class="algo-emoji">📦</span>
                            <div>
                                <strong>Bin Packing</strong><br>
                                <small>Pack items into minimum bins</small>
                            </div>
                        </div>
                        <div class="algo-card">
                            <span class="algo-emoji">🎒</span>
                            <div>
                                <strong>0/1 Knapsack</strong><br>
                                <small>Maximize value with constraints</small>
                            </div>
                        </div>
                        <div class="algo-card">
                            <span class="algo-emoji">🗺️</span>
                            <div>
                                <strong>TSP</strong><br>
                                <small>Find shortest route visiting all cities</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="fun-fact">
                        <h5>💡 Did You Know?</h5>
                        <p>These problems are NP-hard, meaning no fast optimal solutions exist for large inputs!</p>
                    </div>
                    
                    <div class="ascii-art">
                        <pre>
   🤖 Algorithm Fun:

   → NP-hard problems are like puzzles
     that get exponentially harder as they grow!

   → But greedy algorithms give us practical
     solutions when perfection is too slow.

   → Choose wisely - sometimes "good enough"
     is better than waiting forever!
                        </pre>
                    </div>
                    
                    <p class="instruction">👆 Select an algorithm above to start learning!</p>
                </div>
            `;
        }
    }

    function addActivity() {
        const name = document.getElementById('actName').value.trim();
        const start = parseInt(document.getElementById('actStart').value);
        const end = parseInt(document.getElementById('actEnd').value);

        if (!name || isNaN(start) || isNaN(end) || start >= end) {
            alert('Please enter valid activity details. Start time must be less than end time.');
            return;
        }

        activities.push({ name, start, end });
        updateActivityList();
        // Clear inputs
        document.getElementById('actName').value = '';
        document.getElementById('actStart').value = '';
        document.getElementById('actEnd').value = '';
        // Focus back to name for next entry
        document.getElementById('actName').focus();
    }

    function updateActivityList() {
        const listDiv = document.getElementById('activityList');
        listDiv.innerHTML = '<h4>Added Activities:</h4><ul>';
        activities.forEach((act, index) => {
            listDiv.innerHTML += `<li>${act.name} (Start: ${act.start}, End: ${act.end}) <button onclick="removeActivity(${index})">Remove</button></li>`;
        });
        listDiv.innerHTML += '</ul>';
    }

    function addItem() {
        const name = document.getElementById('itemName').value.trim();
        const weight = parseInt(document.getElementById('itemWeight').value);
        const value = parseInt(document.getElementById('itemValue').value);

        if (!name || isNaN(weight) || isNaN(value) || weight <= 0 || value <= 0) {
            showError('Please enter valid item details. Weight and value must be positive numbers.');
            return;
        }

        items.push({ name, weight, value });
        updateItemList();
        // Clear inputs
        document.getElementById('itemName').value = '';
        document.getElementById('itemWeight').value = '';
        document.getElementById('itemValue').value = '';
        // Focus back
        document.getElementById('itemName').focus();
    }

    function updateItemList() {
        const listDiv = document.getElementById('itemList');
        listDiv.innerHTML = '<h4>Added Items:</h4><ul>';
        items.forEach((item, index) => {
            listDiv.innerHTML += `<li>${item.name} (Weight: ${item.weight}, Value: ${item.value}) <button onclick="removeItem(${index})">Remove</button></li>`;
        });
        listDiv.innerHTML += '</ul>';
    }

    function addBinItem() {
        const name = document.getElementById('itemName').value.trim();
        const size = parseInt(document.getElementById('itemSize').value);

        if (!name || isNaN(size) || size <= 0) {
            showError('Please enter valid item details. Size must be positive.');
            return;
        }

        binItems.push({ name, size });
        updateBinItemList();
        // Clear inputs
        document.getElementById('itemName').value = '';
        document.getElementById('itemSize').value = '';
        // Focus back
        document.getElementById('itemName').focus();
    }

    function updateBinItemList() {
        const listDiv = document.getElementById('binItemList');
        listDiv.innerHTML = '<h4>Added Items:</h4><ul>';
        binItems.forEach((item, index) => {
            listDiv.innerHTML += `<li>${item.name} (Size: ${item.size}) <button onclick="removeBinItem(${index})">Remove</button></li>`;
        });
        listDiv.innerHTML += '</ul>';
    }

    function addCity() {
        const name = document.getElementById('cityName').value.trim();
        const x = parseFloat(document.getElementById('cityX').value);
        const y = parseFloat(document.getElementById('cityY').value);

        if (!name || isNaN(x) || isNaN(y)) {
            showError('Please enter valid city details.');
            return;
        }

        tspCities.push({ name, x, y });
        updateCityList();
        // Clear inputs
        document.getElementById('cityName').value = '';
        document.getElementById('cityX').value = '';
        document.getElementById('cityY').value = '';
        // Focus back
        document.getElementById('cityName').focus();
    }

    function updateCityList() {
        const listDiv = document.getElementById('cityList');
        listDiv.innerHTML = '<h4>Added Cities:</h4><ul>';
        tspCities.forEach((city, index) => {
            listDiv.innerHTML += `<li>${city.name} (${city.x}, ${city.y}) <button onclick="removeCity(${index})">Remove</button></li>`;
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

        // Show hero section and update sidebar
        showInputs();
    }
});

function run() {
    const algo = document.getElementById("algorithm").value;
    const output = document.getElementById("output");

    if (algo === "") {
        output.innerHTML = "<p class='result-highlight'>Please select an algorithm.</p>";
        return;
    }

    // Show loading
    output.innerHTML = "<p class='loading'>🧠 Running algorithm... Please wait.</p>";

    // Simulate processing time (optional, for effect)
    setTimeout(() => {
        if (algo === "binpacking") {
            binPacking(output);
        } else if (algo === "knapsack01") {
            knapsack01(output);
        } else if (algo === "tsp") {
            tsp(output);
        }
    }, 500); // 0.5 second delay for visual effect
}

function binPacking(output) {
    const capacity = parseInt(document.getElementById('binCapacity').value);

    if (binItems.length === 0) {
        output.innerHTML = "<p class='result-highlight'>Please add at least one item.</p>";
        return;
    }

    // First Fit Bin Packing
    let bins = [];
    binItems.forEach(item => {
        let placed = false;
        for (let bin of bins) {
            if (bin.remaining >= item.size) {
                bin.items.push(item);
                bin.remaining -= item.size;
                placed = true;
                break;
            }
        }
        if (!placed) {
            bins.push({ items: [item], remaining: capacity - item.size });
        }
    });

    let html = "<h3>Bin Packing Result</h3>";
    html += "<p><b>Greedy Rule:</b> First Fit - Place item in first bin with enough space.</p>";
    html += "<p><b>Bin Capacity:</b> " + capacity + "</p>";
    html += "<p><b>Number of Bins Used:</b> " + bins.length + "</p>";
    html += "<h4>Bin Contents:</h4>";

    bins.forEach((bin, index) => {
        html += `<h5>Bin ${index + 1} (Remaining: ${bin.remaining}):</h5><ul>`;
        bin.items.forEach(item => {
            html += `<li>${item.name} (Size: ${item.size})</li>`;
        });
        html += "</ul>";
    });

    output.innerHTML = html;
}

function knapsack01(output) {
    const capacity = parseInt(document.getElementById('capacity').value);

    if (items.length === 0) {
        output.innerHTML = "<p class='result-highlight'>Please add at least one item.</p>";
        return;
    }

    // Greedy for 0/1 Knapsack (sort by value/weight, take if fits)
    let its = [...items];
    its.forEach(item => {
        item.ratio = item.value / item.weight;
    });
    its.sort((a, b) => b.ratio - a.ratio);

    let totalValue = 0;
    let selectedItems = [];
    let remainingCapacity = capacity;

    for (let item of its) {
        if (remainingCapacity >= item.weight) {
            selectedItems.push(item);
            totalValue += item.value;
            remainingCapacity -= item.weight;
        }
    }

    let html = "<h3>0/1 Knapsack Result</h3>";
    html += "<p><b>Greedy Rule:</b> Sort by value-to-weight ratio, take items that fit (approximation).</p>";
    html += "<p><b>Selected Items:</b></p>";
    html += "<ul>";

    selectedItems.forEach(item => {
        html += `<li>${item.name} (Weight: ${item.weight}, Value: ${item.value})</li>`;
    });

    html += "</ul>";
    html += `<p class="result-highlight"><b>Total Value:</b> ${totalValue}</p>`;
    html += `<p><b>Remaining Capacity:</b> ${remainingCapacity}</p>`;

    output.innerHTML = html;
}

function tsp(output) {
    if (tspCities.length < 2) {
        output.innerHTML = "<p class='result-highlight'>Please add at least two cities.</p>";
        return;
    }

    // Nearest Neighbor TSP
    let unvisited = [...tspCities];
    let path = [unvisited.shift()]; // Start with first city
    let totalDistance = 0;

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

        totalDistance += minDist;
        path.push(unvisited.splice(nearestIndex, 1)[0]);
    }

    // Return to start
    totalDistance += distance(path[path.length - 1], path[0]);

    let html = "<h3>TSP Result (Nearest Neighbor)</h3>";
    html += "<p><b>Greedy Rule:</b> Start at first city, always visit nearest unvisited city.</p>";
    html += "<p><b>Path:</b> " + path.map(c => c.name).join(" → ") + " → " + path[0].name + "</p>";
    html += `<p class="result-highlight"><b>Total Distance:</b> ${totalDistance.toFixed(2)}</p>`;

    output.innerHTML = html;
}

function distance(city1, city2) {
    return Math.sqrt((city1.x - city2.x) ** 2 + (city1.y - city2.y) ** 2);
}
