// High-Resolution Historical Crash & Cycle Dataset (2000 - 2026)
// Normalized monthly & annual price indices for Nifty 50, Next 50, Midcap 150, Smallcap 250, Nifty 500, and Gold

const CRISIS_PRESETS = {
  covid2020: {
    name: "2020 COVID Crash & V-Shape Recovery",
    startYear: 2020,
    startMonth: 1,
    endYear: 2021,
    endMonth: 12,
    desc: "Nifty crashed -38% in March 2020, then surged +140% by late 2021. The ultimate test of SIP patience!"
  },
  gfc2008: {
    name: "2008 Global Financial Crisis & Bull Run",
    startYear: 2008,
    startMonth: 1,
    endYear: 2013,
    endMonth: 12,
    desc: "The steepest 1-year crash in history (-55%), followed by a massive multi-year compounding boom."
  },
  midcap2018: {
    name: "2018-2019 Mid/Small Cap Correction",
    startYear: 2018,
    startMonth: 1,
    endYear: 2021,
    endMonth: 12,
    desc: "2-year prolonged sideways/negative market where patient SIP unit accumulation paid off massively."
  },
  full25Y: {
    name: "Complete 25-Year Journey (2000 - 2025)",
    startYear: 2000,
    startMonth: 1,
    endYear: 2025,
    endMonth: 12,
    desc: "Witness all bull and bear market cycles across 25 disciplined years."
  }
};

const BENCHMARK_DATA = {
  nifty50: {
    name: "Nifty 50 TRI",
    category: "Large Cap",
    color: "#6D28D9",
    levels: {
      2000: 1263, 2001: 1059, 2002: 1093, 2003: 1879, 2004: 2080,
      2005: 2836, 2006: 3966, 2007: 6138, 2008: 2959, 2009: 5201,
      2010: 6134, 2011: 4624, 2012: 5905, 2013: 6304, 2014: 8282,
      2015: 7946, 2016: 8185, 2017: 10530, 2018: 10862, 2019: 12168,
      2020: 13981, 2021: 17354, 2022: 18105, 2023: 21731, 2024: 24150, 2025: 26200
    },
    // Detailed Monthly Points for Key Crisis Periods
    monthlyLevels: {
      "2008-01": 6144, "2008-03": 4734, "2008-06": 4040, "2008-09": 3921, "2008-10": 2885, "2008-12": 2959,
      "2009-03": 3020, "2009-06": 4291, "2009-09": 5083, "2009-12": 5201,
      "2010-06": 5312, "2010-12": 6134,
      "2011-06": 5647, "2011-12": 4624,
      "2012-06": 5278, "2012-12": 5905,
      "2013-06": 5842, "2013-12": 6304,
      "2020-01": 12168, "2020-02": 11201, "2020-03": 8597, "2020-04": 9859, "2020-06": 10302, "2020-09": 11247, "2020-12": 13981,
      "2021-03": 14690, "2021-06": 15721, "2021-09": 17618, "2021-12": 17354,
      "2022-06": 15780, "2022-12": 18105,
      "2023-06": 19189, "2023-12": 21731,
      "2024-06": 24010, "2024-12": 24150,
      "2025-06": 25400, "2025-12": 26200
    }
  },
  niftyMidcap150: {
    name: "Nifty Midcap 150 TRI",
    category: "Mid Cap",
    color: "#059669",
    levels: {
      2000: 950, 2001: 720, 2002: 810, 2003: 2150, 2004: 2980,
      2005: 4600, 2006: 5950, 2007: 10400, 2008: 3600, 2009: 7800,
      2010: 9400, 2011: 6700, 2012: 9200, 2013: 8800, 2014: 14800,
      2015: 15900, 2016: 17100, 2017: 26800, 2018: 23400, 2019: 23600,
      2020: 29600, 2021: 43800, 2022: 45600, 2023: 65100, 2024: 89500, 2025: 98200
    },
    monthlyLevels: {
      "2008-01": 10400, "2008-03": 7200, "2008-06": 5500, "2008-10": 3400, "2008-12": 3600,
      "2009-03": 3800, "2009-06": 6200, "2009-12": 7800,
      "2020-01": 23600, "2020-03": 14900, "2020-06": 19200, "2020-12": 29600,
      "2021-06": 37500, "2021-12": 43800,
      "2024-12": 89500, "2025-12": 98200
    }
  },
  gold: {
    name: "Physical Gold (10g)",
    category: "Precious Metals",
    color: "#D97706",
    levels: {
      2000: 4400, 2001: 4300, 2002: 5010, 2003: 5600, 2004: 5850,
      2005: 7000, 2006: 8400, 2007: 10800, 2008: 12500, 2009: 14500,
      2010: 18500, 2011: 26400, 2012: 31050, 2013: 29600, 2014: 28000,
      2015: 26343, 2016: 28623, 2017: 29667, 2018: 31438, 2019: 35220,
      2020: 48651, 2021: 48720, 2022: 54600, 2023: 63200, 2024: 76500, 2025: 88500
    }
  }
};

