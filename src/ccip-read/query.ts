import { createPublicClient, http, stringToHex } from 'viem'
import { base } from 'viem/chains'
import { ResolverQuery } from './utils'
import { abi } from "./ipcm-abi";
import { encode } from '@ensdomains/content-hash'

export async function getRecord(query: ResolverQuery) {
  const { functionName } = query
  console.log(functionName)

  try {
    const publicClient = createPublicClient({
      transport: http(),
      chain: base
    })

    if (functionName !== 'contenthash') {
      return ''
    }

    const mapping: any = await publicClient.readContract({
      address: "0xD5B0CE88928569Cdc4DBF47F0A4a1D8B31f6311D",
      abi: abi,
      functionName: "getMapping",
    });
    //const mapping = "ipfs://QmVLwvmGehsrNEvhcCnnsw5RQNseohgEkFNN1848zNzdng"

    const cid = mapping.split('ipfs://')[1]
    const encodedContenthash = '0x' + encode('ipfs', cid)
    console.log("Encoded hash to return: ", encodedContenthash)
    return encodedContenthash
  } catch (err) {
    return ''
  }
}
