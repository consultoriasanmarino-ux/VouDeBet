export type SymbolID = number;

export interface Point {
    r: number;
    c: number;
}

export interface Cluster {
    symbol: SymbolID;
    points: Point[];
    basePayout: number;
    totalPayout: number;
    multiplierSum: number;
}

export interface TumbleStep {
    grid: SymbolID[][];
    clusters: Cluster[];
    currentMultipliers: Record<number, number>; // index (0-48) -> value
    stepWin: number;
}

export interface SpinResult {
    steps: TumbleStep[];
    totalWin: number;
    bet: number;
    finalMultipliers: Record<number, number>;
}

// Configuração dos Símbolos
// 1: Scatter (Free Spins)
// 2: Urso Laranja, 3: Urso Roxo, 4: Urso Vermelho
// 5: Estrela, 6: Feijão, 7: Coração, 8: Pirulito (Rosa)
const SYMBOLS = [1, 2, 3, 4, 5, 6, 7, 8];

// Pesos para geração aleatória (Símbolos mais fracos aparecem mais)
const WEIGHTS = [
    { s: 1, w: 2 },   // Scatter (muito raro)
    { s: 2, w: 25 },  // Urso Laranja
    { s: 3, w: 25 },  // Urso Roxo
    { s: 4, w: 20 },  // Urso Vermelho
    { s: 5, w: 15 },  // Estrela Verde
    { s: 6, w: 10 },  // Feijão Rosa
    { s: 7, w: 8 },   // Coração Laranja
    { s: 8, w: 5 },   // Pirulito Rosa (Mais valioso)
];

const ROWS = 7;
const COLS = 7;

function getRandomSymbol(): SymbolID {
    const totalWeight = WEIGHTS.reduce((acc, curr) => acc + curr.w, 0);
    let r = Math.random() * totalWeight;
    for (const item of WEIGHTS) {
        if (r < item.w) return item.s;
        r -= item.w;
    }
    return WEIGHTS[0].s;
}

function generateGrid(): SymbolID[][] {
    const grid: SymbolID[][] = [];
    for (let r = 0; r < ROWS; r++) {
        const row: SymbolID[] = [];
        for (let c = 0; c < COLS; c++) {
            row.push(getRandomSymbol());
        }
        grid.push(row);
    }
    return grid;
}

// Calcula o pagamento base de um cluster (baseado no Sugar Rush real simplificado)
function getBasePayout(symbol: SymbolID, count: number, bet: number): number {
    if (count < 5) return 0;

    // Tabela simplificada de multiplicadores da aposta baseada no símbolo e tamanho
    const paytable: Record<number, number> = {
        2: 0.2, 3: 0.25, 4: 0.3,
        5: 0.4, 6: 0.5, 7: 0.75, 8: 1.0
    };

    let base = paytable[symbol] || 0.1;
    // Bônus por tamanho adicional > 5
    let extra = (count - 5) * (base * 0.5);

    // Limite máximo brutal para 15+ (Ex: 150x a aposta base)
    if (count >= 15) extra = base * 20;

    return (base + extra) * bet;
}

// Algoritmo de Busca de Clusters (Flood Fill / DFS)
function findClusters(grid: SymbolID[][]): { points: Point[], symbol: SymbolID }[] {
    const visited: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const clusters: { points: Point[], symbol: SymbolID }[] = [];

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    function dfs(r: number, c: number, symbol: SymbolID, currentCluster: Point[]) {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
        if (visited[r][c] || grid[r][c] !== symbol) return;

        visited[r][c] = true;
        currentCluster.push({ r, c });

        for (const [dr, dc] of directions) {
            dfs(r + dr, c + dc, symbol, currentCluster);
        }
    }

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!visited[r][c] && grid[r][c] !== 1) { // 1 é scatter, scatter não forma cluster direto
                const currentCluster: Point[] = [];
                dfs(r, c, grid[r][c], currentCluster);
                if (currentCluster.length >= 5) {
                    clusters.push({ points: currentCluster, symbol: grid[r][c] });
                }
            }
        }
    }

    return clusters;
}

