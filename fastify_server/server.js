// Load Fastify
const fastify = require('fastify')({ logger: true })

// Route: Home page
fastify.get('/', async (request, reply) => {
  return { message: 'Hello from Fastify v3 on Node 12!' }
})

// Start server
const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0') // no object syntax here
    console.log('Server listening on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

