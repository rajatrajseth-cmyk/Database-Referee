// Database comparison data and logic
// This object contains all the pros, cons, and decision logic for MySQL and MongoDB

const databaseData = {
    mysql: {
        name: "MySQL",
        basePros: [
            "ACID compliance ensures data consistency",
            "Mature ecosystem with extensive documentation",
            "Strong community support and resources",
            "Excellent for complex queries and joins",
            "Reliable backup and recovery tools"
        ],
        baseCons: [
            "Rigid schema requires planning ahead",
            "Vertical scaling can be expensive",
            "Less flexible for rapidly changing requirements",
            "Complex setup for high availability"
        ]
    },
    mongodb: {
        name: "MongoDB",
        basePros: [
            "Flexible schema adapts to changing needs",
            "Natural fit for JSON/JavaScript applications",
            "Built-in horizontal scaling (sharding)",
            "Fast development for document-based data",
            "Good performance for read-heavy workloads"
        ],
        baseCons: [
            "Learning curve for SQL developers",
            "Less mature ecosystem than relational databases",
            "Can use more memory than SQL databases",
            "Limited complex query capabilities compared to SQL"
        ]
    }
};

// Additional pros/cons based on user selections
const conditionalPoints = {
    mysql: {
        pros: {
            small: ["Lower resource requirements for small datasets"],
            structured: ["Perfect match for relational data"],
            low: ["Proven stability for moderate traffic"],
            beginner: ["Familiar SQL syntax", "Extensive learning resources"]
        },
        cons: {
            large: ["Scaling challenges with very large datasets"],
            "semi-structured": ["Awkward handling of JSON and flexible data"],
            high: ["Complex sharding setup required"],
            beginner: ["Database design requires upfront planning"]
        }
    },
    mongodb: {
        pros: {
            large: ["Excellent horizontal scaling capabilities"],
            "semi-structured": ["Native JSON document storage"],
            high: ["Built-in sharding and replication"],
            advanced: ["Powerful aggregation framework"]
        },
        cons: {
            small: ["May be overkill for simple applications"],
            structured: ["Less efficient for highly relational data"],
            low: ["Additional complexity may not be needed"],
            beginner: ["Different mindset from traditional databases"]
        }
    }
};

// DOM elements - getting references to HTML elements we'll manipulate
const projectSizeSelect = document.getElementById('project-size');
const dataTypeSelect = document.getElementById('data-type');
const scalabilitySelect = document.getElementById('scalability');
const experienceSelect = document.getElementById('experience');
const analyzeBtn = document.getElementById('analyze-btn');
const resetBtn = document.getElementById('reset-btn');
const resultsSection = document.getElementById('results');

// Results display elements
const mysqlProsList = document.getElementById('mysql-pros');
const mysqlConsList = document.getElementById('mysql-cons');
const mongodbProsList = document.getElementById('mongodb-pros');
const mongodbConsList = document.getElementById('mongodb-cons');
const tradeofsContent = document.getElementById('tradeoffs-content');
const recommendationContent = document.getElementById('recommendation-content');

// Event listeners - connecting user actions to our functions
analyzeBtn.addEventListener('click', analyzeOptions);
resetBtn.addEventListener('click', resetForm);

// Input validation - check if all fields are selected
function validateInputs() {
    const inputs = [projectSizeSelect, dataTypeSelect, scalabilitySelect, experienceSelect];
    return inputs.every(input => input.value !== '');
}

// Enable/disable analyze button based on input validation
function updateAnalyzeButton() {
    analyzeBtn.disabled = !validateInputs();
}

// Add event listeners to all select elements to update button state
[projectSizeSelect, dataTypeSelect, scalabilitySelect, experienceSelect].forEach(select => {
    select.addEventListener('change', updateAnalyzeButton);
});