function dropSymbols(grid: SymbolID[][], clustersToExplode: Cluster[]): SymbolID[][] {
    const newGrid = grid.map(row => [...row]);

    // Marca posições que explodiram como 0
    for (const cluster of clustersToExplode) {
        for (const p of cluster.points) {
            newGrid[p.r][p.c] = 0;
        }
    }

    // Faz os símbolos caírem
    for (let c = 0; c < COLS; c++) {
        let writeR = ROWS - 1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (newGrid[r][c] !== 0) {
                newGrid[writeR][c] = newGrid[r][c];
                if (writeR !== r) newGrid[r][c] = 0;
                writeR--;
            }
        }
        // Preenche o topo restante com novos símbolos aleatórios
        for (let r = writeR; r >= 0; r--) {
            newGrid[r][c] = getRandomSymbol();
        }
    }

    return newGrid;
}

export function playSpin(bet: number, initialMultipliers: Record<number, number> = {}): SpinResult {
    let currentGrid = generateGrid();
    let currentMultipliers: Record<number, number> = { ...initialMultipliers };

    // activeMultipliersLocations sabe onde houve explosão neste giro atual para dobrar, mas
    // as posições que JÁ tinham multiplicador antes do giro iniciam "dobráveis"
    let activeMultipliersLocations = new Set<number>(
        Object.keys(initialMultipliers).map(k => parseInt(k))
    );

    const steps: TumbleStep[] = [];
    let totalWin = 0;

    let isTumbling = true;
    let safetyCounter = 0;

    while (isTumbling && safetyCounter < 50) {
        safetyCounter++;

        // Encontra clusters na grade atual
        const rawClusters = findClusters(currentGrid);

        if (rawClusters.length === 0) {
            // Se for o primeiro step (sem ganhos iniciais), grava ele pra mostrar a tela final
            if (steps.length === 0) {
                steps.push({
                    grid: currentGrid.map(r => [...r]),
                    clusters: [],
                    currentMultipliers: { ...currentMultipliers },
                    stepWin: 0
                });
            }
            break;
        }

        let stepWin = 0;
        const processedClusters: Cluster[] = [];

        // Calcula ganhos para cada cluster
        for (const raw of rawClusters) {
            let basePayout = getBasePayout(raw.symbol, raw.points.length, bet);

            // Soma multiplicadores das posições desse cluster
            let multiplierSum = 0;
            for (const p of raw.points) {
                const index = p.r * COLS + p.c;
                if (currentMultipliers[index]) {
                    multiplierSum += currentMultipliers[index];
                }
            }

            // Regra do jogo: Multiplicadores se somam antes de multiplicar (Ex: uma célula tem 2x, a outra tem 4x = multiplica o cluster por 6x)
            const finalMultiplier = multiplierSum > 0 ? multiplierSum : 1;
            const totalPayout = basePayout * finalMultiplier;

            stepWin += totalPayout;

            processedClusters.push({
                symbol: raw.symbol,
                points: raw.points,
                basePayout,
                multiplierSum,
                totalPayout
            });
        }

        totalWin += stepWin;

        // Grava o passo (A grade de AGORA, com as vitórias de AGORA prontas pra explodir)
        steps.push({
            grid: currentGrid.map(r => [...r]),
            clusters: processedClusters,
            currentMultipliers: { ...currentMultipliers },
            stepWin
        });

        // Atualiza as trilhas multiplicadoras (Spots)
        for (const cluster of processedClusters) {
            for (const p of cluster.points) {
                const index = p.r * COLS + p.c;
                if (activeMultipliersLocations.has(index)) {
                    // Já houve explosão aqui, dobre o valor (inicia em 2x, até 128x no máximo comum)
                    if (!currentMultipliers[index]) {
                        currentMultipliers[index] = 2;
                    } else {
                        currentMultipliers[index] = Math.min(128, currentMultipliers[index] * 2);
                    }
                } else {
                    // Primeira explosão crava a marca
                    activeMultipliersLocations.add(index);
                }
            }
        }

        // Aplica queda
        currentGrid = dropSymbols(currentGrid, processedClusters);
    } // Fim Tumble

    // Adiciona o passo final (tela em repouso após os tumbles terminarem, sem ganhos)
    if (steps.length > 0 && steps[steps.length - 1].clusters.length > 0) {
        steps.push({
            grid: currentGrid.map(r => [...r]),
            clusters: [],
            currentMultipliers: { ...currentMultipliers },
            stepWin: 0
        });
    }

    return {
        steps,
        totalWin,
        bet,
        finalMultipliers: currentMultipliers
    };
}
