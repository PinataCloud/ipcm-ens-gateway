import { Hono } from 'hono'
import { HttpRequestError, isAddress, isHex } from 'viem'
import { decodeEnsOffchainRequest, encodeEnsOffchainResponse } from './ccip-read/utils'
import { getRecord } from './ccip-read/query'
import { Env } from './env'
import { z } from 'zod'


const schema = z.object({
  sender: z.string().refine((data) => isAddress(data)),
  data: z.string().refine((data) => isHex(data)),
})

const app = new Hono<{ Bindings: Env }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/lookup/:sender/:data', async (c) => {
  const { sender, data } = c.req.param()

  const safeParse = schema.safeParse({ sender, data })

  if (!safeParse.success) {
    return c.json({ error: safeParse.error }, 400)
  }

  let result: string

  try {
    const { name, query } = decodeEnsOffchainRequest(safeParse.data)
    result = await getRecord(query)
  } catch (error) {
    const isHttpRequestError = error instanceof HttpRequestError
    const errMessage = isHttpRequestError ? error.message : 'Unable to resolve'
    return c.json({ message: errMessage }, 400)
  }

  const encodedResponse = await encodeEnsOffchainResponse(
    safeParse.data,
    result,
    c.env.PRIVATE_KEY
  )

  console.log("Full response to resolver: ", encodedResponse)
  return c.json({ data: encodedResponse }, 200)
})

export default app