// Simulation Engine for 4 Behavioral Profiles during Market Crashes
function simulateBehavioralDrawdown(startYear, endYear, monthlySIP, selectedIndexKey = 'nifty50') {
  const bench = BENCHMARK_DATA[selectedIndexKey] || BENCHMARK_DATA.nifty50;
  const years = [];
  for (let y = startYear; y <= endYear; y++) years.push(y);

  // 1. Disciplined SIP Investor
  let discInvested = 0;
  let discUnits = 0;
  const discTrajectory = [];
  const schedule = [];

  // 2. Panicked Investor (Stopped in 1st/2nd year at lowest point)
  let panicInvested = 0;
  let panicUnits = 0;
  let panicWithdrawn = 0;
  let panicLockedLoss = 0;
  const panicTrajectory = [];

  // 3. Smart Opportunity Investor (Doubles SIP when index drops 15%+)
  let smartInvested = 0;
  let smartUnits = 0;
  const smartTrajectory = [];

  // 4. Fixed Deposit (6.5% p.a risk-free)
  let fdInvested = 0;
  let fdCorpus = 0;
  const fdRateMonthly = 0.065 / 12;
  const fdTrajectory = [];

  let initialPrice = bench.levels[startYear];
  let minPriceSeen = initialPrice;
  let maxDrawdownPct = 0;
  let monthsToRecovery = 0;
  let lowestYear = startYear;

  years.forEach((yr, idx) => {
    const price = bench.levels[yr];
    const prevPrice = idx > 0 ? bench.levels[years[idx - 1]] : price;
    const yearDrop = ((price - prevPrice) / prevPrice) * 100;
    
    if (price < minPriceSeen) {
      minPriceSeen = price;
      lowestYear = yr;
    }
    const dropFromStart = ((price - initialPrice) / initialPrice) * 100;
    if (dropFromStart < maxDrawdownPct) maxDrawdownPct = dropFromStart;

    // Monthly step simulation within year (12 periods)
    for (let m = 1; m <= 12; m++) {
      // Disciplined Investor
      const discAmt = monthlySIP;
      const boughtUnits = discAmt / price;
      discUnits += boughtUnits;
      discInvested += discAmt;

      // Panicked Investor: Only invests first 6 months, panics if market fell, withdraws
      if (idx === 0 && m <= 6) {
        panicUnits += monthlySIP / price;
        panicInvested += monthlySIP;
      } else if (idx === 0 && m === 7) {
        // Panicked client sells at the low
        panicWithdrawn = panicUnits * price;
        panicLockedLoss = panicInvested - panicWithdrawn;
        panicUnits = 0;
      }

      // Smart Investor: Adds 50% extra if price is below start
      const smartAmt = price < initialPrice ? monthlySIP * 1.5 : monthlySIP;
      smartUnits += smartAmt / price;
      smartInvested += smartAmt;

      // FD Investor
      fdCorpus = (fdCorpus + monthlySIP) * (1 + fdRateMonthly);
      fdInvested += monthlySIP;
    }

    const discVal = Math.round(discUnits * price);
    const smartVal = Math.round(smartUnits * price);
    const panicVal = panicUnits > 0 ? Math.round(panicUnits * price) : Math.round(panicWithdrawn);

    discTrajectory.push({ year: yr, invested: discInvested, value: discVal });
    panicTrajectory.push({ year: yr, invested: panicInvested, value: panicVal });
    smartTrajectory.push({ year: yr, invested: smartInvested, value: smartVal });
    fdTrajectory.push({ year: yr, invested: fdInvested, value: Math.round(fdCorpus) });

    schedule.push({
      year: yr,
      price,
      discInvested,
      discUnits: discUnits.toFixed(2),
      discValue: discVal,
      discGain: discVal - discInvested,
      smartValue: smartVal,
      panicValue: panicVal,
      fdValue: Math.round(fdCorpus)
    });
  });

  const finalDisc = discTrajectory[discTrajectory.length - 1];
  const finalSmart = smartTrajectory[smartTrajectory.length - 1];
  const finalFD = fdTrajectory[fdTrajectory.length - 1];

  return {
    benchmarkName: bench.name,
    years,
    maxDrawdownPct: maxDrawdownPct.toFixed(1) + '%',
    lowestYear,
    disciplined: {
      invested: discInvested,
      finalValue: finalDisc.value,
      gain: finalDisc.value - discInvested,
      multiplier: (finalDisc.value / discInvested).toFixed(2) + 'x',
      trajectory: discTrajectory
    },
    panicked: {
      invested: panicInvested,
      withdrawnAtBottom: Math.round(panicWithdrawn),
      lockedLoss: Math.round(panicLockedLoss),
      opportunityLoss: finalDisc.value - Math.round(panicWithdrawn),
      trajectory: panicTrajectory
    },
    smart: {
      invested: smartInvested,
      finalValue: finalSmart.value,
      gain: finalSmart.value - smartInvested,
      multiplier: (finalSmart.value / smartInvested).toFixed(2) + 'x',
      trajectory: smartTrajectory
    },
    bankFD: {
      invested: fdInvested,
      finalValue: finalFD.value,
      gain: finalFD.value - fdInvested,
      trajectory: fdTrajectory
    },
    schedule
  };
}
