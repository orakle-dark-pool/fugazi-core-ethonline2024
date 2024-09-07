import os
from dotenv import load_dotenv
import json
import time
import datetime
import web3

load_dotenv()

# set Web3 and account
w3 = web3.Web3(web3.Web3.HTTPProvider("https://api.helium.fhenix.zone/"))
w3.eth.account.enable_unaudited_hdwallet_features()
acc = w3.eth.account.from_mnemonic(os.getenv("MNEMONIC"))
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
    # start of the loop
    print("*" * 50)

    # check total unclaimed orders
    totalUnclaimedOrders = FugaziViewer.functions.getUnclaimedOrdersLength().call(
        {"from": acc.address}
    )
    print(f"Total outstanding orders are: {totalUnclaimedOrders}")

    if totalUnclaimedOrders > 0:
        # get the info about the oldest unclaimed order
        oldestUnclaimedOrder = FugaziViewer.functions.getUnclaimedOrder(0).call(
            {"from": acc.address}
        )
        print(
            f"Oldest unclaimed order: \nPool Id: {oldestUnclaimedOrder[0].hex()}\nEpoch: {oldestUnclaimedOrder[1]}"
        )

        # check the pool's state
        poolInfo = FugaziViewer.functions.getPoolInfo(oldestUnclaimedOrder[0]).call()
        print(f"Pool's state: \nEpoch: {poolInfo[0]} \nLast Settlement: {poolInfo[1]}")

        if poolInfo[0] > oldestUnclaimedOrder[1]:
            print("Order is claimable")
            try:
                # claim the order
                tx = FugaziPoolAction.functions.claim(
                    oldestUnclaimedOrder[0], oldestUnclaimedOrder[1]
                ).build_transaction(
                    {
                        "from": acc.address,
                        "nonce": w3.eth.get_transaction_count(acc.address),
                    }
                )
                signed_tx = acc.sign_transaction(tx)
                tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            except Exception as e:
                print(f"Error: {e}")
        elif (
            poolInfo[0] == oldestUnclaimedOrder[1]
            and int(datetime.datetime.now().timestamp()) > poolInfo[1] + 30
        ):
            print("Order is claimable but you should settle the batch first")

            try:
                # settle the batch
                tx = FugaziPoolAction.functions.settleBatch(
                    oldestUnclaimedOrder[0]
                ).build_transaction(
                    {
                        "from": acc.address,
                        "nonce": w3.eth.get_transaction_count(acc.address),
                    }
                )
                signed_tx = acc.sign_transaction(tx)
                tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            except Exception as e:
                print(f"Error: {e}")

    time.sleep(60)
