# fugazi-core-ethonline2024

This repo contains smart contracts for Fugazi, the first fully on-chain dark pool built on Fhenix.
For some successful transactions, due to the performance issue related to FHE, they may not return transaction hash and return error such as HeadersTimeoutError or NonceTooLowError. However, as long as it is not reverted, chain will eventually update the state and everything will be fine.

## Structure

Like Crocswap, Balancer, and Muffin, Fugazi is built in singleton structure. There is a core contract that receives every call and delegate it. Balance facet handles every opreations related to user balance, such as deposit and withdraw. Pool registry handles pool creation. Order facet and pool action facet handles order submission, batch settlement, and claims. Viewer facet is used for querying various public and private informations.

## Installaration

```
npm install
poetry install
```

## Replication

Following line will compile and deploy contracts on Fhenix Helium testnet, and will demonstrate basic operations:

```
source ./run_tasks.sh
```

## Claim Protocol-owned Account's orders

Just like convex, opyn, yearn, and other dApps do, claim of protocol-owned account's orders are not handled by centralized entity; instead, anyone can claim them on behalf of protocol and get paid reward for their work. We have example python script. Try followin:

```
poetry run python ./protocol_order_claimer/check_and_claim.py
```
