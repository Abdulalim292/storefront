export interface Branch {
  name: string;
  address: string[];
  phones: string[];
}

export const BRANCHES: Branch[] = [
  {
    name: 'Showroom 1 · Dhaka',
    address: ['Modina Arzoo Complex', '107 Nawabpur Road, Madan Pal Lane, Dhaka'],
    phones: ['02-9515638', '01819-461614', '01824-982126', '01874-873022'],
  },
  {
    name: 'Showroom 2 · Dhaka',
    address: ['Ukil Market', '36 Madan Pal Lane, Nawabpur, Dhaka'],
    phones: ['02-47112146', '01974-982126', '01305-491662'],
  },
  {
    name: 'Chittagong Branch',
    address: ['525 Aklash Complex, Shop No. 105', 'Jubilee Road (under Islami Bank), Chittagong'],
    phones: ['031-333358757', '01735-593764', '01863-611800'],
  },
];
