function openWhatsApp(customMsg) {
  const phone = "919876543210";
  const text = encodeURIComponent(customMsg || "Hello Dveep Sir, I was exploring your NiveshGhar wealth calculators and would like to schedule a 1-on-1 portfolio consultation.");
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

function printReport() {
  window.print();
}
