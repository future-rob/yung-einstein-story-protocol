export function processTransactionData(data: any) {
  return {
    contract: {
      address: data.contract.address,
      name: data.contract.name,
      symbol: data.contract.symbol,
      totalSupply: data.contract.total_supply,
    },
    assets: data.assets.map((asset: any) => ({
      tokenId: asset.token_id,
      tokenAddress: asset.token_address,
      tokenName: asset.token_name,
      tokenSymbol: asset.token_symbol,
      tokenURI: asset.token_uri,
      owner: asset.owner,
      metadata: {
        name: asset.metadata.name,
        description: asset.metadata.description,
        externalUrl: asset.metadata.external_url,
        image: asset.metadata.image,
        attributes: asset.metadata.attributes.map((attr: any) => ({
          traitType: attr.trait_type,
          value: attr.value,
          maxValue: attr.max_value || null,
        })),
      },
    })),
  };
}
