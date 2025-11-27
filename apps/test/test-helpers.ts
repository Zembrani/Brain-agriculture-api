// Helper functions for e2e tests

// Collection of valid CPF/CNPJ values for testing
// Generated using cpf-cnpj-validator library to ensure validity
const VALID_CPFS = [
  "575.086.213-52",
  "423.058.608-62",
  "276.557.382-46",
  "762.514.157-89",
  "628.346.153-06",
  "177.840.757-90",
  "671.227.226-27",
  "362.718.522-62",
  "704.418.605-08",
  "773.012.614-11",
  "748.788.322-15",
  "541.148.107-49",
  "541.714.062-77",
  "775.146.733-93",
  "833.824.768-51",
  "182.371.017-40",
  "404.700.481-23",
  "584.613.880-20",
  "163.211.203-59",
  "262.652.018-75",
  "657.270.854-38",
  "844.012.065-68",
  "147.310.608-77",
  "435.422.667-79",
  "268.265.026-07",
  "230.376.118-20",
  "266.842.477-18",
  "261.068.047-37",
  "072.128.575-99",
  "342.120.243-57",
  "661.153.341-95",
  "125.141.777-90",
  "814.820.511-68",
  "045.012.502-59",
  "614.856.340-16",
  "027.555.031-14",
  "145.215.616-67",
  "467.660.520-07",
  "482.103.780-74",
  "227.445.404-39",
];

const VALID_CNPJS = [
  "07.004.222/8530-19",
  "78.678.883/7155-11",
  "32.417.207/7143-50",
  "08.077.887/6315-43",
  "27.145.661/6152-04",
  "11.537.584/6645-84",
  "47.882.300/8246-71",
  "45.431.446/7645-91",
  "36.565.277/6073-05",
  "74.863.018/4215-07",
  "76.831.158/1456-53",
  "25.476.357/1765-39",
  "48.536.284/2000-98",
  "87.582.312/0631-30",
  "13.124.711/7616-68",
  "14.681.771/4140-90",
  "75.751.702/5345-93",
  "37.721.552/4365-76",
  "80.700.047/3405-42",
  "48.224.355/0250-02",
];

let cpfIndex = 0;
let cnpjIndex = 0;
// Use an atomic counter that increments globally
let phoneCounter = 0;

export function getNextValidCPF(): string {
  const cpf = VALID_CPFS[cpfIndex % VALID_CPFS.length];
  cpfIndex++;
  return cpf;
}

export function getNextValidCNPJ(): string {
  const cnpj = VALID_CNPJS[cnpjIndex % VALID_CNPJS.length];
  cnpjIndex++;
  return cnpj;
}

export function getUniquePhone(): string {
  // Generate truly unique phone using timestamp + counter + random
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  phoneCounter++;

  // Combine timestamp (last 5 digits), counter (up to 3 digits), random (4 digits)
  const part1 = ((timestamp % 100000) + phoneCounter)
    .toString()
    .padStart(5, "0")
    .slice(-5);
  const part2 = random.toString().padStart(4, "0");

  return `(11) 9${part1}-${part2}`;
}

export function resetCPFCNPJCounters(): void {
  cpfIndex = 0;
  cnpjIndex = 0;
  phoneCounter = 0;
}
