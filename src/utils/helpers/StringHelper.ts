
export class StringHelper {

    public static formatNumber(num: number, separator: string): string {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
    }

    public static removeObsoleteNewLines(text: string): string {
        return text.replace(/(\r\n|\r|\n){2,}/g, '$1\n');
    }

    public static changeNumberToScienceNotation(num: number, treshold: number = 0): string {
        if (num < treshold) {
            return num.toString();
        }
        if (num >= Math.pow(10, 6)) {
            return `${Number((num / Math.pow(10, 6)).toFixed(1))}M`;
        }
        if (num >= Math.pow(10, 3)) {
            return `${Number((num / Math.pow(10, 3)).toFixed(1))}K`;
        }
        return num.toFixed(1);
    }
}
