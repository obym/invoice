import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function angkaTerbilang(angka: number): string {
  const huruf = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'
  ];
  let hasil = '';
  if (angka < 12) {
    hasil = huruf[angka];
  } else if (angka < 20) {
    hasil = angkaTerbilang(angka - 10) + ' belas';
  } else if (angka < 100) {
    hasil = angkaTerbilang(Math.floor(angka / 10)) + ' puluh ' + angkaTerbilang(angka % 10);
  } else if (angka < 200) {
    hasil = 'seratus ' + angkaTerbilang(angka - 100);
  } else if (angka < 1000) {
    hasil = angkaTerbilang(Math.floor(angka / 100)) + ' ratus ' + angkaTerbilang(angka % 100);
  } else if (angka < 2000) {
    hasil = 'seribu ' + angkaTerbilang(angka - 1000);
  } else if (angka < 1000000) {
    hasil = angkaTerbilang(Math.floor(angka / 1000)) + ' ribu ' + angkaTerbilang(angka % 1000);
  } else if (angka < 1000000000) {
    hasil = angkaTerbilang(Math.floor(angka / 1000000)) + ' juta ' + angkaTerbilang(angka % 1000000);
  } else if (angka < 1000000000000) {
    hasil = angkaTerbilang(Math.floor(angka / 1000000000)) + ' miliar ' + angkaTerbilang(angka % 1000000000);
  } else if (angka < 1000000000000000) {
    hasil = angkaTerbilang(Math.floor(angka / 1000000000000)) + ' triliun ' + angkaTerbilang(angka % 1000000000000);
  }
  return hasil.trim();
}

export function formatTerbilang(angka: number): string {
  if (angka === 0) return 'nol rupiah';
  return angkaTerbilang(angka) + ' rupiah';
}
