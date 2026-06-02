// English number to words conversion
const ONES_EN = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
const TENS_EN = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

function numToWordsPart(n) {
  if (n < 20) return ONES_EN[n];
  if (n < 100) return TENS_EN[Math.floor(n/10)] + (n%10 ? ' '+ONES_EN[n%10] : '');
  return ONES_EN[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' '+numToWordsPart(n%100) : '');
}

export function numToWordsEn(n) {
  n = Math.round(n);
  if (n === 0) return 'Zero Rupees Only';
  let res = '';
  if (n >= 10000000) { res += numToWordsPart(Math.floor(n/10000000)) + ' Crore '; n %= 10000000; }
  if (n >= 100000) { res += numToWordsPart(Math.floor(n/100000)) + ' Lakh '; n %= 100000; }
  if (n >= 1000) { res += numToWordsPart(Math.floor(n/1000)) + ' Thousand '; n %= 1000; }
  if (n > 0) res += numToWordsPart(n);
  return res.trim() + ' Rupees Only';
}

// Marathi number to words conversion
const ONES_MR = ['','एक','दोन','तीन','चार','पाच','सहा','सात','आठ','नऊ','दहा','अकरा','बारा','तेरा','चौदा','पंधरा','सोळा','सतरा','अठरा','एकोणीस'];
const TENS_MR = ['','','वीस','तीस','चाळीस','पन्नास','साठ','सत्तर','ऐंशी','नव्वद'];

function numToWordsMrPart(n) {
  if (n < 20) return ONES_MR[n];
  if (n < 100) return TENS_MR[Math.floor(n/10)] + (n%10 ? ' '+ONES_MR[n%10] : '');
  return ONES_MR[Math.floor(n/100)] + ' शे' + (n%100 ? ' '+numToWordsMrPart(n%100) : '');
}

export function numToWordsMr(n) {
  n = Math.round(n);
  if (n === 0) return 'शून्य रुपये फक्त';
  let res = '';
  if (n >= 10000000) { res += numToWordsMrPart(Math.floor(n/10000000)) + ' कोटी '; n %= 10000000; }
  if (n >= 100000) { res += numToWordsMrPart(Math.floor(n/100000)) + ' लाख '; n %= 100000; }
  if (n >= 1000) { res += numToWordsMrPart(Math.floor(n/1000)) + ' हजार '; n %= 1000; }
  if (n > 0) res += numToWordsMrPart(n);
  return res.trim() + ' रुपये फक्त';
}
