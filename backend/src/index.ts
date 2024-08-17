import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { cors } from 'hono/cors'


const app = new Hono<{
  Bindings:{
    DATABASE_URL:string;
  }
}>()

app.use('/*',cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

//we need post for updating the users and delete for users
//also one for bulk users

//make new user
app.post('/api/v1/user', async (c)=> {
  const body=await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  

    try {
      // First, create the Address
      const address = await prisma.address.create({
        data: {
          street: body.address.street,
          suite: body.address.suite,
          city: body.address.city,
          zipcode: body.address.zipcode,
        },
      });

    const user = await prisma.user.create({
      data: {
        username: body.username, // Populating the `username` field
        name: body.name,         // Populating the `name` field
        email: body.email,       // Populating the `email` field
        phone: body.phone,       // Populating the `phone` field
        website: body.website,   // Populating the `website` field
        addressId: address.id,
        company: body.company,   // Populating the `company` field
      },
    });

    return new Response(JSON.stringify({ message: 'User created successfully', user }), { status: 201 });
  } 
  catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred while creating the user' }), { status: 500 });
  } 

})

//deleting users
app.delete('/api/v1/user/:id', async (c) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  try {
    const userId = Number(c.req.param('id'));

    // Optionally: Find the user to get the associated addressId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Address: true }, // Include the related address
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Delete the User
    await prisma.user.delete({
      where: { id: userId },
    });

    // Optionally: Delete the associated address if no other user is linked to it
    if (user.addressId) {
      const addressLinkedUsers = await prisma.user.findMany({
        where: { addressId: user.addressId },
      });

      if (addressLinkedUsers.length === 0) {
        await prisma.address.delete({
          where: { id: user.addressId },
        });
      }
    }

    return new Response(JSON.stringify({ message: 'User and associated address (if any) deleted successfully' }), { status: 200 });
  } 
  catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred while deleting the user' }), { status: 500 });
  } 
});

//updating the users
app.put('/api/v1/user/:id', async (c) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  try {
    const userId = Number(c.req.param('id'));
    const body = await c.req.json();

    // Find the user to ensure it exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Update only specified fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        website: body.website,
      },
    });

    return new Response(JSON.stringify({ message: 'User updated successfully', user: updatedUser }), { status: 200 });
  } 
  catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred while updating the user' }), { status: 500 });
  }
});

//getting all the users in bulk
app.get('/api/v1/user/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      include: {
        Address: true, // Optionally include the related address
      },
    });

    // Return the list of users
    return new Response(JSON.stringify(users), { status: 200 });
  } 
  catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred while fetching users' }), { status: 500 });
  }
});


export default app
