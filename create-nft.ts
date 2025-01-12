import { createNft, fetchDigitalAsset , mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired , getExplorerLink , getKeypairFromFile } from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {generateSigner, keypairIdentity, percentAmount, publicKey} from "@metaplex-foundation/umi"
import {clusterApiUrl, Connection , LAMPORTS_PER_SOL, } from "@solana/web3.js"

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

console.log(`creating NFT...`);

const mint = generateSigner(umi);

const transaction = await createNft(umi , {
    mint,
    name: "SriyushNFT",
    uri: "https://raw.githubusercontent.com/Sriyush/token-metadata/refs/heads/main/nft.json",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAddress,
        verified: false,
    },
});

await transaction.sendAndConfirm(umi);

const createdNFT = await fetchDigitalAsset(umi , mint.publicKey);

console.log(`Created NFT! Address is ${getExplorerLink("address",
    createdNFT.mint.publicKey,
    "devnet")}`
);