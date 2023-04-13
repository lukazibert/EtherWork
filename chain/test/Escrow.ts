import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import web3 from "web3";

describe("Escrow", () => {
  async function deployEscrow() {
    // Contracts are deployed using the first signer/account by default
    const [arbitrator, worker, client] = await ethers.getSigners();
    // console.log(arbitrator);

    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(arbitrator.address);

    return { arbitrator, worker, client, escrow };
  }

  //check if arbitrator is arbitrator
  describe("Deployment", function () {
    //check if arbitrator is arbitrator
    it("Should set arbitrator", async function () {
      const { arbitrator, escrow } = await loadFixture(deployEscrow);
      expect(await escrow.arbitrator()).to.equal(arbitrator.address);
    });

    //check if state is set to 1
    it("Should set state to 1", async function () {
      const { escrow } = await loadFixture(deployEscrow);
      expect(await escrow.state()).to.equal(1);
    });
  });

  describe("Create new transaction", () => {
    it("Should increase trnasation count", async () => {
      const { worker, client, escrow } = await loadFixture(deployEscrow);
      const amount = 1;
      const previusTransactionCount = await escrow.transactionCount();
      const transaction = await escrow.createTransaction(
        client.address,
        worker.address,
        1
      );
      expect(previusTransactionCount.add(1)).to.equal(
        await escrow.transactionCount()
      );
    });

    it("Should contain same the transaction to transaction array", async () => {
      const { worker, client, escrow } = await loadFixture(deployEscrow);
      const amount = 1;
      const transaction = await escrow.createTransaction(
        client.address,
        worker.address,
        1
      );

      const currentTransactionId = (await escrow.transactionCount()).sub(1);
      const currentTransation = escrow.transactions(currentTransactionId);

      const allInfoIsCorrect =
        (await currentTransation).amount.eq(BigNumber.from(amount)) &&
        (await currentTransation).buyer == client.address &&
        (await currentTransation).seller == worker.address;

      expect(allInfoIsCorrect).to.equal(true);
    });
  });

  describe("Client deposits funds to transaction", () => {
    it("Should deduct funds from client address", async () => {
      const { worker, client, escrow } = await loadFixture(deployEscrow);
      const clientPreviusBalance = await client.getBalance();

      const amount = ethers.utils.parseEther("1");
      const transaction = await escrow.createTransaction(
        client.address,
        worker.address,
        amount
      );

      const currentTransactionId = (await escrow.transactionCount()).sub(1);

      const deposit = await escrow
        .connect(client)
        .deposit(currentTransactionId, { value: amount });

      const clientAfterBalance = await client.getBalance();

      expect(clientAfterBalance).to.equal(
        clientPreviusBalance.sub(
          amount.add(
            deposit.gasPrice?._isBigNumber
              ? deposit.gasPrice.mul(BigNumber.from(30160))
              : BigNumber.from("0")
          )
        )
      );
    });

    it("Shold set the state of the current transaction to 1", async () => {
      const { worker, client, escrow } = await loadFixture(deployEscrow);

      const amount = ethers.utils.parseEther("1");
      const transaction = await escrow.createTransaction(
        client.address,
        worker.address,
        amount
      );

      const currentTransactionId = (await escrow.transactionCount()).sub(1);

      const deposit = await escrow
        .connect(client)
        .deposit(currentTransactionId, { value: amount });
      const currentTransation = escrow.transactions(currentTransactionId);
      expect((await currentTransation).state).to.equal(1);
    });

    it("Should revert if incorrect amount deposited", async () => {
      const { worker, client, escrow } = await loadFixture(deployEscrow);

      const amount = ethers.utils.parseEther("1");
      const transaction = await escrow.createTransaction(
        client.address,
        worker.address,
        amount
      );

      const currentTransactionId = (await escrow.transactionCount()).sub(1);
      const incorrectAmount = ethers.utils.parseEther("1.5");

      await expect(
        escrow
          .connect(client)
          .deposit(currentTransactionId, { value: incorrectAmount })
      ).to.be.revertedWith("Incorrect amount deposited");
    });

    it("Should increase the value of the contract to previus value + amount deposited", async () => {
      const { worker, client, escrow } = await loadFixture(deployEscrow);

      const amount = ethers.utils.parseEther("1");
      const transaction = await escrow.createTransaction(
        client.address,
        worker.address,
        amount
      );


      const currentTransactionId = (await escrow.transactionCount()).sub(1);
      const deposit = await escrow
        .connect(client)
        .deposit(currentTransactionId, { value: amount });


      expect(amount).to.equal(await escrow.getBalance());
    });

    // describe('Ckeck consitency of funds in contract', () => { 
    //   it("Shound contain the the exact same amount of funds as all the transactions combined",async () => {
    //   const { worker, client, escrow } = await loadFixture(deployEscrow);
    //   const totalContractBalance = await escrow.getBalance();
    //   // const transactions = await escrow.transactions();
    //   console.log(escrow.transactions().map(() => {}));
    //   // const transactionsBalance = (await escrow.transactions).map((transaction) => {
    //   // for (let index = 0; index < array.length; index++) {
    //   //   const element = array[index];
        
    //   // }
    //   // })
    //   })
    //  })
  });
});
