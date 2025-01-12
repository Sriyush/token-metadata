import {  findMetadataPda, mplTokenMetadata, verifyCollection, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired , getExplorerLink , getKeypairFromFile } from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {keypairIdentity, publicKey} from "@metaplex-foundation/umi"
import {clusterApiUrl, Connection , LAMPORTS_PER_SOL} from "@solana/web3.js"

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();
await airdropIfRequired(connection , user.publicKey , 1* LAMPORTS_PER_SOL , 0.5 * LAMPORTS_PER_SOL);

console.log("Loaded user" , user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

umi.use(keypairIdentity(umiUser));

console.log("Set up umi instance for user ");

const collectionAddress = publicKey("GX29M3uY5BYXn6iZfPcQdRj8zck7pCv2Z7mM6Feqs3tY");

const nftAddress = publicKey("9yrcqpyBvEnaZW1ZHdBPjhQurvvpkZQsvB2qBtiU8nNR");

const transaction = await verifyCollectionV1(umi, {
    metadata: findMetadataPda(umi, {mint: nftAddress}),
    collectionMint: collectionAddress,
    authority: umi.identity
})

transaction.sendAndConfirm(umi);

console.log(`NFT ${nftAddress} verified as member of collection ${collectionAddress} ! see Explorer at ${getExplorerLink("address",
    nftAddress , "devnet"
)}`)