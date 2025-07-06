// data/dummy-sales-report.ts

export interface SalesReport {
  id: string;
  propertyName: string;
  roomType: string;
  tenantName: string;
  customerName: string;
  customerEmail: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  basePricePerNight: number;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Waiting for Payment' | 'Canceled';
  createdAt: string;
}

export const salesReports: SalesReport[] = [
  {
    id: 'TXN001',
    propertyName: 'The Gaia Hotel',
    roomType: 'Deluxe Room',
    tenantName: 'Alex Johnson',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    checkIn: '2025-06-01',
    checkOut: '2025-06-04',
    totalNights: 3,
    basePricePerNight: 750000,
    totalPrice: 2250000,
    paymentStatus: 'Paid',
    createdAt: '2025-05-28T14:12:00',
  },
  {
    id: 'TXN002',
    propertyName: 'Greenleaf Villa',
    roomType: 'Private Pool Villa',
    tenantName: 'Alex Johnson',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    checkIn: '2025-06-10',
    checkOut: '2025-06-12',
    totalNights: 2,
    basePricePerNight: 1200000,
    totalPrice: 2400000,
    paymentStatus: 'Paid',
    createdAt: '2025-06-05T10:45:00',
  },
  {
    id: 'TXN003',
    propertyName: 'Greenleaf Villa',
    roomType: 'Standard Room',
    tenantName: 'Alex Johnson',
    customerName: 'Robert Lang',
    customerEmail: 'robert.lang@example.com',
    checkIn: '2025-06-14',
    checkOut: '2025-06-15',
    totalNights: 1,
    basePricePerNight: 500000,
    totalPrice: 500000,
    paymentStatus: 'Waiting for Payment',
    createdAt: '2025-06-10T11:23:00',
  },
  {
    id: 'TXN004',
    propertyName: 'The Gaia Hotel',
    roomType: 'Superior Room',
    tenantName: 'Alex Johnson',
    customerName: 'Linda Wang',
    customerEmail: 'linda.wang@example.com',
    checkIn: '2025-06-18',
    checkOut: '2025-06-20',
    totalNights: 2,
    basePricePerNight: 850000,
    totalPrice: 1700000,
    paymentStatus: 'Paid',
    createdAt: '2025-06-15T09:30:00',
  },
  {
    id: 'TXN005',
    propertyName: 'Tropical Resort',
    roomType: 'Suite Room',
    tenantName: 'Alex Johnson',
    customerName: 'Michael Tan',
    customerEmail: 'michael.tan@example.com',
    checkIn: '2025-06-22',
    checkOut: '2025-06-25',
    totalNights: 3,
    basePricePerNight: 1000000,
    totalPrice: 3000000,
    paymentStatus: 'Canceled',
    createdAt: '2025-06-19T15:47:00',
  },
];
