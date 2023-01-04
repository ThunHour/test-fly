// Seed data to be used in development
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt';
const prisma = new PrismaClient()

async function main() {

  // create superAdmin
  const superAdmin = await prisma.superAdmin.create({
    data: {
      username: "super admin",
      email: `superadmin@test.com`,
      phone: "0967827020",
      description: "first superAdmin"
    }
  });

  await prisma.user.create({
    data: {
      username: superAdmin.username,
      email: superAdmin.email,
      password: await hash('password', 12),
      phone: superAdmin.phone,
      Role:'superAdmin'
    }
  })
  console.table({ superAdmin });
 


  // create 2 admin:
  for (let i = 1; i < 3; i++) {
    const userAdmin = await prisma.user.create({
      data: {
        username: `admin ${i}`,
        email: `useradmin${i}@test.com`,
        password: await hash('password', 12),
        phone: `09678232${i}`,
        Role: 'admin'
      }
    });
    const admin = await prisma.admin.create({
      data: {
        username: userAdmin.username,
        password: userAdmin.password,
        userId: userAdmin.id,
      }
    });
    console.table({ admin });
  };


    // Create 7 cate
  const productCategory = await prisma.productCategory.createMany({
    data: [
      {
        name: 'Knife',
        description: "Hello kon Papa",
        createByAdminId: 1
      },
      {
        name: 'Teapot',
        description: "Hello kon Papa",
        createByAdminId: 1
      },
      {
        name: 'cookware',
        description: "Hello kon Papa",
        createByAdminId: 1
      },
      {
        name: 'dishwasher',
        description: "Hello kon Papa",
        createByAdminId: 1
      },
      {
        name: 'post',
        description: "Hello kon Papa",
        createByAdminId: 1
      },
      {
        name: 'microwave',
        description: "Hello kon Papa",
        createByAdminId: 1
      },
      {
        name: 'toaster',
        description: "Hello kon Papa",
        createByAdminId: 1
      },
    ]
  });
  console.table({ productCategory });

  // create 20 customers(user + customer + address):
  for (let i = 1; i < 20; i++) {
    // creatre user
    const user = await prisma.user.create({
      data: {
        username: `username ${i}`,
        email: `user${i}@test.com`,
        password: await hash('password', 12),
        phone: `0923242${i}`,
        Role: 'customer'
      }
    });


    // create customer
    const customer = await prisma.customer.create({
      data: {
        username: user.username,
        password: user.password,
        userId: user.id
      }
    });

    // create address
    await prisma.address.create({
      data: {
        customerId: customer.id,
        companyName: `company ${i}`,
        street: 270 + i,
        zipecode: 300 + i,
        city: `city${i}`,
        province: `province${i}`,
        country:"Cambodia"
      }
    })
    console.table({ customer });
  };


  //  Create 15 ProductInventorys
  for (let i = 1; i < 15; i++) {
    const productInventory = await prisma.productInventory.create({
      data: {
        quantity: i * 2,
        createByAdminId: 2,
      },
    });
    console.table({ productInventory });
  };

  // create discount
  var x = 0.05
  for (let i = 1; i < 5; i++) {
    const discount = await prisma.discount.create({
      data: {
        name: `event ${i}`,
        description: " ",
        discount_percent: x,
        createByAdminId: 1
      }
    });
    x = x + 0.05
    console.table({ discount });
  };

  //   Create 50 products
  for (let i = 1; i < 50; i++) {
    const product = await prisma.product.create({
      data: {
        name: `product ${i}`,
        description: "kit transforming your better life",
        categogry_id: 1,
        inventory_id: 2,
        price: 35,
        discount_id: 3,
        createByAdminId: 2
      },
    });
    console.table({ product });
  }
}

main();