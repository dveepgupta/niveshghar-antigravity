function formatINR(val, compact = true) {
  if (isNaN(val) || val === null) return "₹0";
  const num = Math.round(val);
  if (compact) {
    if (num >= 10000000) return "₹" + (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return "₹" + (num / 100000).toFixed(2) + " L";
  }
  return "₹" + num.toLocaleString('en-IN');
}

function calculateSIP(monthlyInvest, annualRatePct, years) {
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  if (r === 0) return { invested: monthlyInvest * n, total: monthlyInvest * n, returns: 0 };
  const fv = monthlyInvest * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthlyInvest * n;
  return { invested: Math.round(invested), total: Math.round(fv), returns: Math.round(fv - invested) };
}

function calculateLumpsum(principal, annualRatePct, years) {
  const r = annualRatePct / 100;
  const fv = principal * Math.pow(1 + r, years);
  return { invested: Math.round(principal), total: Math.round(fv), returns: Math.round(fv - principal) };
}

function calculateStepUpSIP(initialMonthly, annualStepUpPct, annualRatePct, years) {
  const r = (annualRatePct / 100) / 12;
  let totalInvested = 0;
  let corpus = 0;
  let curMonthly = initialMonthly;
  const breakdown = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      corpus = (corpus + curMonthly) * (1 + r);
      totalInvested += curMonthly;
    }
    breakdown.push({ year: y, monthly: curMonthly, investedToDate: Math.round(totalInvested), corpus: Math.round(corpus) });
    curMonthly = curMonthly * (1 + (annualStepUpPct / 100));
  }
  return { invested: Math.round(totalInvested), total: Math.round(corpus), returns: Math.round(corpus - totalInvested), breakdown };
}

function calculateSWP(initialCorpus, monthlyWithdrawal, annualReturnPct, years) {
  const r = (annualReturnPct / 100) / 12;
  let currentBalance = initialCorpus;
  let totalWithdrawn = 0;
  const yearlySchedule = [];

  for (let y = 1; y <= years; y++) {
    let yearWithdrawn = 0;
    for (let m = 1; m <= 12; m++) {
      if (currentBalance <= 0) { currentBalance = 0; break; }
      currentBalance = currentBalance * (1 + r);
      const actualWithdrawal = Math.min(currentBalance, monthlyWithdrawal);
      currentBalance -= actualWithdrawal;
      totalWithdrawn += actualWithdrawal;
      yearWithdrawn += actualWithdrawal;
    }
    yearlySchedule.push({ year: y, withdrawn: Math.round(yearWithdrawn), balance: Math.round(currentBalance) });
    if (currentBalance <= 0) break;
  }
  return { initialCorpus: Math.round(initialCorpus), totalWithdrawn: Math.round(totalWithdrawn), finalBalance: Math.round(currentBalance), yearlySchedule };
}

function calculateRequiredSIP(targetCorpus, annualRatePct, years) {
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  const factor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return Math.round(targetCorpus / factor);
}
