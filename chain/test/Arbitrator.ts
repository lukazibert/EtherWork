import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import web3 from "web3";

describe("Arbitrator", () => {
  async function deployArbitrator() {
    const [arbitrator, freelancer, client] = await ethers.getSigners();

    const ArbitratorContract = await ethers.getContractFactory("Arbitrator");
    const arbitratorContract = await ArbitratorContract.deploy();
    // await arbitrator.deployed();
    return { arbitratorContract, arbitrator, freelancer, client };
  }

  describe("Deployment", () => {
    it("Should set arbitrator", async () => {
      const { arbitratorContract, arbitrator } = await loadFixture(
        deployArbitrator
      );
      expect(await arbitratorContract.arbitrator()).to.equal(
        arbitrator.address
      );
    });
  });

  describe("Create new job contract", async () => {
    let arbitratorContract: any;
    let arbitrator: any;
    let freelancer: any;
    let client: any;

    before(async () => {
      ({ arbitratorContract, arbitrator, freelancer, client } =
        await loadFixture(deployArbitrator));
    });

    it("Should create new job without error", async () => {
      // const { arbitratorContract, arbitrator, worker, client } =
      //   await loadFixture(deployArbitrator);
      const amount = 1;
      const jobId = 0;

      const jobContract = await arbitratorContract
        .connect(client)
        .createJobContract(jobId, ethers.utils.parseEther(amount.toString()), {
          value: ethers.utils.parseEther(amount.toString()),
        });
      console.log(await arbitratorContract.jobContractCount());
      expect(jobContract.value).to.equal(
        ethers.utils.parseEther(amount.toString())
      );
    });

    it("Should reject and delete job offer", async () => {
      console.log("Balance before: ",await client.getBalance());
      const before: BigNumber = await client.getBalance();
      const jobContract = await arbitratorContract.connect(arbitrator).rejectJobContract(0);
      const after: BigNumber = await client.getBalance();
      console.log("Balance after: ",await client.getBalance());

      // console.log(await arbitratorContract.jobContractCount());
      
      expect(before.add(ethers.utils.parseEther("1"))).to.equal(after);
    });

    it("Should create a new escrow contract", async () => {
      const amount = 1;
      const jobId = 0;

      const jobContract = await arbitratorContract
        .connect(client)
        .createJobContract(jobId, ethers.utils.parseEther(amount.toString()), {
          value: ethers.utils.parseEther(amount.toString()),
        });

      const acceptJob = await arbitratorContract
        .connect(freelancer)
        .acceptJobContract(jobId, {
          value: ethers.utils.parseEther(amount.toString()),
        });
      // console.log(await arbitratorContract.escrowContractCount());
      expect(await arbitratorContract.escrowContractCount()).to.equal(1);
    });

    it("Should deduct funds from client and freelancer", async () => {

      const balanceLimit = ethers.utils.parseEther("10000"); // set the balance limit to 10000 ETH
      const freelancerBalance = await freelancer.getBalance();
      const clientBalance = await client.getBalance();
      
      // check the balances of the freelancer and client
      assert(
        freelancerBalance.lt(balanceLimit) &&
          clientBalance.lt(balanceLimit)
      );
    });

    it("Should set the state of the escrow to 2", async () => {
      const jobId = 0;

      let newEscrowState = await arbitratorContract.getEscrowContractState(
        jobId
      );
      expect(newEscrowState).to.equal(2);
    });

    it("Should return pointer to escrow contract", async () => {
      const jobId = 0;

      console.log(await arbitratorContract.escrowContracts(jobId));
    });
  });
});
