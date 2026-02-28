import { prisma } from "./src/prisma/index.js";

async function main() {
  const rides = await prisma.ride.findMany({ take: 1 });
  console.log("Ride output:", JSON.stringify(rides, null, 2));

  // let's create a dummy ride to test if it's empty
  if (rides.length === 0) {
     const dummyUser = await prisma.user.findFirst();
     if (dummyUser) {
        const newRide = await prisma.ride.create({
            data: {
                amount: 7.8,
                platform: "yummy",
                userId: dummyUser.id
            }
        });
        console.log("Created dummy ride:", JSON.stringify(newRide, null, 2));
     }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
