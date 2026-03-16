import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: "test" } as any);
console.log(adapter);