// Main analysis function - this is where the magic happens!
function analyzeOptions() {
    if (!validateInputs()) {
        alert('Please fill in all fields before analyzing.');
        return;
    }

    // Get user selections
    const userChoices = {
        projectSize: projectSizeSelect.value,
        dataType: dataTypeSelect.value,
        scalability: scalabilitySelect.value,
        experience: experienceSelect.value
    };

    // Generate pros and cons for each database
    const mysqlAnalysis = generateAnalysis('mysql', userChoices);
    const mongodbAnalysis = generateAnalysis('mongodb', userChoices);

    // Display the results
    displayResults(mysqlAnalysis, mongodbAnalysis, userChoices);
    
    // Show results section with smooth scroll
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Generate analysis for a specific database based on user choices
function generateAnalysis(dbType, choices) {
    const db = databaseData[dbType];
    const conditional = conditionalPoints[dbType];
    
    // Start with base pros and cons
    let pros = [...db.basePros];
    let cons = [...db.baseCons];
    
    // Add conditional pros based on user selections
    Object.values(choices).forEach(choice => {
        if (conditional.pros[choice]) {
            pros.push(...conditional.pros[choice]);
        }
        if (conditional.cons[choice]) {
            cons.push(...conditional.cons[choice]);
        }
    });
    
    return { pros, cons };
}

// Display results in the HTML
function displayResults(mysqlAnalysis, mongodbAnalysis, choices) {
    // Clear previous results
    mysqlProsList.innerHTML = '';
    mysqlConsList.innerHTML = '';
    mongodbProsList.innerHTML = '';
    mongodbConsList.innerHTML = '';
    
    // Populate MySQL pros and cons
    mysqlAnalysis.pros.forEach(pro => {
        const li = document.createElement('li');
        li.textContent = pro;
        mysqlProsList.appendChild(li);
    });
    
    mysqlAnalysis.cons.forEach(con => {
        const li = document.createElement('li');
        li.textContent = con;
        mysqlConsList.appendChild(li);
    });
    
    // Populate MongoDB pros and cons
    mongodbAnalysis.pros.forEach(pro => {
        const li = document.createElement('li');
        li.textContent = pro;
        mongodbProsList.appendChild(li);
    });
    
    mongodbAnalysis.cons.forEach(con => {
        const li = document.createElement('li');
        li.textContent = con;
        mongodbConsList.appendChild(li);
    });
    
    // Generate and display trade-offs
    displayTradeoffs(choices);
    
    // Generate and display recommendation
    displayRecommendation(choices);
}

// Generate trade-offs based on user selections
function displayTradeoffs(choices) {
    const tradeoffs = generateTradeoffs(choices);
    
    tradeofsContent.innerHTML = '';
    tradeoffs.forEach(tradeoff => {
        const div = document.createElement('div');
        div.className = 'tradeoff-item';
        div.innerHTML = `
            <h4>${tradeoff.title}</h4>
            <p>${tradeoff.description}</p>
        `;
        tradeofsContent.appendChild(div);
    });
}

// Trade-off generation logic based on user choices
function generateTradeoffs(choices) {
    const tradeoffs = [];
    
    // Project size trade-offs
    if (choices.projectSize === 'small') {
        tradeoffs.push({
            title: "Simplicity vs Future Growth",
            description: "MySQL offers simplicity for small projects, but MongoDB provides more flexibility if you plan to scale rapidly."
        });
    } else if (choices.projectSize === 'large') {
        tradeoffs.push({
            title: "Scaling Approach",
            description: "MySQL requires more planning for horizontal scaling, while MongoDB scales out more naturally but with increased complexity."
        });
    }
    
    // Data type trade-offs
    if (choices.dataType === 'structured') {
        tradeoffs.push({
            title: "Data Relationships",
            description: "MySQL excels at complex relationships and joins, while MongoDB requires denormalization and careful schema design."
        });
    } else {
        tradeoffs.push({
            title: "Schema Flexibility",
            description: "MongoDB handles changing schemas naturally, while MySQL requires migrations and careful planning for schema changes."
        });
    }
    
    // Experience level trade-offs
    if (choices.experience === 'beginner') {
        tradeoffs.push({
            title: "Learning Curve",
            description: "MySQL leverages familiar SQL knowledge, while MongoDB introduces new concepts but may be more intuitive for JavaScript developers."
        });
    }
    
    return tradeoffs;
}

// Generate neutral recommendation
function displayRecommendation(choices) {
    const recommendation = generateRecommendation(choices);
    
    recommendationContent.innerHTML = `
        <div class="recommendation-content">
            <p><strong>Based on your requirements:</strong></p>
            <p>${recommendation}</p>
            <p><em>Remember: Both databases are excellent choices. The "best" option depends on your specific context, team expertise, and long-term goals. Consider prototyping with both to see which feels more natural for your use case.</em></p>
        </div>
    `;
}

// Recommendation logic - neutral and educational
function generateRecommendation(choices) {
    let mysqlScore = 0;
    let mongodbScore = 0;
    
    // Scoring based on choices (this helps generate balanced recommendations)
    if (choices.projectSize === 'small') mysqlScore += 1;
    if (choices.projectSize === 'large') mongodbScore += 1;
    
    if (choices.dataType === 'structured') mysqlScore += 2;
    if (choices.dataType === 'semi-structured') mongodbScore += 2;
    
    if (choices.scalability === 'low') mysqlScore += 1;
    if (choices.scalability === 'high') mongodbScore += 1;
    
    if (choices.experience === 'beginner') mysqlScore += 1;
    if (choices.experience === 'advanced') mongodbScore += 1;
    
    // Generate balanced recommendation
    if (mysqlScore > mongodbScore + 1) {
        return `Your requirements lean toward MySQL due to ${getReasoningText(choices, 'mysql')}. However, consider MongoDB if you anticipate rapid schema changes or need to scale horizontally in the future.`;
    } else if (mongodbScore > mysqlScore + 1) {
        return `Your requirements lean toward MongoDB due to ${getReasoningText(choices, 'mongodb')}. However, consider MySQL if you have strong relational data requirements or prefer SQL's mature ecosystem.`;
    } else {
        return `Your requirements could work well with either database. Consider your team's expertise, existing infrastructure, and long-term maintenance preferences. Both MySQL and MongoDB can handle your use case effectively with proper implementation.`;
    }
}

// Helper function to generate reasoning text
function getReasoningText(choices, favoredDb) {
    const reasons = [];
    
    if (favoredDb === 'mysql') {
        if (choices.dataType === 'structured') reasons.push('your structured data needs');
        if (choices.projectSize === 'small') reasons.push('the manageable project size');
        if (choices.experience === 'beginner') reasons.push('the familiar SQL approach');
    } else {
        if (choices.dataType === 'semi-structured') reasons.push('your flexible data requirements');
        if (choices.scalability === 'high') reasons.push('your high scalability needs');
        if (choices.projectSize === 'large') reasons.push('the enterprise-scale requirements');
    }
    
    return reasons.length > 0 ? reasons.join(' and ') : 'your specific requirements';
}

// Reset form function
function resetForm() {
    // Clear all selections
    projectSizeSelect.value = '';
    dataTypeSelect.value = '';
    scalabilitySelect.value = '';
    experienceSelect.value = '';
    
    // Hide results
    resultsSection.style.display = 'none';
    
    // Update button state
    updateAnalyzeButton();
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set initial button state
    updateAnalyzeButton();
    
    // Add some interactive feedback
    console.log('Database Referee loaded successfully! 🏆');
});