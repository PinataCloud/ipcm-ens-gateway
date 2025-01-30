import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { ResolverQuery } from './utils'
import { abi } from "./ipcm-abi";

export async function getRecord(query: ResolverQuery) {
  const { functionName } = query

  try {
    const publicClient = createPublicClient({
      transport: http(),
      chain: base
    })

    if (functionName !== 'contenthash') {
      return ''
    }

    const mapping = await publicClient.readContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi: abi,
      functionName: "getMapping",
    });

    return mapping as string
  } catch (err) {
    return ''
  }
}
