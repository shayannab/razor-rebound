let currentPayload = null;

const btnFetch = document.getElementById('btn-fetch');
const btnDiagnose = document.getElementById('btn-diagnose');
const payloadCode = document.getElementById('payload-code');

const stages = {
    ingestion: document.getElementById('stage-ingestion'),
    rules: document.getElementById('stage-rules'),
    ml: document.getElementById('stage-ml'),
    explanation: document.getElementById('stage-explanation')
};

const results = {
    ingestion: document.getElementById('res-ingestion'),
    rules: document.getElementById('res-rules'),
    ml: document.getElementById('res-ml'),
    explanation: document.getElementById('res-explanation')
};

const finalCard = document.getElementById('final-result-card');
const auditBadge = document.getElementById('audit-id-badge');

function resetUI() {
    Object.values(stages).forEach(stage => {
        stage.classList.remove('active', 'success', 'skipped');
    });
    Object.values(results).forEach(res => {
        res.textContent = 'Waiting...';
    });
    finalCard.classList.add('hidden');
    auditBadge.classList.add('hidden');
    btnDiagnose.disabled = true;
}

btnFetch.addEventListener('click', async () => {
    resetUI();
    payloadCode.textContent = "Fetching...";
    try {
        const response = await fetch('/api/random_test_event');
        currentPayload = await response.json();
        payloadCode.textContent = JSON.stringify(currentPayload, null, 2);
        btnDiagnose.disabled = false;
    } catch (e) {
        payloadCode.textContent = "Error fetching data.";
    }
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStage(stageId, statusClass, text) {
    stages[stageId].className = 'stage'; // Reset
    // Trigger reflow to restart animations if any
    void stages[stageId].offsetWidth;
    stages[stageId].classList.add(statusClass, 'active'); // Add active for glow
    results[stageId].textContent = text;
}

btnDiagnose.addEventListener('click', async () => {
    if (!currentPayload) return;
    
    btnDiagnose.disabled = true;
    btnFetch.disabled = true;
    finalCard.classList.add('hidden');
    auditBadge.classList.add('hidden');

    // Simulate Ingestion (Stage 1)
    updateStage('ingestion', 'active', 'Validating payload & deduplicating...');
    await delay(600);
    
    // Call the actual API in background
    let data;
    try {
        const response = await fetch('/api/diagnose', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(currentPayload)
        });
        data = await response.json();
    } catch (e) {
        updateStage('ingestion', 'skipped', 'Error calling API');
        btnFetch.disabled = false;
        return;
    }

    if (data.status === 'skipped') {
        updateStage('ingestion', 'skipped', 'Duplicate detected. Skipped.');
        btnFetch.disabled = false;
        return;
    }
    
    updateStage('ingestion', 'success', 'Passed validation');
    
    // Stage 2: Rule Engine
    await delay(300);
    updateStage('rules', 'active', 'Evaluating deterministic rules...');
    await delay(600);

    const layer = data.decision_layer;
    if (layer === 'rule_engine') {
        updateStage('rules', 'success', `Matched rule. Cause: ${data.root_cause}`);
        updateStage('ml', 'skipped', 'Skipped (Handled by Rule Engine)');
    } else if (layer === 'ingestion_validation') {
        updateStage('rules', 'skipped', 'Skipped (Missing fields)');
        updateStage('ml', 'skipped', 'Skipped (Missing fields)');
    } else {
        updateStage('rules', 'skipped', 'No deterministic match. Fallback to UNKNOWN.');
        // Stage 3: ML
        await delay(300);
        updateStage('ml', 'active', 'Extracting weak signals for classification...');
        await delay(600);
        
        if (layer === 'ml_classifier') {
            updateStage('ml', 'success', `Predicted: ${data.root_cause} (Conf: ${(data.confidence*100).toFixed(1)}%)`);
        } else {
            updateStage('ml', 'skipped', `Low confidence (${(data.confidence*100).toFixed(1)}%). Escalated to unknown.`);
        }
    }

    // Stage 4: Explanation
    await delay(400);
    updateStage('explanation', 'active', 'Applying templates...');
    await delay(500);
    updateStage('explanation', 'success', 'Explanation generated cleanly.');

    // Final result reveal (includes Audit stage completion implicitly)
    await delay(300);
    
    document.getElementById('final-confidence').textContent = `${(data.confidence*100).toFixed(1)}% Confidence`;
    document.getElementById('final-root-cause').textContent = data.root_cause.replace(/_/g, ' ').toUpperCase();
    document.getElementById('final-explanation-text').textContent = data.explanation;
    document.getElementById('final-next-step').textContent = data.next_step;
    
    auditBadge.textContent = `Audit Log ID: ${data.audit_id}`;
    auditBadge.classList.remove('hidden');
    
    finalCard.classList.remove('hidden');
    btnFetch.disabled = false;
});
