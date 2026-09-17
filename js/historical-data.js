const BENCHMARK_DATA = {
  nifty50: {
    name: "Nifty 50 TRI", category: "Large Cap Benchmark", color: "#00D293", cagr25Y: 14.1,
    levels: { 2000: 1263, 2001: 1059, 2002: 1093, 2003: 1879, 2004: 2080, 2005: 2836, 2006: 3966, 2007: 6138, 2008: 2959, 2009: 5201, 2010: 6134, 2011: 4624, 2012: 5905, 2013: 6304, 2014: 8282, 2015: 7946, 2016: 8185, 2017: 10530, 2018: 10862, 2019: 12168, 2020: 13981, 2021: 17354, 2022: 18105, 2023: 21731, 2024: 24150, 2025: 26200 }
  },
  niftyNext50: {
    name: "Nifty Next 50 TRI", category: "Large-Mid Alpha", color: "#3B82F6", cagr25Y: 16.8,
    levels: { 2000: 1210, 2001: 890, 2002: 950, 2003: 2450, 2004: 3100, 2005: 4800, 2006: 6200, 2007: 10600, 2008: 4100, 2009: 8900, 2010: 11200, 2011: 8200, 2012: 11400, 2013: 12100, 2014: 18500, 2015: 19800, 2016: 21600, 2017: 31800, 2018: 27900, 2019: 28400, 2020: 32900, 2021: 43100, 2022: 44200, 2023: 53800, 2024: 67200, 2025: 74500 }
  },
  niftyMidcap150: {
    name: "Nifty Midcap 150 TRI", category: "Mid Cap Benchmark", color: "#F5A623", cagr25Y: 18.2,
    levels: { 2000: 950, 2001: 720, 2002: 810, 2003: 2150, 2004: 2980, 2005: 4600, 2006: 5950, 2007: 10400, 2008: 3600, 2009: 7800, 2010: 9400, 2011: 6700, 2012: 9200, 2013: 8800, 2014: 14800, 2015: 15900, 2016: 17100, 2017: 26800, 2018: 23400, 2019: 23600, 2020: 29600, 2021: 43800, 2022: 45600, 2023: 65100, 2024: 89500, 2025: 98200 }
  },
  niftySmallcap250: {
    name: "Nifty Smallcap 250 TRI", category: "Small Cap High Growth", color: "#EC4899", cagr25Y: 17.5,
    levels: { 2000: 800, 2001: 580, 2002: 660, 2003: 1950, 2004: 2750, 2005: 4100, 2006: 5200, 2007: 9800, 2008: 2900, 2009: 6800, 2010: 7900, 2011: 5100, 2012: 6900, 2013: 6300, 2014: 11200, 2015: 12100, 2016: 12900, 2017: 20400, 2018: 15100, 2019: 13900, 2020: 17500, 2021: 28500, 2022: 27900, 2023: 41200, 2024: 58400, 2025: 64100 }
  },
  nifty500: {
    name: "Nifty 500 Multicap", category: "Broad Market", color: "#06B6D4", cagr25Y: 14.8,
    levels: { 2000: 1010, 2001: 820, 2002: 870, 2003: 1650, 2004: 1980, 2005: 2780, 2006: 3750, 2007: 6200, 2008: 2750, 2009: 4950, 2010: 5800, 2011: 4250, 2012: 5600, 2013: 5750, 2014: 8100, 2015: 8050, 2016: 8400, 2017: 11550, 2018: 11200, 2019: 12100, 2020: 14200, 2021: 18700, 2022: 19300, 2023: 24300, 2024: 31200, 2025: 34100 }
  },
  gold: {
    name: "Gold (INR 10g)", category: "Hedge & Safety", color: "#FACC15", cagr25Y: 12.2,
    levels: { 2000: 4400, 2001: 4300, 2002: 5010, 2003: 5600, 2004: 5850, 2005: 7000, 2006: 8400, 2007: 10800, 2008: 12500, 2009: 14500, 2010: 18500, 2011: 26400, 2012: 31050, 2013: 29600, 2014: 28000, 2015: 26343, 2016: 28623, 2017: 29667, 2018: 31438, 2019: 35220, 2020: 48651, 2021: 48720, 2022: 54600, 2023: 63200, 2024: 76500, 2025: 88500 }
  }
};

function runHistoricalBacktest(startYear, endYear, monthlySIP, lumpsum = 0, stepUpPct = 0) {
  const results = {};
  const yearsList = [];
  for (let y = startYear; y <= endYear; y++) { yearsList.push(y); }

  Object.keys(BENCHMARK_DATA).forEach(key => {
    const bench = BENCHMARK_DATA[key];
    let totalInvested = 0;
    let units = 0;
    let curMonthly = monthlySIP;
    const trajectory = [];

    if (lumpsum > 0) {
      const startPrice = bench.levels[startYear];
      units += lumpsum / startPrice;
      totalInvested += lumpsum;
    }

    yearsList.forEach(yr => {
      const price = bench.levels[yr];
      if (curMonthly > 0) {
        const yearContribution = curMonthly * 12;
        units += yearContribution / price;
        totalInvested += yearContribution;
      }
      const yearEndValue = Math.round(units * price);
      trajectory.push({ year: yr, invested: Math.round(totalInvested), value: yearEndValue });
      if (stepUpPct > 0) curMonthly = curMonthly * (1 + (stepUpPct / 100));
    });

    const finalVal = trajectory[trajectory.length - 1].value;
    const totalInv = trajectory[trajectory.length - 1].invested;
    const totalReturn = finalVal - totalInv;
    const numYears = yearsList.length;
    const cagr = numYears > 0 && totalInv > 0 ? (Math.pow(finalVal / totalInv, 1 / numYears) - 1) * 100 : 0;

    results[key] = {
      benchmark: bench.name,
      category: bench.category,
      color: bench.color,
      totalInvested: totalInv,
      finalValue: finalVal,
      gain: totalReturn,
      multiplier: (finalVal / (totalInv || 1)).toFixed(2) + 'x',
      cagr: cagr.toFixed(1) + '%',
      trajectory
    };
  });
  return { years: yearsList, results };
}
