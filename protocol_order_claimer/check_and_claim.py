import os
from dotenv import load_dotenv
import json
import time
import web3

load_dotenv()

# set Web3 and account
w3 = web3.Web3(web3.Web3.HTTPProvider("https://api.helium.fhenix.zone/"))
w3.eth.account.enable_unaudited_hdwallet_features()
acc = w3.eth.account.from_mnemonic(os.getenv("MNEMONIC2"))
print(f"Account address: {acc.address}")

# set contracts
with open(
    "/Users/kosunghun/codes/projects/fugazi-core-ethonline2024/deployments/testnet/FugaziCore.json",
    "r",
) as file:
    FugaziCore_json = json.load(file)
with open(
    "/Users/kosunghun/codes/projects/fugazi-core-ethonline2024/deployments/testnet/FugaziViewerFacet.json",
    "r",
) as file:
    FugaziViewer_json = json.load(file)
with open(
    "/Users/kosunghun/codes/projects/fugazi-core-ethonline2024/deployments/testnet/FugaziPoolActionFacet.json",
    "r",
) as file:
    FugaziPoolAction_json = json.load(file)

FugaziViewer = w3.eth.contract(
    address=FugaziCore_json["address"], abi=FugaziViewer_json["abi"]
)
FugaziPoolAction = w3.eth.contract(
    address=FugaziCore_json["address"], abi=FugaziPoolAction_json["abi"]
)

while True:
    print("*" * 50)

    # check total unclaimed orders
    totalUnclaimedOrders = (
        FugaziViewer.functions.getUnclaimedProtocolOrdersLength().call()
    )
    print(
        f"Total outstanding protocol-owned account's orders are: {totalUnclaimedOrders}"
    )

    if totalUnclaimedOrders > 0:
        # get the info about the oldest unclaimed order
        oldestUnclaimedOrder = FugaziViewer.functions.getUnclaimedProtocolOrder(
            0
        ).call()
        print(
            f"Oldest unclaimed order by protocol-owned account: \nPool Id: {oldestUnclaimedOrder[0].hex()}\nEpoch: {oldestUnclaimedOrder[1]}"
        )

        # check the pool's state
        poolInfo = FugaziViewer.functions.getPoolInfo(oldestUnclaimedOrder[0]).call()
        print(f"Pool's state: \nEpoch: {poolInfo[0]} \nLast Settlement: {poolInfo[1]}")

        if poolInfo[0] > oldestUnclaimedOrder[1]:
            print("Order is claimable")
            # claim the order
            try:
                tx = FugaziPoolAction.functions.claimProtocolOrder(
                    oldestUnclaimedOrder[0], oldestUnclaimedOrder[1]
                ).build_transaction(
                    {
                        "from": acc.address,
                        "nonce": w3.eth.get_transaction_count(acc.address),
                    }
                )
                signed_tx = w3.eth.account.sign_transaction(tx, private_key=acc.key)
                tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            except Exception as e:
                print(f"Error: {e}")

    # wait for 1 minute
    time.sleep(60)
