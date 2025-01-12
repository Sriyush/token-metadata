import { createNft, fetchDigitalAsset , mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired , getExplorerLink , getKeypairFromFile } from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {generateSigner, keypairIdentity, percentAmount, PercentAmount} from "@metaplex-foundation/umi"
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

const collectionMint = generateSigner(umi);

const transaction = await createNft(umi , {
    mint: collectionMint,
    name:"SriyuhCols",
    symbol:"SA1920NFTS",
    uri: "https://raw.githubusercontent.com/Sriyush/token-metadata/refs/heads/main/nftdata.json",
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true
});

await transaction.sendAndConfirm(umi);

const createCollectionNft = await fetchDigitalAsset(umi , collectionMint.publicKey);

console.log(`Created Collection ! Address is ${getExplorerLink("address",
    createCollectionNft.mint.publicKey,
    "devnet"
)} `);