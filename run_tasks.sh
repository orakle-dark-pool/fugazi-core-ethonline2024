#!/bin/bash

# Set this to true if you want to use --network testnet, otherwise leave it empty
USE_TESTNET="false"

# setting for localfhenix
rm -rf deployments/localfhenix \
&& npx hardhat compile \
&& npx hardhat localfhenix:start 

# deploy contracts
npx hardhat deploy --tags Tokens $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat deploy --tags Fugazi $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) 

# set up Fugazi
npx hardhat task:addFacets $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" )

# set up and test distributor
npx hardhat task:depositToDistributor --name FakeFGZ --amount 16383 $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:depositToDistributor --name FakeUSD --amount 16383 $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:depositToDistributor --name FakeEUR --amount 16383 $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:claimFromDistributor --name FakeFGZ $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:claimFromDistributor --name FakeUSD $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:claimFromDistributor --name FakeEUR $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" )

# deposit tokens to Fugazi
npx hardhat task:deposit --name FakeUSD --amount 32767 $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:deposit --name FakeFGZ --amount 32767 $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:deposit --name FakeEUR --amount 32767 $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" )

# create pools
npx hardhat task:createPool --name0 FakeFGZ --amount0 7000 --name1 FakeUSD --amount1 7000 $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:createPool --name0 FakeUSD --amount0 7777 --name1 FakeEUR --amount1 7000 $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:createPool --name0 FakeFGZ --amount0 7777 --name1 FakeEUR --amount1 7000 $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" )

# get pool infos
npx hardhat task:getPoolInfo --name0 FakeFGZ --name1 FakeUSD $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:getPoolInfo --name0 FakeUSD --name1 FakeEUR $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" ) \
&& npx hardhat task:getPoolInfo --name0 FakeFGZ --name1 FakeEUR $( [[ "$USE_TESTNET" == "true" ]] && echo "--network testnet" )

# removeLiquidity

# addLiquidity

# swap