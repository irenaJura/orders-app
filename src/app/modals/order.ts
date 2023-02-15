export interface Order {
  id: number | null;
  name: string;
  customer: string;
  status: string;
  date: string;
  price: number;
}

export interface OrderResolved {
  order: Order | null;
  error?: string;
}
