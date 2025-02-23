import dayjs from "dayjs";
import "dayjs/locale/en";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { isValidPhoneNumber } from "libphonenumber-js";

export const useUtils = () => {
  const config = useRuntimeConfig();
  const formatMobileNumber = (number: string) => {
    if (number?.length === 12 && number?.startsWith("233")) {
      return "0" + number.slice(3);
    } else if (number?.length === 9 && number.startsWith("0")) {
      return "0" + number;
    } else {
      return number;
    }
  };

  const isValidLocalNumber = (number: string): boolean => {
    return number.length >= 10 && isValidPhoneNumber(number, "GH");
  };

  const formatMobileWithCountryCode = (number: string) => {
    if (number?.length == 10 && number?.startsWith("0")) {
      return "233" + number?.slice(1);
    } else {
      return number;
    }
  };

  const formatCurrency = (number: number = 0, currencyCode: string = "GHS") => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    });
    return formatter.format(number);
  };

  const filterArray = (
    parentArray: any[],
    childArray: any[],
    filterKey: any
  ) => {
    const childSet = new Set(childArray?.map((obj) => obj[filterKey]));

    const filteredArray = parentArray?.filter((obj) => {
      return !childSet.has(obj[filterKey]);
    });

    return filteredArray;
  };

  const sortArray = (array: any[], key: string, order: "asc" | "desc") => {
    return [...array].sort((a, b) => {
      if (order === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else if (order === "desc") {
        return a[key] < b[key] ? 1 : -1;
      }
      return 0;
    });
  };

  const formatDate = (
    date: string | undefined,
    format: string = "DD/MM/YYYY"
  ) => {
    dayjs.locale("en");
    const formatted = dayjs(date).format(format);
    return formatted;
  };
  const paymentType = (type: string) => {
    const paymentTypes: { [key: string]: string } = {
      cash: "Cash",
      mobilemoney: "Mobile Money",
      card: "Card",
      cheque: "Cheque",
    };
    return paymentTypes[type.toLowerCase()] || "Other";
  };

  const getOSName = (): string => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const osList: any = {
      Windows: /Win/,
      "Mac OS": /Mac/,
      Linux: /(Linux|X11)/,
      iOS: /(iPhone|iPad|iPod)/,
      Android: /Android/,
    };

    for (const os in osList) {
      if (osList[os].test(platform) || osList[os].test(userAgent)) {
        return os;
      }
    }

    return "Unknown OS";
  };

  const truncateText = (
    str: string,
    length: number,
    enableEllipsis: boolean = true
  ): string => {
    let truncatedStr = str?.substring(0, length)?.trim();
    if (enableEllipsis) {
      truncatedStr += "...";
    }
    return truncatedStr;
  };

  function debounce<T extends (...args: any[]) => any>(
    a: T,
    b: number,
    c?: boolean
  ) {
    let d: ReturnType<typeof setTimeout> | null, e: ReturnType<T> | undefined;
    return function (this: any, ...args: Parameters<T>) {
      function h() {
        d = null;
        c ?? (e = a.apply(f, g));
      }
      const f = this;
      const g = args;
      clearTimeout(d as ReturnType<typeof setTimeout>);
      d = setTimeout(h, b);
      if (c && !d) {
        e = a.apply(f, g);
      }
      return e;
    };
  }

  function formatNumberPlate(number: string): string {
    if (!number) {
      return "";
    }
    const regex = /^[A-Z]{2}-\d{4}-\d{2}$/;
    if (regex.test(number)) {
      return number;
    } else {
      const formattedNumber = number.replace(/[^A-Z0-9]/g, "").toUpperCase();
      const firstPart = formattedNumber.slice(0, 2);
      const secondPart = formattedNumber.slice(2, 6);
      const thirdPart = formattedNumber.slice(6, 8);
      return `${firstPart}-${secondPart}-${thirdPart}`;
    }
  }
  function isInternetAvailable(): boolean {
    return navigator.onLine;
  }
  const internet = computed(() => isInternetAvailable());
  const getOrdinalSuffix = (number: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = number % 100;
    const suffix =
      suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
    return `${number}${suffix}`;
  };

  const isAccountNumber = (value: string): boolean => {
    const prefixes = ["AMA"];
    return prefixes.some((prefix) => value.startsWith(prefix));
  };

  const getAcronym = (str: string): string => {
    const words = str.split(" ");
    const acronym = words
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
    return acronym;
  };

  const validateFile = (
    file: File | null,
    allowedExtensions: string[] = [],
    maxSize: number = 0
  ): string | null => {
    // Check if file is null or undefined
    if (!file) {
      throw new Error("No file selected.");
    }
    // Check file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension as string)) {
      throw new Error("File not supported");
    }
    // Check file size
    if (maxSize && file.size > maxSize) {
      throw new Error("File size exceeds the maximum limit.");
    }

    // File is valid
    return null;
  };

  const formatNumberRange = (number: any): string => {
    const convertedNumber = Number(number);
    if (isNaN(convertedNumber)) {
      return number;
    }
    const formattedNumber = convertedNumber.toFixed(1);
    return `Up to ${formattedNumber}`;
  };

  const reduceImageSize = async (
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<{ file: File; base64Url: string }> => {
    const img = new Image();
    const reader = new FileReader();

    const loadImage = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          resolve();
        };
        img.onerror = () => {
          reject(new Error("Failed to load the image"));
        };
        img.src = src;
      });
    };

    const createResizedImage = (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          file.type,
          0.8 // Adjust the quality here (0.0 - 1.0)
        );
      });
    };

    const resizeImage = (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      return createResizedImage(canvas, ctx, width, height);
    };

    const processImage = async () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      return resizeImage(canvas, ctx, width, height);
    };

    const base64Url = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read the image file"));
      };
      reader.readAsDataURL(file);
    });

    await loadImage(base64Url);
    const resizedBlob = await processImage();
    const resizedFile = new File([resizedBlob], file.name, { type: file.type });

    return { file: resizedFile, base64Url };
  };

  /**
   * Converts milliseconds to days.
   *
   * @param milliseconds - The time in milliseconds to convert.
   * @returns The equivalent time in days.
   */
  function millisecondsToDays(milliseconds: number): number {
    if (typeof milliseconds !== "number" || milliseconds < 0) {
      throw new Error("Input must be a non-negative number.");
    }

    const msInADay = 24 * 60 * 60 * 1000;
    return Math.ceil(milliseconds / msInADay);
  }

  function hasSpecialCharacters(text: string): boolean {
    // Define a regular expression pattern to match special characters
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    // Test if the text contains any special characters
    return specialCharsRegex.test(text);
  }
  const checkForOldFile = (file: string) => {
    if (!file.includes("s3")) {
      if (file.startsWith("//")) {
        file = file.replace("//", "/");
      }
      file = `${config.public.oldResource}${file}`;
    }
    return file;
  };
  return {
    formatMobileNumber,
    formatCurrency,
    filterArray,
    sortArray,
    formatDate,
    formatMobileWithCountryCode,
    paymentType,
    truncateText,
    relativeTime,
    getOSName,
    debounce,
    isValidLocalNumber,
    formatNumberPlate,
    isInternetAvailable,
    internet: internet.value,
    getOrdinalSuffix,
    isAccountNumber,
    getAcronym,
    validateFile,
    formatNumberRange,
    reduceImageSize,
    millisecondsToDays,
    hasSpecialCharacters,
    checkForOldFile,
  };
};
