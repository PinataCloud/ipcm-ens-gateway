import { createPublicClient, http, stringToHex } from 'viem'
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
      address: "0xD5B0CE88928569Cdc4DBF47F0A4a1D8B31f6311D",
      abi: abi,
      functionName: "getMapping",
    });

    return mapping
  } catch (err) {
    return ''
  }
}
