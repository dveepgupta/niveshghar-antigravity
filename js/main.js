// NiveshGhar Global Client Advisory Scripts
// Official Verified Advisor WhatsApp Number for Dveep
const ADVISOR_WHATSAPP_PHONE = "916351017838";

function openWhatsApp(customMsg) {
  const text = encodeURIComponent(customMsg || "Hello Dveep Sir, I was exploring your NiveshGhar wealth calculators and would like to schedule a 1-on-1 portfolio consultation.");
  window.open(`https://wa.me/${ADVISOR_WHATSAPP_PHONE}?text=${text}`, '_blank');
}

function printReport() {
  window.print();
}
