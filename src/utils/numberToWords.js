export function numberToWords(amount) {
    if (amount === 0) return 'Zero Only';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    function convertLessThanThousand(num) {
        if (num === 0) return '';

        let result = '';

        if (num >= 100) {
            result += ones[Math.floor(num / 100)] + ' Hundred ';
            num %= 100;
        }

        if (num >= 20) {
            result += tens[Math.floor(num / 10)] + ' ';
            num %= 10;
        } else if (num >= 10) {
            result += teens[num - 10] + ' ';
            return result;
        }

        if (num > 0) {
            result += ones[num] + ' ';
        }

        return result;
    }

    // Split into rupees and paise
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let words = 'Rupees - ';

    // Indian numbering system: Crores, Lakhs, Thousands, Hundreds
    if (rupees >= 10000000) {
        const crores = Math.floor(rupees / 10000000);
        words += convertLessThanThousand(crores) + 'Crore ';
        const remainder = rupees % 10000000;

        if (remainder >= 100000) {
            const lakhs = Math.floor(remainder / 100000);
            words += convertLessThanThousand(lakhs) + 'Lakh ';
            const remainder2 = remainder % 100000;

            if (remainder2 >= 1000) {
                const thousands = Math.floor(remainder2 / 1000);
                words += convertLessThanThousand(thousands) + 'Thousand ';
                const remainder3 = remainder2 % 1000;
                words += convertLessThanThousand(remainder3);
            } else {
                words += convertLessThanThousand(remainder2);
            }
        } else if (remainder >= 1000) {
            const thousands = Math.floor(remainder / 1000);
            words += convertLessThanThousand(thousands) + 'Thousand ';
            const remainder2 = remainder % 1000;
            words += convertLessThanThousand(remainder2);
        } else {
            words += convertLessThanThousand(remainder);
        }
    } else if (rupees >= 100000) {
        const lakhs = Math.floor(rupees / 100000);
        words += convertLessThanThousand(lakhs) + 'Lakh ';
        const remainder = rupees % 100000;

        if (remainder >= 1000) {
            const thousands = Math.floor(remainder / 1000);
            words += convertLessThanThousand(thousands) + 'Thousand ';
            const remainder2 = remainder % 1000;
            words += convertLessThanThousand(remainder2);
        } else {
            words += convertLessThanThousand(remainder);
        }
    } else if (rupees >= 1000) {
        const thousands = Math.floor(rupees / 1000);
        words += convertLessThanThousand(thousands) + 'Thousand ';
        const remainder = rupees % 1000;
        words += convertLessThanThousand(remainder);
    } else {
        words += convertLessThanThousand(rupees);
    }

    words = words.trim() + ' Only';

    return words;
}
